import type { CellResult, Warning, SheetFormat, InspectResult } from './types';

const AREA_TOO_SMALL_RATIO = 0.02;
const AREA_TOO_LARGE_RATIO = 0.85;
const CENTER_JITTER_THRESHOLD = 12;

export const FORMAT_8x6_180: SheetFormat = {
  columns: 8, rows: 6, cellWidth: 180, cellHeight: 180,
};

export function detectFormat(w: number, h: number): SheetFormat {
  if (w === 1440 && h === 1080) return { ...FORMAT_8x6_180 };
  const cellCandidates = [180, 128, 96, 64, 48, 32];
  for (const cell of cellCandidates) {
    if (w % cell === 0 && h % cell === 0) {
      return { columns: w / cell, rows: h / cell, cellWidth: cell, cellHeight: cell };
    }
  }
  return { columns: 8, rows: 6, cellWidth: Math.floor(w / 8), cellHeight: Math.floor(h / 6) };
}

export function inspectCell(
  pixels: Uint8ClampedArray, imgW: number,
  col: number, row: number, cellW: number, cellH: number, cols: number,
): CellResult {
  const ox = col * cellW;
  const oy = row * cellH;
  let minX = cellW, minY = cellH, maxX = -1, maxY = -1;
  let opaqueCount = 0;

  for (let cy = 0; cy < cellH; cy++) {
    for (let cx = 0; cx < cellW; cx++) {
      const pi = ((oy + cy) * imgW + (ox + cx)) * 4;
      if (pixels[pi + 3] > 0) {
        opaqueCount++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
      }
    }
  }

  const empty = opaqueCount === 0;
  const bbox = empty ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  const centerX = bbox ? minX + bbox.w / 2 : cellW / 2;
  const centerY = bbox ? minY + bbox.h / 2 : cellH / 2;
  let touchesEdge = false;
  if (!empty && bbox) {
    touchesEdge = bbox.x === 0 || bbox.y === 0 || (bbox.x + bbox.w) >= cellW || (bbox.y + bbox.h) >= cellH;
  }
  return { index: row * cols + col, row, col, bbox, area: opaqueCount, centerX, centerY, touchesEdge, empty };
}

export function inspectImage(
  pixels: Uint8ClampedArray, imgW: number, imgH: number,
  format: SheetFormat, fileName: string,
): InspectResult {
  const warnings: Warning[] = [];
  const { columns, rows, cellWidth, cellHeight } = format;

  const expectedW = columns * cellWidth;
  const expectedH = rows * cellHeight;
  if (imgW !== expectedW || imgH !== expectedH) {
    warnings.push({
      level: 'error',
      message: `シートサイズ ${imgW}x${imgH} — グリッド期待値 ${expectedW}x${expectedH}`,
    });
  }

  const cells: CellResult[] = [];
  const actualCols = Math.min(columns, Math.floor(imgW / cellWidth));
  const actualRows = Math.min(rows, Math.floor(imgH / cellHeight));

  for (let r = 0; r < actualRows; r++) {
    for (let c = 0; c < actualCols; c++) {
      cells.push(inspectCell(pixels, imgW, c, r, cellWidth, cellHeight, actualCols));
    }
  }

  const maxArea = cellWidth * cellHeight;
  for (const cell of cells) {
    if (cell.empty) {
      warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 空（不透明ピクセルなし）` });
    } else {
      if (cell.area < maxArea * AREA_TOO_SMALL_RATIO) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 極端に小さい（${cell.area}px / ${maxArea}px）` });
      }
      if (cell.area > maxArea * AREA_TOO_LARGE_RATIO) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 極端に大きい（${cell.area}px / ${maxArea}px）` });
      }
      if (cell.touchesEdge) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] セル端に接触 — 切れ・はみ出しの可能性` });
      }
    }
  }

  const nonEmpty = cells.filter(c => !c.empty);
  if (nonEmpty.length >= 2) {
    const avgCx = nonEmpty.reduce((s, c) => s + c.centerX, 0) / nonEmpty.length;
    const avgCy = nonEmpty.reduce((s, c) => s + c.centerY, 0) / nonEmpty.length;
    for (const cell of nonEmpty) {
      const dx = Math.abs(cell.centerX - avgCx);
      const dy = Math.abs(cell.centerY - avgCy);
      if (dx > CENTER_JITTER_THRESHOLD || dy > CENTER_JITTER_THRESHOLD) {
        warnings.push({
          level: 'warn', cell: cell.index,
          message: `セル[${cell.row},${cell.col}] ガタつき候補 — bbox中心が平均から dx=${dx.toFixed(1)} dy=${dy.toFixed(1)} ずれ`,
        });
      }
    }
  }

  const emptyCells = cells.filter(c => c.empty).length;
  return {
    fileName, width: imgW, height: imgH, format, cells, warnings,
    totalCells: cells.length,
    filledCells: cells.length - emptyCells,
    emptyCells,
  };
}
