/**
 * Content-aware, margin/spacing-aware pagination algorithms.
 *
 * Pure functions, no DOM coupling. Blocks are measured externally and passed
 * in as `{ el, index, height, mt, mb, kind }` where:
 *   - `height` is the element's offsetHeight (content box, no margins)
 *   - `mt` / `mb` are the element's top/bottom margins (px)
 *   - `kind` is 'header' | 'heading' | 'entry'
 * Pages are returned as arrays of those block objects (not raw DOM elements)
 * so callers can map back to DOM via `el` / `index`.
 *
 * GUARANTEES
 * - No content is ever clipped: upstream (`PaginatedResume`) splits any
 *   block/leaf whose height+margin exceeds a page into fit-sized units
 *   BEFORE calling these functions, so a unit taller than the page should
 *   never reach here in practice. As a defensive safety net, an oversized
 *   unit is isolated on its own page WITHOUT pushing other content off, and
 *   the PDF layer additionally scales-to-fit so nothing ever renders beyond
 *   the PDF page boundary.
 * - Heading + first-entry orphan protection applies to BOTH the single-column
 *   paginator and the dual-column sidebar fill.
 */

/**
 * Compute the vertical space a block occupies, including the collapsed gap
 * from the previous block.
 *
 * Margins are accounted for explicitly so the paginator is
 * margin/spacing-aware rather than relying only on offsetHeight. When margins
 * of adjacent blocks would collapse, the larger of the two wins (standard CSS
 * margin-collapse behavior), which keeps the estimate accurate and safe.
 *
 * @param {object} block - The block being placed.
 * @param {object|null} prevBlock - The block immediately above it (or null).
 * @returns {number} height + gap consumed in the flow.
 */
function advanceOf(block, prevBlock) {
  if (!prevBlock) {
    // First block in a column: its top margin adds below the page's top
    // padding (margins do not collapse through padding).
    return block.height + block.mt;
  }
  const gap = Math.max(prevBlock.mb, block.mt);
  return block.height + gap;
}

/**
 * True when a block (with its top margin) is taller than a full page and thus
 * cannot be kept whole on any page without overflow.
 */
function isOversized(block, contentHeight) {
  return block.height + block.mt > contentHeight;
}

/**
 * Greedy-pack blocks into pages for a single column, margin-aware.
 *
 * Rules:
 * - A section heading is kept with its first entry (orphan protection) when
 *   both fit on one page.
 * - Entries are kept whole when they fit within a page.
 * - Blocks taller than a full page are split into fit-sized units by
 *   `PaginatedResume` BEFORE pagination, and oversized leaves are sliced into
 *   text units, so no content is ever clipped. A unit taller than the page
 *   should never reach this branch in practice; it is a defensive safety net
 *   that isolates the block on its own page without displacing other content.
 * - The running `used` height ACCUMULATES accurately using margin collapse.
 *
 * @param {Array<{el, index, height, mt, mb, kind}>} blocks
 * @param {number} contentHeight - available content height on one page (px)
 * @param {number} gap - legacy fallback gap (unused; margins are measured)
 * @returns {Array<Array<{el, index, height, mt, mb, kind}>>}
 */
export function paginateColumn(blocks, contentHeight, gap) {
  const pages = [];
  let cur = [];
  let used = 0;
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];
    const next = blocks[i + 1];

    // Oversized-block safety net: an individual unit taller than a full page
    // cannot be kept whole without overflowing. Upstream splitting guarantees
    // this is never reached for real content; if it somehow is (pathological
    // case), place it alone on its own page so no OTHER block is displaced.
    if (isOversized(b, contentHeight)) {
      if (cur.length) {
        pages.push(cur);
        cur = [];
        used = 0;
      }
      pages.push([b]);
      i++;
      continue;
    }

    // Orphan protection: keep a heading with at least its first entry, but
    // only when both fit together on a single page.
    if (b.kind === 'heading' && next) {
      const hAdv = advanceOf(b, cur[cur.length - 1]);
      const eAdv = advanceOf(next, b);
      const groupNeed = hAdv + eAdv;

      if (groupNeed <= contentHeight) {
        // If the pair cannot fit on the current (already populated) page,
        // move the heading to a fresh page so both stay together.
        if (used + groupNeed > contentHeight && cur.length) {
          pages.push(cur);
          cur = [];
          used = 0;
        }
        used += advanceOf(b, cur[cur.length - 1]);
        cur.push(b);
        i++;
        continue;
      }
      // The pair cannot share a page even alone; fall through and treat the
      // heading as a regular block (it may end up alone on its own page).
    }

    // Regular block (header, standalone heading, or entry).
    const prev = cur[cur.length - 1];
    const need = advanceOf(b, prev);
    if (used + need <= contentHeight) {
      used += need;
      cur.push(b);
      i++;
      continue;
    }

    // Block does not fit on the current page -> start a new page.
    if (cur.length) {
      pages.push(cur);
      cur = [];
      used = 0;
    }
    used += advanceOf(b, cur[cur.length - 1]);
    cur.push(b);
    i++;
  }

  if (cur.length) pages.push(cur);
  return pages;
}

/**
 * Greedily fill ONE sidebar chunk from `sideBlocks` starting at `startIdx`,
 * stopping as soon as the next block (or heading+first-entry group) no longer
 * fits. Applies heading + first-entry orphan protection and the oversized
 * safety net, mirroring the main-column rules so the sidebar never clips and
 * never orphans a heading.
 *
 * @param {Array} sideBlocks
 * @param {number} startIdx
 * @param {number} contentHeight
 * @returns {{ chunk: Array, nextIndex: number }}
 */
function fillSidebar(sideBlocks, startIdx, contentHeight) {
  const chunk = [];
  let used = 0;
  let i = startIdx;

  while (i < sideBlocks.length) {
    const b = sideBlocks[i];
    const next = sideBlocks[i + 1];

    // Oversized sidebar block: isolate it alone on this page.
    if (isOversized(b, contentHeight)) {
      if (chunk.length) break;
      chunk.push(b);
      used = b.height + b.mt;
      i++;
      break;
    }

    // Orphan protection: keep a sidebar heading with its first entry when
    // both fit together. If they don't fit on the current chunk, break so
    // the heading + entry move to the next sidebar page together.
    if (b.kind === 'heading' && next) {
      const hAdv = advanceOf(b, chunk[chunk.length - 1]);
      const eAdv = advanceOf(next, b);
      const groupNeed = hAdv + eAdv;
      if (groupNeed <= contentHeight) {
        if (used + groupNeed > contentHeight && chunk.length) break;
        used += advanceOf(b, chunk[chunk.length - 1]);
        chunk.push(b);
        i++;
        continue;
      }
      // Pair can't share a page even alone; treat heading as a regular block.
    }

    const prev = chunk[chunk.length - 1];
    const need = advanceOf(b, prev);
    if (used + need <= contentHeight) {
      chunk.push(b);
      used += need;
      i++;
    } else {
      break;
    }
  }

  return { chunk, nextIndex: i };
}

/**
 * Paginate a two-column layout (e.g. Modern template) in a balanced way.
 *
 * The main column is the primary content driver and is paginated first. For
 * each main page, the sidebar is greedily filled with as many blocks as fit
 * within the same content height. This avoids the imbalance caused by
 * paginating the two columns independently and zipping them (which could
 * leave a nearly-empty sidebar alongside a full main page, or vice versa).
 *
 * If the sidebar has leftover blocks after the main pages are exhausted,
 * additional pages are created with an empty main column.
 *
 * @param {Array} mainBlocks
 * @param {Array} sideBlocks
 * @param {number} contentHeight
 * @param {number} gap
 * @returns {Array<{main: Array, side: Array}>}
 */
export function paginateDualColumns(mainBlocks, sideBlocks, contentHeight, gap) {
  const mainPages = paginateColumn(mainBlocks, contentHeight, gap);
  const pages = [];
  let sideIdx = 0;

  // Fill each main page's sidebar with as many side blocks as fit.
  for (let p = 0; p < mainPages.length; p++) {
    const { chunk, nextIndex } = fillSidebar(sideBlocks, sideIdx, contentHeight);
    sideIdx = nextIndex;
    pages.push({ main: mainPages[p], side: chunk });
  }

  // Sidebar has leftover blocks -> add pages with an empty main column.
  while (sideIdx < sideBlocks.length) {
    const { chunk, nextIndex } = fillSidebar(sideBlocks, sideIdx, contentHeight);
    sideIdx = nextIndex;
    pages.push({ main: [], side: chunk });
  }

  return pages;
}

export default { paginateColumn, paginateDualColumns };
