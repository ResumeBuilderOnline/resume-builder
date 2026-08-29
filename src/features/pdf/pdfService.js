/**
 * PDF service - exports resume A4 pages to PDF using jsPDF and html2canvas.
 *
 * Each `.a4-page` preview container is rendered to one PDF page, so the
 * exported PDF matches the browser preview page-for-page.
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadBlob } from '../../utils/helpers.js';
import { sanitizeExternalUrl } from '../../utils/security.js';
/**
 * Capture a single DOM element to a canvas.
 * @param {HTMLElement} element
 * @returns {Promise<HTMLCanvasElement>}
 */
// 6x CSS resolution produces a high-resolution raster image,
// keeping small resume text sharper when zoomed or printed.
// when printed, without changing the physical A4 dimensions.
const PDF_RENDER_SCALE = 6;
const MAX_PDF_PAGES = 4;

async function captureCanvas(element, width = element.offsetWidth, height = element.offsetHeight) {
  return html2canvas(element, {
    // A browser CSS pixel is only 96 DPI. Rendering at 3x keeps the raster
    // output sharp without changing the physical A4 dimensions in the PDF.
    scale: PDF_RENDER_SCALE,
    useCORS: true,
    // Use html2canvas's normal renderer instead of foreignObjectRendering.
    // The live webview already has the correct browser layout, and the normal
    // renderer avoids foreignObject text/line-box positioning differences that
    // can cause heading text or borders to overlap nearby lines in the PDF.
    foreignObjectRendering: false,
    backgroundColor: '#ffffff',
    logging: false,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
  });
}

/**
 * Capture a single `.a4-page` at full A4 resolution.
 *
 * The page is responsively scaled (via CSS transform) for the browser
 * preview. Lifting that transform before capture guarantees the PDF is
 * rendered at full A4 resolution, then the transform is restored so the
 * preview is unaffected.
 * @param {HTMLElement} page - A `.a4-page` element.
 * @returns {Promise<HTMLCanvasElement>}
 */
async function capturePage(page) {
  const captureHost = document.createElement('div');
  const clone = page.cloneNode(true);
  // Keep the fractional CSS dimensions used by the live A4 preview.
  // offsetWidth rounds to whole pixels; that tiny width change can alter a
  // line wrap or list indentation in the detached export clone.
  const computedPageStyle = window.getComputedStyle(page);
  const width = parseFloat(computedPageStyle.width) || 793.7008;
  const height = parseFloat(computedPageStyle.height) || 1122.5197;

  // Capture an isolated full-size page. Capturing the live preview directly
  // requires html2canvas to resolve sticky, transformed and clipped parents;
  // with multiple pages that can stall the export before download begins.
  captureHost.style.cssText = [
    'position:fixed',
    // Keep the clone in the viewport-sized paint area. Chromium can omit
    // content placed far outside that area during html2canvas capture, which
    // resulted in blank second and later PDF pages on some screen sizes.
    'left:0',
    'top:0',
    `width:${width}px`,
    `height:${height}px`,
    'overflow:visible',
    'pointer-events:none',
    // html2canvas respects stacking order. A negative z-index places the
    // staging page behind the document background, yielding a blank PDF.
    // Keep it above the app only for the short capture, then remove it in
    // the finally block below.
    'z-index:2147483647',
    'background:#ffffff',
  ].join(';');
  clone.style.transform = 'none';
  // The clone already carries the preview's inline width, height, padding,
  // and column measurements. Do not replace them with rounded dimensions.
  clone.style.width = computedPageStyle.width;
  clone.style.height = computedPageStyle.height;
  captureHost.appendChild(clone);
  document.body.appendChild(captureHost);

  try {
    // Let connected styles, fonts, and layout settle before capture. Two
    // frames avoid a blank capture when exporting a page that was not visible
    // in the browser viewport just before the download began.
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return await captureCanvas(clone, width, height);
  } finally {
    captureHost.remove();
  }
}

/**
 * Normalize a link/URL to an absolute http(s) URL.
 * @param {string} url
 * @returns {string|null}
 */
function toAbsoluteUrl(url) {
  return sanitizeExternalUrl(url) || null;
}

/**
 * Add clickable link annotations to a PDF page for every `<a href>` found
 * inside the given `.a4-page` element.
 *
 * The link rectangles are computed relative to the page's unscaled (full A4)
 * layout and then transformed by the SAME scale/offset used to place the
 * rasterized image on the PDF page. This keeps links aligned with the image
 * even when the emergency scale-to-fit fallback activates (a captured page
 * taller than the PDF page), where the image is scaled down and centered.
 *
 * @param {jsPDF} pdf - The jsPDF instance.
 * @param {string} url - Link URL.
 * @param {number} x - px from left of the unscaled page.
 * @param {number} y - px from top of the unscaled page.
 * @param {number} w - link width in px.
 * @param {number} h - link height in px.
 * @param {number} scale - image scale factor (mm per page px).
 * @param {number} offsetX - horizontal placement offset (mm).
 * @param {number} offsetY - vertical placement offset (mm).
 */
function addLinkRect(pdf, url, x, y, w, h, scale, offsetX, offsetY) {
  if (!url || w <= 0 || h <= 0) return;
  const xMm = offsetX + (x * scale);
  const yMm = offsetY + (y * scale);
  const wMm = w * scale;
  const hMm = h * scale;
  pdf.link(xMm, yMm, wMm, hMm, { url });
}

/**
 * Collect clickable links from a rendered `.a4-page`, returning rectangles
 * in the page's unscaled coordinate space.
 * @param {HTMLElement} page - A `.a4-page` element (transform lifted).
 * @returns {Array<{url: string, x: number, y: number, w: number, h: number}>}
 */
function collectPageLinks(page) {
  const rects = [];
  const anchors = page.querySelectorAll('a[href]');
  const pageRect = page.getBoundingClientRect();
  anchors.forEach((a) => {
    const url = toAbsoluteUrl(a.getAttribute('href'));
    if (!url) return;
    const r = a.getBoundingClientRect();
    const x = r.left - pageRect.left;
    const y = r.top - pageRect.top;
    const w = r.width;
    const h = r.height;
    if (w > 0 && h > 0) {
      rects.push({ url, x, y, w, h });
    }
  });
  return rects;
}

/**
 * Add all clickable link annotations for a captured page.
 * @param {jsPDF} pdf
 * @param {HTMLElement} page - `.a4-page` element (transform lifted during capture).
 * @param {number} pageHeightPx - unscaled page pixel height.
 * @param {number} scale - image scale factor (mm per page px).
 * @param {number} offsetX - horizontal placement offset (mm).
 * @param {number} offsetY - vertical placement offset (mm).
 */
function addPageLinks(pdf, page, pageHeightPx, scale, offsetX, offsetY) {
  const links = collectPageLinks(page);
  for (const { url, x, y, w, h } of links) {
    addLinkRect(pdf, url, x, y, w, h, scale, offsetX, offsetY);
  }
}

/**
 * Export a resume preview (its `.a4-pages` container) to a PDF.
 * Each `.a4-page` child becomes one PDF page.
 *
 * @param {HTMLElement} previewRoot - Element containing `.a4-page` children.
 * @param {object} [options]
 * @param {string} [options.filename]
 * @param {string} [options.format] - 'a4' (default)
 * @param {string} [options.orientation] - 'portrait' (default)
 * @returns {Promise<Blob>}
 */
export async function exportElementToPDF(previewRoot, options = {}) {
  const {
    filename = 'resume.pdf',
    format = 'a4',
    orientation = 'portrait',
  } = options;

const pages = previewRoot.querySelectorAll('.a4-page');

  if (pages.length === 0) {
    throw new Error('No A4 pages found to export.');
  }

  if (pages.length > MAX_PDF_PAGES) {
    throw new Error(
      `Resume exceeds the maximum allowed PDF page limit of ${MAX_PDF_PAGES} pages.`
    );
  }

  const pdf = new jsPDF({ orientation, unit: 'mm', format, compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

for (let i = 0; i < pages.length; i++) {
    // Each `.a4-page` maps to exactly ONE PDF page. Capture at full A4
    // resolution (transform lifted) so the PDF matches the preview 1:1.
    // A4 pages are always rendered at 210mm / 96dpi (793.7px). html2canvas
    // can temporarily report zero for the live element while it clones it.
    const pageWidthPx = parseFloat(window.getComputedStyle(pages[i]).width) || 793.7008;
    const canvas = await capturePage(pages[i]);
    const imgData = canvasToImage(canvas);
    const imgWidth = pageWidth;
    const imgHeight = pageHeight;

if (i > 0) pdf.addPage();

    // Compute the image placement (scale + offsets) so link annotations use
    // the EXACT same transform as the rasterized image. This keeps links
    // aligned even when the emergency scale-to-fit fallback activates.
    let scale, offsetX, offsetY;
    if (imgHeight <= pageHeight) {
      // Normal case: full width, centered vertically. mm per canvas px.
      scale = pageWidth / pageWidthPx;
      // Use the same uniform scale for both axes so proportions match.
      offsetX = 0;
      offsetY = (pageHeight - imgHeight) / 2; // center vertically
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // NEVER render beyond the PDF page boundary. Treat this as an emergency
      // safety check (not normal pagination): scale the ENTIRE page down to
      // fit within the PDF page so no content is ever clipped.
      const s = pageHeight / imgHeight; // uniform scale (mm per mm)
      scale = s * (pageWidth / pageWidthPx);
      offsetX = (pageWidth - imgWidth * s) / 2; // center horizontally
      offsetY = (pageHeight - imgHeight * s) / 2; // center vertically
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth * s, imgHeight * s, undefined, 'FAST');
    }

    // Add clickable link annotations that align with the rasterized page.
    addPageLinks(pdf, pages[i], canvas.height, scale, offsetX, offsetY);
  }

  const blob = pdf.output('blob');
  downloadBlob(blob, filename);
  return blob;
}

/**
 * Encode a canvas as a lossless PNG so small text stays crisp in the PDF.
 * @param {HTMLCanvasElement} canvas
 * @returns {string}
 */
function canvasToImage(canvas) {
  // PNG is lossless. JPEG's chroma compression makes small resume text look
  // fuzzy even when the canvas itself is high resolution.
  return canvas.toDataURL('image/png');
}

/**
 * Export a resume's preview to PDF and trigger download.
 * @param {HTMLElement} previewRoot
 * @param {object} resume
 */
export async function exportResumeToPDF(previewRoot, resume) {
  const name = resume?.personal?.fullName || 'resume';
  const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
  if (previewRoot) {
    await exportElementToPDF(previewRoot, { filename });
  }
}

/**
 * Export resume preview to PDF and return as a blob.
 * @param {HTMLElement} previewRoot
 * @param {object} [options]
 * @returns {Promise<Blob|null>}
 */
export async function resumeToBlob(previewRoot, options = {}) {
  if (!previewRoot) return null;
  const pages = previewRoot.querySelectorAll('.a4-page');

  if (pages.length === 0) return null;

  if (pages.length > MAX_PDF_PAGES) {
    throw new Error(
      `Resume exceeds the maximum allowed PDF page limit of ${MAX_PDF_PAGES} pages.`
    );
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

for (let i = 0; i < pages.length; i++) {
    // Each `.a4-page` maps to exactly ONE PDF page (no slicing).
    const pageWidthPx = parseFloat(window.getComputedStyle(pages[i]).width) || 793.7008;
    const canvas = await capturePage(pages[i]);
    const imgData = canvasToImage(canvas);
    const imgWidth = pageWidth;
    const imgHeight = pageHeight;
if (i > 0) pdf.addPage();
    // Compute the image placement (scale + offsets) so link annotations use
    // the EXACT same transform as the rasterized image.
    let scale, offsetX, offsetY;
    if (imgHeight <= pageHeight) {
      scale = pageWidth / pageWidthPx;
      offsetX = 0;
      offsetY = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Emergency safety check (never normal behavior): scale the ENTIRE
      // page to fit within the PDF page so no content is ever clipped.
      const s = pageHeight / imgHeight;
      scale = s * (pageWidth / pageWidthPx);
      offsetX = (pageWidth - imgWidth * s) / 2;
      offsetY = (pageHeight - imgHeight * s) / 2;
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth * s, imgHeight * s, undefined, 'FAST');
    }
    // Add clickable link annotations aligning with the rasterized page.
    addPageLinks(pdf, pages[i], canvas.height, scale, offsetX, offsetY);
  }

  return pdf.output('blob');
}

/**
 * Download a JSON backup of a resume.
 * @param {object} resume
 */
export function exportResumeJSON(resume) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: 'application/json',
  });
  const name = resume?.personal?.fullName || 'resume';
  downloadBlob(blob, `${name.replace(/\s+/g, '_')}_resume.json`);
}

export default {
  exportElementToPDF,
  exportResumeToPDF,
  resumeToBlob,
  exportResumeJSON,
};
