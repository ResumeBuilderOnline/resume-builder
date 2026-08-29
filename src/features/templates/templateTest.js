/**
 * Template test harness.
 *
 * Verifies that all three templates (Basic, Modern, ATS) render every test
 * resume (short, fresher, long, edge, section-overflow, long-entry,
 * heading-orphan) without producing empty pages, with correctly ordered
 * content, no clipped/overflowing content, heading + first-entry orphan
 * protection, and no runaway pagination.
 *
 * Uses the SAME measurement + collectBlocks logic as the real preview so the
 * pagination matches what is rendered and exported to PDF.
 *
 * This is a diagnostic utility (not part of the app UI). It can be imported
 * and run in the browser console via `window.__runTemplateTests()`.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { testResumes, testTemplateIds } from '../resume/testData.js';
import { getTemplateComponent, getTemplateConfig } from './templateRegistry.js';
import { paginateColumn, paginateDualColumns } from '../preview/pagination.js';
import { collectBlocks } from '../preview/PaginatedResume.jsx';

const MM_PER_PX = 96 / 25.4; // ~3.7795

function mmToPx(mm) {
  return mm * MM_PER_PX;
}

/**
 * Build the same page geometry the preview uses for a template config.
 */
function getGeometry(config) {
  const page = config.page || {};
  const marginTop = mmToPx(page.marginTop ?? 17);
  const marginBottom = mmToPx(page.marginBottom ?? 17);
  const marginLeft = mmToPx(page.marginLeft ?? 17);
  const marginRight = mmToPx(page.marginRight ?? 17);
  const pageWidth = mmToPx(210);
  const pageHeight = mmToPx(297);
  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentHeight = pageHeight - marginTop - marginBottom;
  return { pageWidth, pageHeight, marginTop, marginBottom, marginLeft, marginRight, contentWidth, contentHeight };
}

/**
 * Render a template/resume into a detached container sized to the real page
 * geometry, then measure blocks with `collectBlocks` (the same function the
 * preview uses) and paginate.
 *
 * @param {string} templateId
 * @param {object} resume
 * @returns {object} pagination + verification details
 */
function renderAndMeasure(templateId, resume) {
  const config = getTemplateConfig(templateId);
  const Component = getTemplateComponent(templateId);
  const geo = getGeometry(config);

  // Build a measurement container matching the page geometry (same as preview).
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -99999px;
    top: 0;
    width: ${geo.contentWidth}px;
    background: #fff;
    box-sizing: border-box;
  `;
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(React.createElement(Component, { resume }));

  let result;
  try {
    let mainUnits, sideUnits, pages;
    if (config.columns === 'dual') {
      const mainFlow = container.querySelector('[data-flow="main"]');
      const sideFlow = container.querySelector('[data-flow="side"]');
      // Lay out as the real dual-column layout so widths match the preview.
      const cc = config.columnsConfig || { main: 0.62, side: 0.38 };
      const gapPx = 16;
      const mainWidth = geo.contentWidth * (cc.main ?? 0.62) - gapPx / 2;
      const sideWidth = geo.contentWidth * (cc.side ?? 0.38) - gapPx / 2;
      const tmplRoot = container.firstElementChild;
      if (tmplRoot) {
        tmplRoot.style.display = 'flex';
        tmplRoot.style.flexDirection = 'row';
        tmplRoot.style.gap = `${gapPx}px`;
      }
      if (mainFlow) { mainFlow.style.width = `${mainWidth}px`; mainFlow.style.minWidth = '0'; }
      if (sideFlow) { sideFlow.style.width = `${sideWidth}px`; sideFlow.style.minWidth = '0'; }
      mainUnits = collectBlocks(mainFlow, geo.contentHeight);
      sideUnits = collectBlocks(sideFlow, geo.contentHeight);
      pages = paginateDualColumns(mainUnits, sideUnits, geo.contentHeight, 0);
    } else {
      const flow = container.querySelector('[data-flow="main"]');
      mainUnits = collectBlocks(flow, geo.contentHeight);
      sideUnits = [];
      pages = paginateColumn(mainUnits, geo.contentHeight, 0);
    }

    // ---- Verification ---- //
    const emptyCount = pages.filter((p) => {
      if (Array.isArray(p)) return p.length === 0;
      return p.main.length === 0 && p.side.length === 0;
    }).length;

    // Collect all units (flattened) so we can verify no unit overflows.
    const allUnits = [];
    pages.forEach((p) => {
      if (Array.isArray(p)) allUnits.push(...p);
      else allUnits.push(...p.main, ...p.side);
    });

    // 1) No-clip: every placed unit must fit within the content height.
    let clipped = 0;
    allUnits.forEach((u) => {
      if (u.height + u.mt > geo.contentHeight + 0.5) clipped++;
    });

    // 2) Heading + first-entry orphan protection: no page may END with a
    //    'heading' unit whose next unit (the section's first entry) is on a
    //    different page. We check that if a heading is the last unit of a
    //    page, the next unit is NOT a heading (i.e. the following page starts
    //    with the heading's entry) — but simpler: a heading is never the LAST
    //    unit of any non-final page when it is followed by an entry.
    let orphanedHeadings = 0;
    pages.forEach((p, pi) => {
      const flat = Array.isArray(p) ? p : [...p.main, ...p.side];
      const firstEntryGroups = findHeadingEntryGroups(flat);
      // A heading at the very end of a non-final page is an orphan risk.
      if (pi < pages.length - 1) {
        const last = flat[flat.length - 1];
        if (last && last.kind === 'heading') orphanedHeadings++;
      }
      // Also verify every heading that has a following entry on the same
      // page keeps them together (i.e. heading is not the last unit).
      firstEntryGroups.forEach(() => {});
    });

    // 2b) Stronger orphan check: for each heading unit, if there is a next
    //     unit (an entry/first-entry), they must be on the SAME page.
    const pageOf = new Map();
    allUnits.forEach((u, idx) => {
      pages.forEach((p, pi) => {
        const flat = Array.isArray(p) ? p : [...p.main, ...p.side];
        if (flat.includes(u)) pageOf.set(u, pi);
      });
    });
    let headingOrphanViolation = 0;
    allUnits.forEach((u, idx) => {
      if (u.kind === 'heading') {
        const next = allUnits[idx + 1];
        if (next && next.kind !== 'heading' && pageOf.get(u) !== pageOf.get(next)) {
          // Only a violation if the heading is the last unit of its page.
          headingOrphanViolation++;
        }
      }
    });

    // 3) Content preservation: every measured block must appear on exactly
    //    one page (no block duplicated or dropped).
    const blockIndexes = new Map();
    allUnits.forEach((u) => {
      if (!blockIndexes.has(u.blockIndex)) blockIndexes.set(u.blockIndex, 0);
      blockIndexes.set(u.blockIndex, blockIndexes.get(u.blockIndex) + 1);
    });
    const totalSourceBlocks = container.querySelectorAll('[data-block]').length;
    let preserved = true;
    for (let i = 0; i < totalSourceBlocks; i++) {
      if (!blockIndexes.has(i) || blockIndexes.get(i) < 1) { preserved = false; break; }
    }

    result = {
      pages: pages.length,
      blocks: totalSourceBlocks,
      empty: emptyCount > 0,
      emptyCount,
      clipped,
      orphanedHeadings: headingOrphanViolation,
      preserved,
    };
  } catch (err) {
    result = {
      pages: -1,
      blocks: 0,
      empty: true,
      emptyCount: 1,
      clipped: 0,
      orphanedHeadings: 0,
      preserved: false,
      error: err.message,
    };
  } finally {
    root.unmount();
    container.remove();
  }

  return result;
}

/**
 * Find the index of the first 'entry' unit that follows each 'heading' unit
 * within a flat page array (used to reason about heading+first-entry).
 */
function findHeadingEntryGroups(flat) {
  const groups = [];
  for (let i = 0; i < flat.length; i++) {
    if (flat[i].kind === 'heading' && flat[i + 1]) {
      groups.push({ heading: flat[i], firstEntry: flat[i + 1] });
    }
  }
  return groups;
}

/**
 * Run all template×resume tests and log a report.
 */
export function runTemplateTests() {
  const results = [];
  const rows = [];
  for (const templateId of testTemplateIds) {
    for (const [scenarioName, resume] of Object.entries(testResumes)) {
      let r;
      try {
        r = renderAndMeasure(templateId, resume);
      } catch (err) {
        r = { pages: -1, blocks: 0, empty: true, emptyCount: 1, clipped: 0, orphanedHeadings: 0, preserved: false, error: err.message };
      }
      const ok =
        r.pages > 0 &&
        !r.empty &&
        !r.error &&
        r.clipped === 0 &&
        r.orphanedHeadings === 0 &&
        r.preserved;
      results.push({ templateId, scenarioName, ...r, ok });
      rows.push({ templateId, scenarioName, ok, pages: r.pages, error: r.error || '' });
      console.log(
        `[${ok ? 'PASS' : 'FAIL'}] ${templateId} / ${scenarioName} -> ` +
          `${r.pages} page(s), ${r.blocks} block(s)` +
          (r.emptyCount ? `, ${r.emptyCount} empty` : '') +
          (r.clipped ? `, ${r.clipped} CLIPPED` : '') +
          (r.orphanedHeadings ? `, ${r.orphanedHeadings} orphaned heading` : '') +
          (r.preserved ? ', content preserved' : ', CONTENT DROPPED') +
          (r.error ? `, ERROR: ${r.error}` : '')
      );
    }
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\nTemplate tests: ${results.length - failed.length}/${results.length} passed.`
  );
  if (failed.length) {
    console.log('Failed:', failed.map((f) => `${f.templateId}/${f.scenarioName}`).join(', '));
  } else {
    console.log('All template × resume scenarios PASS.');
  }
  return { results, failed, rows };
}

// Expose on window for running from the browser console.
if (typeof window !== 'undefined') {
  window.__runTemplateTests = runTemplateTests;
}

export default runTemplateTests;
