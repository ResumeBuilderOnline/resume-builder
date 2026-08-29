/**
 * PaginatedResume
 *
 * Renders a template into a hidden measurement container, measures its
 * content blocks (including their margins), paginates them into strict A4
 * page containers, and renders each page by CLONING the template's ROOT
 * element and hiding the blocks that belong to other pages.
 *
 * Cloning the root (rather than only the `[data-block]` elements) preserves
 * the template's wrapper structure and classes, so all scoped CSS continues
 * to apply (e.g. `.basic-template .basic-item`, `.modern-template .modern-main`).
 * Each `.a4-page` corresponds to exactly one PDF page.
 *
 * PAGINATION RULES
 * - Move only the overflowing logical elements to the next page, never an
 *   entire section.
 * - Keep a section heading with its first entry when both fit together.
 * - Keep individual entries together whenever they fit on a page.
 * - Move an entry to the next page if it does not fit in the remaining space.
 * - If a single entry is LARGER than the full A4 content area, split it
 *   internally into its child elements (recursively) so no content is ever
 *   clipped or hidden. Each split piece participates in normal pagination.
 *
 * To keep measurements faithful, the measurement container is laid out with
 * the SAME geometry as the final pages (width, paddings, dual-column widths),
 * so block heights and margins are measured at the exact sizes they will
 * occupy when rendered. No new dependencies.
 */
import React, { useLayoutEffect, useRef } from 'react';
import { paginateColumn, paginateDualColumns } from './pagination.js';

const MM_PER_PX = 96 / 25.4; // ~3.7795
const GAP = 0; // spacing between blocks is handled by CSS margins
// Browser layout can round fractional pt/mm values differently between the
// hidden measuring tree, the live page, and html2canvas. Reserving a few CSS
// pixels at the bottom means the final line is always kept inside the A4 page
// instead of being clipped by that rounding difference.
const PAGE_FIT_GUARD = 12;

// A4 portrait dimensions in mm
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

function mmToPx(mm) {
  return mm * MM_PER_PX;
}

const toPx = (v) => parseFloat(v) || 0;

/**
 * Vertical box (border + padding) of an element, in px.
 * Used so a split block's measured height exactly matches its rendered height
 * (the parent's vertical padding/border is re-applied on every page where a
 * piece of the block is shown).
 * @param {HTMLElement} el
 * @returns {number}
 */
function getBoxExtra(el) {
  const cs = window.getComputedStyle(el);
  return (
    toPx(cs.paddingTop) +
    toPx(cs.paddingBottom) +
    toPx(cs.borderTopWidth) +
    toPx(cs.borderBottomWidth)
  );
}

/**
 * Vertical box (border + padding) of the TOP edge of an element, in px.
 * Shown only on the page containing the block's FIRST split unit.
 */
function getTopBox(el) {
  const cs = window.getComputedStyle(el);
  return toPx(cs.paddingTop) + toPx(cs.borderTopWidth);
}

/**
 * Vertical box (border + padding) of the BOTTOM edge of an element, in px.
 * Shown only on the page containing the block's LAST split unit.
 */
function getBottomBox(el) {
  const cs = window.getComputedStyle(el);
  return toPx(cs.paddingBottom) + toPx(cs.borderBottomWidth);
}

/**
 * Resolve a usable line-height (px) for an element so oversized text can be
 * split at whole-line (logical) boundaries instead of arbitrary pixel cuts.
 * @param {HTMLElement} el
 * @returns {number}
 */
function getLineHeight(el) {
  const cs = window.getComputedStyle(el);
  const lh = cs.lineHeight;
  if (lh && lh !== 'normal') {
    const px = parseFloat(lh);
    if (!Number.isNaN(px) && px > 0) return px;
  }
  const fs = parseFloat(cs.fontSize) || 16;
  return Math.round(fs * 1.4);
}

/**
 * Build the physical page dimensions (px) from template config.
 */
function getPageGeometry(config) {
  const page = config?.page || {};
  const marginTop = mmToPx(page.marginTop ?? 17);
  const marginBottom = mmToPx(page.marginBottom ?? 17);
  const marginLeft = mmToPx(page.marginLeft ?? 17);
  const marginRight = mmToPx(page.marginRight ?? 17);

  const pageWidth = mmToPx(PAGE_WIDTH_MM);
  const pageHeight = mmToPx(PAGE_HEIGHT_MM);
  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentHeight = pageHeight - marginTop - marginBottom;

  return {
    pageWidth,
    pageHeight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    contentWidth,
    contentHeight,
  };
}

/**
 * Recursively split a block's content into pagination units.
 *
 * Each unit is a LEAF in the block's DOM tree that can fit on a page.
 * `path` is the array of child indices from the block down to the leaf.
 * This is what lets an oversized entry break across pages internally
 * instead of being clipped. A leaf with no children that is still taller
 * than a page is SLICED into vertical strips (`slice`), so even a
 * pathological single-line/paragraph leaf is never clipped.
 *
 * @param {HTMLElement} el - current element being split.
 * @param {number} blockIndex - index of the owning [data-block].
 * @param {number[]} parentPath - indices from the block to this element.
 * @param {number} contentHeight - available content height on one page.
 * @param {number} mt - effective top margin for this element.
 * @param {number} mb - effective bottom margin for this element.
* @param {string} kind - block kind ('header' | 'heading' | 'entry').
 * @param {Array} out - accumulator for resulting units.
 * @param {number} box - vertical box (padding + border) of the block being split.
 */
function splitIntoUnits(el, blockIndex, parentPath, contentHeight, mt, mb, kind, out, topBox, botBox) {
  const children = Array.from(el.children);
  if (children.length === 0) {
    const height = el.offsetHeight;
    // A leaf that cannot fit on any page (height + top margin exceeds the
    // page) is sliced into fit-sized strips so nothing is clipped.
    if (height + mt > contentHeight) {
      sliceLeaf(el, blockIndex, parentPath, contentHeight, mt, mb, kind, out, topBox, botBox);
    } else {
      out.push({ blockIndex, path: parentPath, height, mt, mb, kind, topBox, botBox });
    }
    return;
  }
  // Pre-compute desired split so we can attribute the block's top/bottom box
  // to the first/last produced unit (preserving the block's total height).
  const plain = [];
  children.forEach((child, ci) => {
    const cs = window.getComputedStyle(child);
    const cMt = ci === 0 ? mt : toPx(cs.marginTop);
    const cMb = ci === children.length - 1 ? mb : toPx(cs.marginBottom);
    const cHeight = child.offsetHeight;
    if (cHeight + cMt > contentHeight) {
      splitIntoUnits(
        child,
        blockIndex,
        parentPath.concat(ci),
        contentHeight,
        cMt,
        cMb,
        kind,
        plain,
        0,
        0
      );
    } else {
      plain.push({
        blockIndex,
        path: parentPath.concat(ci),
        height: cHeight,
        mt: cMt,
        mb: cMb,
        kind,
        topBox: 0,
        botBox: 0,
      });
    }
  });

  if (plain.length === 0) return;
  // Attribute the block's TOP box to the first produced unit and its BOTTOM
  // box to the last produced unit so the total measured height of the split
  // block equals its real offsetHeight (the box is rendered only once).
  plain[0].height += topBox || 0;
  plain[0].topBox = (plain[0].topBox || 0) + (topBox || 0);
  plain[plain.length - 1].height += botBox || 0;
  plain[plain.length - 1].botBox = (plain[plain.length - 1].botBox || 0) + (botBox || 0);
  plain.forEach((u) => out.push(u));
}

/**
 * Split a leaf element (no children) that is taller than the content area into
 * vertical strips. Each strip is a pagination unit with a `slice` range so the
 * renderer can clip the leaf to show only that portion. This guarantees no
 * oversized leaf content is ever clipped — it flows across pages.
 *
 * When the leaf holds text (has a valid line-height), the strips are aligned to
 * WHOLE lines so normal resume text is split at logical boundaries instead of
 * arbitrary pixel cuts. This keeps lines readable and never splits a line text
 * in the middle.
 *
 * The parent block's vertical box (padding + border) is preserved on the FIRST
 * and LAST strip so the measured height of the split block exactly matches the
 * final rendered height (the parent's box is re-applied once per block across
 * all its pages).
 *
 * @param {HTMLElement} el - the oversized leaf element.
 * @param {number} blockIndex
 * @param {number[]} parentPath
 * @param {number} contentHeight
 * @param {number} mt
 * @param {number} mb
* @param {string} kind
* @param {Array} out - accumulator for resulting units.
 * @param {number} topBox - the owning block's TOP vertical box (paddingTop + borderTop).
 * @param {number} botBox - the owning block's BOTTOM vertical box (paddingBottom + borderBottom).
 */
function sliceLeaf(el, blockIndex, parentPath, contentHeight, mt, mb, kind, out, topBox, botBox) {
  const full = el.offsetHeight;
  const box = getBoxExtra(el);
  // Reserve room for the top margin + this leaf's own top box on the first
  // strip so `height + mt` never exceeds the page.
  const available = contentHeight - mt - box - 1;
  const line = getLineHeight(el);
  const step = line > 0 ? Math.max(line, 1) : 1;
  const linesPerStrip = Math.max(1, Math.floor(available / step));
  const stripH = linesPerStrip * step;

  const count = Math.max(1, Math.ceil(full / stripH));
  for (let i = 0; i < count; i++) {
    const start = i * stripH;
    const end = Math.min(start + stripH, full);
    let height = end - start;
    let uTop = 0;
    let uBot = 0;
    // Attribute the owning block's TOP box to the first strip and its BOTTOM
    // box to the last strip so the total measured height of the split block
    // equals its real offsetHeight (the box is rendered only once).
    if (i === 0) {
      height += topBox || 0;
      uTop = topBox || 0;
    }
    if (i === count - 1) {
      height += botBox || 0;
      uBot = botBox || 0;
    }
    out.push({
      blockIndex,
      path: parentPath,
      height,
      mt: i === 0 ? mt : 0,
      mb: i === count - 1 ? mb : 0,
      kind,
      topBox: uTop,
      botBox: uBot,
      slice: { start, end, full },
    });
  }
}

/**
 * Resolve a DOM node given a path of child indices from a start node.
 * @param {HTMLElement} node - start node (a [data-block]).
 * @param {number[]} path
 * @returns {HTMLElement|null}
 */
function getNodeByPath(node, path) {
  let cur = node;
  for (const i of path) {
    if (!cur || !cur.children[i]) return null;
    cur = cur.children[i];
  }
  return cur;
}

/**
 * Collect pagination units from a flow element.
 *
 * Normal blocks produce ONE unit (shown whole). A block whose height + top
 * margin exceeds the content area (i.e. it cannot fit on any page whole) is
 * split recursively into child units so it can be carried across pages
 * without ever clipping content. Splitting is based on `height + mt`, not
 * raw height, so no whole block can ever overflow a page.
 *
 * The parent block's vertical box (padding + border) is preserved: it is
 * added to the first and last split unit so the total measured height of the
 * split block equals the block's full offsetHeight (the parent's box is shown
 * once across all its pages). This keeps the measured height exactly matching
 * the final rendered height.
 *
 * @param {HTMLElement} flow - a `[data-flow]` element.
 * @param {number} contentHeight - available content height on one page.
 * @returns {Array<{blockIndex, path, height, mt, mb, kind, box}>}
 */
export function collectBlocks(flow, contentHeight) {
  if (!flow) return [];
  const units = [];
  Array.from(flow.querySelectorAll('[data-block]')).forEach((el, index) => {
    const style = window.getComputedStyle(el);
    const height = el.offsetHeight;
    const mt = toPx(style.marginTop);
    const mb = toPx(style.marginBottom);
    const kind = el.getAttribute('data-block-kind') || 'entry';
    const topBox = getTopBox(el);
    const botBox = getBottomBox(el);

    // Split when the block cannot fit on any single page (height + top margin
    // exceeds the page). Leaves that are still oversized are sliced so no
    // content is ever clipped.
    if (height + mt > contentHeight && el.children.length > 0) {
      splitIntoUnits(el, index, [], contentHeight, mt, mb, kind, units, topBox, botBox);
    } else if (height + mt > contentHeight) {
      // Pathological leaf (no children) taller than a page: slice it.
      sliceLeaf(el, index, [], contentHeight, mt, mb, kind, units, topBox, botBox);
    } else {
      units.push({ blockIndex: index, path: [], height, mt, mb, kind, topBox, botBox });
    }
  });

  // Mark which unit is the FIRST and which is the LAST piece of its block.
  // The block's own vertical box (padding/border) and margins are then
  // rendered only on the page carrying the first piece (top spacing) and the
  // page carrying the last piece (bottom spacing). This makes the MEASURED
  // height exactly equal the RENDERED height on every page of a split block:
  // intermediate pages never duplicate the parent's spacing.
  const firstIdx = new Map();
  const lastIdx = new Map();
  units.forEach((u, idx) => {
    if (!firstIdx.has(u.blockIndex)) firstIdx.set(u.blockIndex, idx);
    lastIdx.set(u.blockIndex, idx);
  });
  units.forEach((u, idx) => {
    u.first = firstIdx.get(u.blockIndex) === idx;
    u.last = lastIdx.get(u.blockIndex) === idx;
  });
  return units;
}

/**
 * Hide children of `node` that are NOT on any of the given leaf paths.
 * An empty path `[]` means "show the whole node" (no hiding).
 *
 * @param {HTMLElement} node - element to hide children within.
 * @param {Array<{path: number[], slice: object|null}>} entries - leaf entries
 *   (path + optional slice range) that SHOULD be shown.
 */
function hideByEntries(node, entries) {
  // If any entry has an empty path, show the whole node (no per-child hiding).
  if (entries.length === 0) return;
  if (entries.some((e) => e.path.length === 0)) return;

  const byFirst = new Map();
  entries.forEach((e) => {
    const first = e.path[0];
    if (!byFirst.has(first)) byFirst.set(first, []);
    byFirst.get(first).push({ path: e.path.slice(1), slice: e.slice });
  });
  Array.from(node.children).forEach((child, ci) => {
    if (byFirst.has(ci)) {
      hideByEntries(child, byFirst.get(ci));
    } else {
      child.style.display = 'none';
    }
  });
}

/**
 * Apply a vertical slice clip to a leaf element so only the [start, end)
 * portion is visible. The element is given the exact slice height and its
 * content is shifted up so the correct portion shows; overflow is hidden so
 * nothing bleeds. This keeps the on-page layout height equal to the reserved
 * slice height, so subsequent blocks stay correctly positioned on the page.
 *
 * CRITICAL: the leaf's own CSS margins are neutralized to EXACTLY match the
 * measured unit margins (`mt`/`mb`). Only the FIRST strip keeps the top
 * margin and only the LAST strip keeps the bottom margin; intermediate
 * strips have both zeroed so no vertical spacing is duplicated across split
 * pages. This guarantees Measured Height === Actual Rendered Height for
 * oversized leaves (the parent entry can no longer inject its spacing into
 * every split portion).
 *
 * @param {HTMLElement} el
 * @param {{start:number,end:number,full:number}} slice
 * @param {number} mt - measured top margin for this strip (px)
 * @param {number} mb - measured bottom margin for this strip (px)
 */
function applySlice(el, slice, mt, mb) {
  if (!slice) return;

  const h = slice.end - slice.start;

  // The pagination measurement uses the total rendered box height.
  // Use border-box so padding and borders are included inside h.
  el.style.boxSizing = 'border-box';
  el.style.height = `${h}px`;
  el.style.overflow = 'hidden';

  if (slice.start > 0) {
    el.style.transform = `translateY(-${slice.start}px)`;
  } else {
    el.style.transform = '';
  }

  // First strip keeps top margin; last strip keeps bottom margin.
  // Intermediate strips receive neither, preventing duplicated spacing.
  el.style.marginTop = `${mt || 0}px`;
  el.style.marginBottom = `${mb || 0}px`;
}

/**
 * Given a flow element and the units assigned to one page, hide every block
 * (and, for split blocks, every child) that is NOT on this page, and apply
 * slice clips to any sliced leaves.
 *
 * @param {HTMLElement} flowEl - cloned flow element to operate on.
 * @param {Array<{blockIndex, path, slice}>} units - units placed on this page.
 */
function hideUnits(flowEl, units) {
  const blockMap = new Map();
  units.forEach((u) => {
    if (!blockMap.has(u.blockIndex)) blockMap.set(u.blockIndex, []);
    blockMap
      .get(u.blockIndex)
      .push({
        path: u.path || [],
        slice: u.slice || null,
        mt: u.mt || 0,
        mb: u.mb || 0,
        first: !!u.first,
        last: !!u.last,
      });
  });
  flowEl.querySelectorAll('[data-block]').forEach((node, i) => {
    if (blockMap.has(i)) {
      const entries = blockMap.get(i);
      // If any entry is a whole-block (empty path), show whole block.
      if (entries.some((e) => e.path.length === 0)) return;
      hideByEntries(node, entries);
      // Apply slice clipping to the resolve leaf nodes. Pass the measured
      // margins so the leaf's rendered margins EXACTLY match what was
      // measured: first strip keeps top margin, last strip keeps bottom
      // margin, intermediate strips get none.
      entries.forEach((e) => {
        if (e.slice) {
          const leaf = getNodeByPath(node, e.path);
          if (leaf) applySlice(leaf, e.slice, e.mt, e.mb);
        }
      });

      // Box-management for split blocks: the block element is cloned in full
      // on EVERY page that shows a piece of it. Its vertical padding/border
      // AND margins must appear only on the page carrying the FIRST piece
      // (top spacing) and the page carrying the LAST piece (bottom spacing).
      // On every other page we neutralize the box and margins so the measured
      // height matches the rendered height exactly and no spacing is
      // duplicated on continuation pages.
      const isFirst = entries.some((e) => e.first);
      const isLast = entries.some((e) => e.last);
      if (!isFirst) {
        node.style.paddingTop = '0px';
        node.style.borderTopWidth = '0px';
        node.style.marginTop = '0px';
      }
      if (!isLast) {
        node.style.paddingBottom = '0px';
        node.style.borderBottomWidth = '0px';
        node.style.marginBottom = '0px';
      }
    } else {
      node.style.display = 'none';
    }
  });
}

/**
 * Create a single-column A4 page by cloning the template root (which is the
 * flow, `data-flow="main"`) and hiding non-page blocks.
 */
function createSingleColumnPage(flow, pageUnits, geo) {
  const page = document.createElement('div');
  page.className = 'a4-page a4-single';
  page.style.width = `${geo.pageWidth}px`;
  page.style.height = `${geo.pageHeight}px`;
  page.style.padding = `${geo.marginTop}px ${geo.marginRight}px ${geo.marginBottom}px ${geo.marginLeft}px`;

  const clone = flow.cloneNode(true);
  hideUnits(clone, pageUnits);
  page.appendChild(clone);
  return page;
}

/**
 * Create a dual-column A4 page by cloning the template root (which contains
 * both `data-flow="main"` and `data-flow="side"`) and setting the two-column
 * layout via inline styles so the template's scoped CSS keeps applying.
 */
function createDualColumnPage(root, mainUnits, sideUnits, geo, config) {
  const page = document.createElement('div');
  page.className = 'a4-page a4-dual';
  page.style.width = `${geo.pageWidth}px`;
  page.style.height = `${geo.pageHeight}px`;
  page.style.padding = `${geo.marginTop}px ${geo.marginRight}px ${geo.marginBottom}px ${geo.marginLeft}px`;

  const { mainWidth, sideWidth, gapPx } = getColumnWidths(geo, config);

  const clone = root.cloneNode(true);
  clone.style.display = 'flex';
  clone.style.flexDirection = 'row';
  clone.style.alignItems = 'flex-start';
  clone.style.gap = `${gapPx}px`;

  const mainEl = clone.querySelector('[data-flow="main"]');
  const sideEl = clone.querySelector('[data-flow="side"]');
  if (mainEl) {
    mainEl.style.width = `${mainWidth}px`;
    mainEl.style.minWidth = '0';
    hideUnits(mainEl, mainUnits);
  }
  if (sideEl) {
    sideEl.style.width = `${sideWidth}px`;
    sideEl.style.minWidth = '0';
    hideUnits(sideEl, sideUnits);
  }

  page.appendChild(clone);
  return page;
}

/**
 * Compute the two-column widths shared by measurement and rendering.
 */
function getColumnWidths(geo, config) {
  const cc = config?.columnsConfig || { main: 0.62, side: 0.38 };
  const gapPx = 16;
  const mainWidth = geo.contentWidth * (cc.main ?? 0.62) - gapPx / 2;
  const sideWidth = geo.contentWidth * (cc.side ?? 0.38) - gapPx / 2;
  return { mainWidth, sideWidth, gapPx };
}

/**
 * Compute a scale factor so the A4 page (pageWidth px) fits inside a
 * container of containerWidth px. Never scales up beyond 1 (full size).
 */
function computeFitScale(containerWidth, pageWidth) {
  if (!containerWidth || containerWidth <= 0) return 1;
  const PAGE_PADDING = 8; // small breathing room inside the preview panel
  const available = containerWidth - PAGE_PADDING;
  const scale = available / pageWidth;
  return Math.min(scale, 1);
}

export default function PaginatedResume({ templateId, config, children }) {
  const measureRef = useRef(null);
  const pagesRef = useRef(null);
  const viewportRef = useRef(null);
  const cleanupRef = useRef(null);

  useLayoutEffect(() => {
    const measureRoot = measureRef.current;
    const pagesRoot = pagesRef.current;
    const viewport = viewportRef.current;
    if (!measureRoot || !pagesRoot || !viewport) return;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const geo = getPageGeometry(config);
    const columns = config?.columns || 'single';

    // Size the measurement container to the content width (page minus
    // horizontal margins) so blocks are measured at the same width they will
    // occupy within a paginated page.
    measureRoot.style.width = `${geo.contentWidth}px`;

    // The template's root element is the first child of the measurement
    // container (e.g. `.basic-template`, `.modern-template`, `.ats-template`).
    const root = measureRoot.firstElementChild;

    let pageEls = [];

    if (columns === 'dual') {
      const mainFlow = measureRoot.querySelector('[data-flow="main"]');
      const sideFlow = measureRoot.querySelector('[data-flow="side"]');

      // Lay out the measurement container as the real dual-column layout so
      // blocks are measured at the exact widths (and margins) they will
      // occupy on the page. Otherwise sidebar text wraps differently when
      // rendered, causing misaligned columns and inaccurate heights.
      const { mainWidth, sideWidth, gapPx } = getColumnWidths(geo, config);

      if (root) {
        root.style.display = 'flex';
        root.style.flexDirection = 'row';
        root.style.alignItems = 'flex-start';
        root.style.gap = `${gapPx}px`;
      }
      if (mainFlow) {
        mainFlow.style.width = `${mainWidth}px`;
        mainFlow.style.minWidth = '0';
      }
      if (sideFlow) {
        sideFlow.style.width = `${sideWidth}px`;
        sideFlow.style.minWidth = '0';
      }

      const usableContentHeight = geo.contentHeight - PAGE_FIT_GUARD;
      const mainUnits = collectBlocks(mainFlow, usableContentHeight);
      const sideUnits = collectBlocks(sideFlow, usableContentHeight);
      const groups = paginateDualColumns(
        mainUnits,
        sideUnits,
        usableContentHeight,
        GAP
      );
      pageEls = groups.map((g) =>
        createDualColumnPage(root, g.main, g.side, geo, config)
      );
    } else {
      const flow = measureRoot.querySelector('[data-flow="main"]');
      const usableContentHeight = geo.contentHeight - PAGE_FIT_GUARD;
      const units = collectBlocks(flow, usableContentHeight);
      const groups = paginateColumn(units, usableContentHeight, GAP);
      pageEls = groups.map((g) => createSingleColumnPage(flow, g, geo));
    }

    // Replace pages (pure DOM, outside React reconciliation)
    pagesRoot.innerHTML = '';
    if (pageEls.length === 0) {
      // Fallback: render a single empty A4 page
      const empty = document.createElement('div');
      empty.className = 'a4-page a4-single';
      empty.style.width = `${geo.pageWidth}px`;
      empty.style.height = `${geo.pageHeight}px`;
      empty.style.padding = `${geo.marginTop}px ${geo.marginRight}px ${geo.marginBottom}px ${geo.marginLeft}px`;
      pageEls.push(empty);
    }
    pageEls.forEach((p) => pagesRoot.appendChild(p));

    // ---- Responsive fit-to-width scaling ----
    // Wrap each page in a placeholder that reserves the A4 layout box, then
    // scale the actual page visually to fit the available viewport width.
    // The physical A4/PDF dimensions are never changed.
    const pages = Array.from(pagesRoot.children);

    pages.forEach((page) => {
      const holder = document.createElement('div');
      holder.className = 'a4-holder';
      holder.style.width = `${geo.pageWidth}px`;
      holder.style.height = `${geo.pageHeight}px`;
      page.style.transformOrigin = 'top left';
      page.parentNode.insertBefore(holder, page);
      holder.appendChild(page);
    });

    const applyScale = () => {
      const availableWidth = viewport.clientWidth;
      const scale = computeFitScale(availableWidth, geo.pageWidth);
      pages.forEach((page) => {
        page.style.transform = `scale(${scale})`;
      });
      // Resize each holder to the scaled A4 dimensions so the scaled page
      // fits and centers within the (possibly narrow) preview panel.
      pages.forEach((page) => {
        const holder = page.parentNode;
        if (holder) {
          holder.style.width = `${geo.pageWidth * scale}px`;
          holder.style.height = `${geo.pageHeight * scale}px`;
        }
      });
    };

    applyScale();

    const ro = new ResizeObserver(() => applyScale());
    ro.observe(viewport);
    // Also observe the preview wrapper container for responsive changes.
    if (viewport.parentElement) ro.observe(viewport.parentElement);
    window.addEventListener('resize', applyScale);

    cleanupRef.current = () => {
      ro.disconnect();
      window.removeEventListener('resize', applyScale);
    };
  }, [children, templateId, config]);

  return (
    <>
      {/* Hidden measurement container (kept in layout for accurate heights).
          visibility:hidden guarantees it is never painted (no overlap with the
          paginated pages) while still allowing offsetHeight measurement. */}
      <div
        ref={measureRef}
        className="paginate-measure"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          width: `${mmToPx(PAGE_WIDTH_MM)}px`,
          contain: 'layout',
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Rendered A4 pages, scaled to fit the available preview width */}
      <div ref={viewportRef} className="a4-viewport">
        <div ref={pagesRef} className="a4-pages" />
      </div>
    </>
  );
}
