/**
 * Node-based unit tests for the pure pagination algorithms.
 *
 * These tests exercise `paginateColumn` and `paginateDualColumns` with
 * synthetic block data (heights, margins, kinds) covering:
 *   - short content (1 page)
 *   - normal content that fits
 *   - multi-page content
 *   - section overflow (many entries)
 *   - long/oversized entries (single block taller than a page)
 *   - heading + first-entry orphan protection (single + dual columns)
 *   - dual-column unequal main/sidebar content
 *
 * Run with: `node scripts/pagination.test.mjs`
 */
import { paginateColumn, paginateDualColumns } from '../src/features/preview/pagination.js';

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) {
    pass++;
  } else {
    fail++;
    failures.push(`${name}${detail ? ` :: ${detail}` : ''}`);
    console.log(`[FAIL] ${name}${detail ? ` :: ${detail}` : ''}`);
  }
}

const CONTENT_H = 1000; // px, arbitrary content height

// ---- helpers ---- //
let __idx = 0;
const blk = (height, kind = 'entry', mt = 0, mb = 0) => ({ index: __idx++, height, mt, mb, kind });
function flatPage(p) {
  return Array.isArray(p) ? p : [...p.main, ...p.side];
}
function allUnits(pages) {
  const u = [];
  pages.forEach((p) => u.push(...flatPage(p)));
  return u;
}
// Verify no unit (height + mt) exceeds content height.
function noUnitOverflows(pages) {
  return allUnits(pages).every((u) => u.height + u.mt <= CONTENT_H + 0.5);
}
// Verify a heading is never the last unit of a non-final page (orphan).
function noOrphanedHeading(pages) {
  for (let i = 0; i < pages.length; i++) {
    if (i < pages.length - 1) {
      const flat = flatPage(pages[i]);
      const last = flat[flat.length - 1];
      if (last && last.kind === 'heading') return false;
    }
  }
  return true;
}
// Sum total height+mt of all units (should preserve all content).
function totalContent(pages) {
  return allUnits(pages).reduce((s, u) => s + u.height + u.mt, 0);
}
function trackIndexes(pages) {
  const idxs = new Set();
  allUnits(pages).forEach((u) => idxs.add(u.index));
  return idxs;
}

// Content height in px used by the app for A4 (matching millimeters).
const A4_CONTENT_H = (297 - 17 - 17) * (96 / 25.4); // ~994px for basic
const A4_CONTENT_H_MODERN = (297 - 15 - 15) * (96 / 25.4); // ~1013px

// ---------- TEST 1: short content -> 1 page ---------- //
{
  const blocks = [
    blk(60, 'header'),
    blk(30, 'heading'),
    blk(40, 'entry'),
    blk(30, 'heading'),
    blk(50, 'entry'),
  ];
const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T1 short content -> 1 page', pages.length === 1, `got ${pages.length}`);
  check('T1 no unit overflows', noUnitOverflows(pages));
  check('T1 no orphaned heading', noOrphanedHeading(pages));
  const tracked = trackIndexes(pages);
  check('T1 all content tracked', tracked.size === blocks.length, `got ${tracked.size}/${blocks.length} idxs=[...${[...tracked].slice(0,10)}]`);
}

// ---------- TEST 2: normal multi-page content ---------- //
{
  const blocks = [];
  for (let i = 0; i < 30; i++) {
    if (i % 3 === 0) blocks.push(blk(30, 'heading'));
    else blocks.push(blk(60, 'entry'));
  }
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T2 multi-page (pages > 1)', pages.length > 1, `got ${pages.length}`);
  check('T2 no unit overflows', noUnitOverflows(pages));
  check('T2 no orphaned heading', noOrphanedHeading(pages));
  check('T2 all content tracked', trackIndexes(pages).size === blocks.length);
}

// ---------- TEST 3: section overflow (many entries under one heading) ---------- //
{
  const blocks = [blk(60, 'header'), blk(30, 'heading')];
  for (let i = 0; i < 40; i++) blocks.push(blk(50, 'entry', 4, 4));
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T3 section overflow -> multiple pages', pages.length > 1, `got ${pages.length}`);
  check('T3 no unit overflows', noUnitOverflows(pages));
  check('T3 no orphaned heading', noOrphanedHeading(pages));
  check('T3 all content tracked', trackIndexes(pages).size === blocks.length);
}

// ---------- TEST 4: long/oversized single entry (taller than a page) ---------- //
{
  // A single entry taller than the page. In the app this would be SLICED by
  // collectBlocks before pagination; here we simulate the sliced units.
  const oversized = 2400;
  const stripH = Math.max(1, A4_CONTENT_H - 2);
  const count = Math.ceil(oversized / stripH);
  const blocks = [];
  for (let i = 0; i < count; i++) {
    const start = i * stripH;
    const end = Math.min(start + stripH, oversized);
    blocks.push({
      index: 0,
      height: end - start,
      mt: i === 0 ? 0 : 0,
      mb: i === count - 1 ? 0 : 0,
      kind: 'entry',
      slice: { start, end, full: oversized },
    });
  }
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T4 oversized entry split -> multiple pages', pages.length > 1, `got ${pages.length}`);
  check('T4 no clamped/clipped unit', noUnitOverflows(pages), JSON.stringify(allUnits(pages)));
  check('T4 total content preserved', Math.abs(totalContent(pages) - oversized) < 1, `got ${totalContent(pages)}`);
}

// ---------- TEST 5: heading + first-entry orphan protection ---------- //
{
  // A heading + first entry that together fit on a fresh page, but would be
  // orphaned if placed behind a nearly-full page. We craft a page that fills
  // up to just before the heading so the heading would be last if not moved.
  const blocks = [blk(60, 'header')];
  // Fill close to content height with entries.
  let used = 60;
  let i = 0;
  while (used + 60 + 40 < A4_CONTENT_H) {
    blocks.push(blk(60, 'entry'));
    used += 60;
    i++;
  }
  // Now a heading + first entry that need to stay together.
  blocks.push(blk(30, 'heading'));
  blocks.push(blk(40, 'entry'));
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T5 heading not orphaned', noOrphanedHeading(pages));
  // The heading and its first entry must be on the SAME page.
  const pageOf = {};
  pages.forEach((p, pi) => flatPage(p).forEach((u) => (pageOf[u] = pi)));
  const hIdx = blocks.findIndex((b) => b.kind === 'heading');
  const hPage = pageOf[blocks[hIdx]];
  const ePage = pageOf[blocks[hIdx + 1]];
  check('T5 heading + first entry co-located', hPage === ePage, `h=${hPage} e=${ePage}`);
}

// ---------- TEST 6: dual-column unequal main/sidebar ---------- //
{
  // Main has lots of content; sidebar has a little (unequal).
  const mainBlocks = [blk(60, 'header')];
  for (let i = 0; i < 25; i++) {
    if (i % 3 === 0) mainBlocks.push(blk(30, 'heading'));
    else mainBlocks.push(blk(60, 'entry'));
  }
  const sideBlocks = [blk(30, 'heading'), blk(40, 'entry')]; // very short sidebar
  const pages = paginateDualColumns(mainBlocks, sideBlocks, A4_CONTENT_H_MODERN, 0);
  check('T6 dual unequal -> pages >= 1', pages.length >= 1, `got ${pages.length}`);
  check('T6 dual no unit overflows', noUnitOverflows(pages));
  check('T6 dual no orphaned heading', noOrphanedHeading(pages));
  check('T6 dual all main content tracked', trackIndexes(pages).size >= mainBlocks.length);
  // Sidebar content must all be present.
  const sidePresent = pages.reduce((s, p) => s + p.side.length, 0);
  check('T6 dual all sidebar present', sidePresent === sideBlocks.length, `got ${sidePresent}/${sideBlocks.length}`);
}

// ---------- TEST 7: dual-column sidebar orphan protection ---------- //
{
  const mainBlocks = [blk(60, 'header')];
  for (let i = 0; i < 20; i++) mainBlocks.push(blk(60, 'entry'));
  // Sidebar has a heading near the end that would be orphaned without protection.
  const sideBlocks = [];
  let used = 0;
  while (used + 60 < A4_CONTENT_H_MODERN) {
    sideBlocks.push(blk(60, 'entry'));
    used += 60;
  }
  sideBlocks.push(blk(30, 'heading'));
  sideBlocks.push(blk(40, 'entry'));
  const pages = paginateDualColumns(mainBlocks, sideBlocks, A4_CONTENT_H_MODERN, 0);
  check('T7 dual no orphaned heading', noOrphanedHeading(pages));
  // Heading + first entry co-located across the entire dual layout.
  const pageOf = {};
  pages.forEach((p, pi) => [...p.main, ...p.side].forEach((u) => (pageOf[u] = pi)));
  const allSide = [];
  pages.forEach((p) => [...p.main, ...p.side].forEach((u) => allSide.push(u)));
  const hIdx = sideBlocks.findIndex((b) => b.kind === 'heading');
  // Find the heading object in the flattened output.
  const hObj = allSide.find((u) => u.kind === 'heading' && u.height === 30);
  const hObjIdx = allSide.indexOf(hObj);
  const eObj = allSide[hObjIdx + 1];
  check('T7 dual heading + first entry co-located', hObj && eObj && pageOf[hObj] === pageOf[eObj]);
}

// ---------- TEST 8: extreme resume (very long entries) ---------- //
{
  const blocks = [];
  for (let i = 0; i < 60; i++) {
    if (i % 4 === 0) blocks.push(blk(28, 'heading', 8, 4));
    else blocks.push(blk(55, 'entry', 4, 4));
  }
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T8 extreme -> multiple pages', pages.length > 1, `got ${pages.length}`);
  check('T8 no unit overflows', noUnitOverflows(pages));
  check('T8 no orphaned heading', noOrphanedHeading(pages));
  check('T8 all content tracked', trackIndexes(pages).size === blocks.length);
}

// ---------- TEST 9: no empty pages ---------- //
{
  const blocks = [blk(60, 'header'), blk(30, 'heading'), blk(50, 'entry')];
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  const hasEmpty = pages.some((p) => flatPage(p).length === 0);
  check('T9 no empty pages (single)', !hasEmpty);
  const dual = paginateDualColumns(blocks, [blk(30, 'heading'), blk(40, 'entry')], A4_CONTENT_H, 0);
  const hasEmptyDual = dual.some((p) => p.main.length === 0 && p.side.length === 0);
  check('T9 no empty pages (dual)', !hasEmptyDual);
}

// ---------- TEST 10: single block exactly fits ---------- //
{
  const blocks = [blk(A4_CONTENT_H - 10, 'entry', 0, 0)];
  const pages = paginateColumn(blocks, A4_CONTENT_H, 0);
  check('T10 single fitting entry -> 1 page', pages.length === 1, `got ${pages.length}`);
  check('T10 no overflow', noUnitOverflows(pages));
}

console.log(`\n${pass}/${pass + fail} pagination tests passed.`);
if (fail > 0) {
  console.log('Failures:');
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
} else {
  console.log('All pagination tests PASS.');
}
