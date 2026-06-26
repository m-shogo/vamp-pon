import './style.css';
import type { AssetType, AssetManifest, InspectResult, SheetFormat } from './types';
import { inspectImage, detectFormat, FORMAT_8x6_180 } from './inspector';
import { createDefaultManifest, applyPreset } from './manifest';
import { getPresetsForType } from './presets';
import { buildPrompt } from './promptBuilder';
import {
  loadLibrary, saveLibrary, addEntry, deleteEntry, duplicateEntry,
  exportLibraryJSON, importLibraryJSON,
} from './storage';

type AppState = {
  imageData: ImageData | null;
  imageName: string;
  imageWidth: number;
  imageHeight: number;
  assetType: AssetType;
  format: SheetFormat;
  inspectResult: InspectResult | null;
  manifest: AssetManifest;
  prompt: string;
  showGrid: boolean;
  showBbox: boolean;
  showCheckerboard: boolean;
  darkBg: boolean;
  activeTab: string;
};

const state: AppState = {
  imageData: null,
  imageName: '',
  imageWidth: 0,
  imageHeight: 0,
  assetType: 'enemy',
  format: { ...FORMAT_8x6_180 },
  inspectResult: null,
  manifest: createDefaultManifest('enemy', ''),
  prompt: '',
  showGrid: true,
  showBbox: true,
  showCheckerboard: true,
  darkBg: true,
  activeTab: 'import',
};

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const $$ = <T extends HTMLElement>(sel: string) => document.querySelectorAll<T>(sel);

function init() {
  document.querySelector('#app')!.innerHTML = buildHTML();
  bindTabs();
  bindImport();
  bindGridSettings();
  bindPreviewControls();
  bindManifest();
  bindPrompt();
  bindLibrary();
  bindExport();
  switchTab('import');
}

function buildHTML(): string {
  return `
<header>
  <h1>Asset Factory v0</h1>
  <span class="subtitle">Vamp Pon 素材制作ツール</span>
</header>
<div class="tabs">
  <button class="tab-btn" data-tab="import">読込</button>
  <button class="tab-btn" data-tab="inspect">検査</button>
  <button class="tab-btn" data-tab="anchors">アンカー</button>
  <button class="tab-btn" data-tab="manifest">マニフェスト</button>
  <button class="tab-btn" data-tab="prompts">プロンプト</button>
  <button class="tab-btn" data-tab="library">ライブラリ</button>
</div>
<div class="tab-content">

  <!-- Import -->
  <div class="tab-panel" id="tab-import">
    <div class="drop-zone" id="drop-zone">
      <p>PNG / Spritesheet をドラッグ&ドロップ</p>
      <p class="hint">またはクリックしてファイルを選択</p>
      <input type="file" accept="image/png" id="file-input" style="display:none">
    </div>
    <div class="file-info" id="file-info" style="display:none"></div>

    <h3 class="section-header">素材タイプ</h3>
    <div class="type-selector" id="type-selector"></div>

    <h3 class="section-header">プレビュー</h3>
    <div class="preview-controls">
      <label><input type="checkbox" id="chk-grid" checked> グリッド</label>
      <label><input type="checkbox" id="chk-bbox" checked> 透過境界</label>
      <label><input type="checkbox" id="chk-checker" checked> 市松模様</label>
      <label><input type="checkbox" id="chk-dark" checked> 暗い背景</label>
    </div>
    <div class="grid-settings">
      <label>プリセット:
        <select id="grid-preset">
          <option value="8x6/180">8x6 / 180px</option>
          <option value="custom">カスタム</option>
        </select>
      </label>
      <label>列数: <input type="number" id="grid-cols" value="8" min="1" max="64"></label>
      <label>行数: <input type="number" id="grid-rows" value="6" min="1" max="64"></label>
      <label>セル幅: <input type="number" id="grid-cw" value="180" min="1" max="2048"></label>
      <label>セル高: <input type="number" id="grid-ch" value="180" min="1" max="2048"></label>
    </div>
    <div class="preview-container" id="preview-container">
      <canvas id="preview-canvas"></canvas>
    </div>
  </div>

  <!-- Inspect -->
  <div class="tab-panel" id="tab-inspect">
    <div id="inspect-content">
      <div class="empty-state">画像を読み込んでください</div>
    </div>
  </div>

  <!-- Anchors -->
  <div class="tab-panel" id="tab-anchors">
    <div class="fixed-rules-notice">
      <strong>ユイ固定ルール:</strong><br>
      - ランタンはキャラクターの右手に持つ<br>
      - カバンのストラップは右肩から左腰へ<br>
      - カバン本体は左腰に配置<br>
      - ランタンは左向きフレームでも消えてはいけない
    </div>
    <h3 class="section-header">アンカーポイント</h3>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">
      各アンカーの座標を入力してください（v0ではテキスト入力、将来はプレビュー上クリック対応予定）
    </p>
    <div class="anchor-list" id="anchor-list"></div>
    <div class="btn-group">
      <button class="btn" id="btn-copy-anchors">JSON をコピー</button>
    </div>
  </div>

  <!-- Manifest -->
  <div class="tab-panel" id="tab-manifest">
    <div id="preset-area"></div>
    <h3 class="section-header">マニフェスト編集</h3>
    <div class="manifest-editor" id="manifest-editor"></div>
    <div class="btn-group">
      <button class="btn" id="btn-copy-manifest">JSON をコピー</button>
      <button class="btn btn-primary" id="btn-save-library">ライブラリに保存</button>
    </div>
  </div>

  <!-- Prompts -->
  <div class="tab-panel" id="tab-prompts">
    <h3 class="section-header">プロンプト生成</h3>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">
      現在のマニフェスト設定からVamp Ponルール付き画像生成プロンプトを生成します
    </p>
    <div class="btn-group" style="margin-top:0;margin-bottom:12px;">
      <button class="btn btn-primary" id="btn-generate-prompt">プロンプト生成</button>
      <button class="btn" id="btn-copy-prompt">コピー</button>
    </div>
    <div class="prompt-output">
      <textarea id="prompt-textarea" placeholder="「プロンプト生成」をクリック"></textarea>
    </div>
  </div>

  <!-- Library -->
  <div class="tab-panel" id="tab-library">
    <h3 class="section-header">素材ライブラリ</h3>
    <div class="btn-group" style="margin-top:0;margin-bottom:12px;">
      <button class="btn" id="btn-export-library">ライブラリJSON出力</button>
      <button class="btn" id="btn-import-library">ライブラリJSON読込</button>
      <input type="file" accept=".json" id="library-import-input" style="display:none">
    </div>
    <div class="library-list" id="library-list"></div>
  </div>

</div>

<!-- Export floating -->
<div style="position:fixed;bottom:16px;right:16px;display:flex;gap:8px;z-index:100;">
  <button class="btn" id="btn-dl-manifest" title="マニフェストJSON">マニフェスト</button>
  <button class="btn" id="btn-dl-inspect" title="検査レポート">検査結果</button>
  <button class="btn" id="btn-dl-prompt" title="プロンプトテキスト">プロンプト</button>
</div>
`;
}

// --- Tabs ---
function bindTabs() {
  for (const btn of $$<HTMLButtonElement>('.tab-btn')) {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab!));
  }
}

function switchTab(tab: string) {
  state.activeTab = tab;
  for (const btn of $$<HTMLButtonElement>('.tab-btn')) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  }
  for (const panel of $$<HTMLDivElement>('.tab-panel')) {
    panel.classList.toggle('active', panel.id === `tab-${tab}`);
  }
  if (tab === 'inspect') renderInspect();
  if (tab === 'anchors') renderAnchors();
  if (tab === 'manifest') renderManifest();
  if (tab === 'prompts') renderPromptTab();
  if (tab === 'library') renderLibrary();
}

// --- Import ---
function bindImport() {
  const dropZone = $('#drop-zone');
  const fileInput = $<HTMLInputElement>('#file-input');

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file && file.type === 'image/png') loadImage(file);
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) loadImage(file);
  });

  // Type selector
  const types: AssetType[] = ['character', 'enemy', 'weapon', 'item', 'background', 'cutin'];
  const container = $('#type-selector');
  for (const t of types) {
    const btn = document.createElement('button');
    btn.className = `type-btn${t === state.assetType ? ' active' : ''}`;
    btn.textContent = t;
    btn.addEventListener('click', () => {
      state.assetType = t;
      state.manifest = createDefaultManifest(t, state.imageName);
      for (const b of $$<HTMLButtonElement>('.type-btn')) b.classList.toggle('active', b.textContent === t);
      if (state.activeTab === 'manifest') renderManifest();
      if (state.activeTab === 'prompts') renderPromptTab();
    });
    container.appendChild(btn);
  }
}

function loadImage(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      state.imageName = file.name;
      state.imageWidth = img.width;
      state.imageHeight = img.height;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      state.imageData = ctx.getImageData(0, 0, img.width, img.height);

      const detected = detectFormat(img.width, img.height);
      state.format = detected;
      $<HTMLInputElement>('#grid-cols').value = String(detected.columns);
      $<HTMLInputElement>('#grid-rows').value = String(detected.rows);
      $<HTMLInputElement>('#grid-cw').value = String(detected.cellWidth);
      $<HTMLInputElement>('#grid-ch').value = String(detected.cellHeight);

      if (detected.columns === 8 && detected.rows === 6 && detected.cellWidth === 180) {
        $<HTMLSelectElement>('#grid-preset').value = '8x6/180';
      } else {
        $<HTMLSelectElement>('#grid-preset').value = 'custom';
      }

      state.manifest.sourceFileName = file.name;
      runInspection();
      renderPreview();
      showFileInfo(file);
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

function showFileInfo(file: File) {
  const info = $('#file-info');
  info.style.display = 'block';
  info.innerHTML = `
    <span>${file.name}</span>
    <span>${state.imageWidth} x ${state.imageHeight} px</span>
    <span>${(file.size / 1024).toFixed(1)} KB</span>
  `;
}

// --- Grid Settings ---
function bindGridSettings() {
  const preset = $<HTMLSelectElement>('#grid-preset');
  const cols = $<HTMLInputElement>('#grid-cols');
  const rows = $<HTMLInputElement>('#grid-rows');
  const cw = $<HTMLInputElement>('#grid-cw');
  const ch = $<HTMLInputElement>('#grid-ch');

  preset.addEventListener('change', () => {
    if (preset.value === '8x6/180') {
      state.format = { ...FORMAT_8x6_180 };
      cols.value = '8'; rows.value = '6'; cw.value = '180'; ch.value = '180';
    }
    runInspection();
    renderPreview();
  });

  const updateCustom = () => {
    preset.value = 'custom';
    state.format = {
      columns: parseInt(cols.value) || 8,
      rows: parseInt(rows.value) || 6,
      cellWidth: parseInt(cw.value) || 180,
      cellHeight: parseInt(ch.value) || 180,
    };
    runInspection();
    renderPreview();
  };
  cols.addEventListener('change', updateCustom);
  rows.addEventListener('change', updateCustom);
  cw.addEventListener('change', updateCustom);
  ch.addEventListener('change', updateCustom);
}

// --- Preview Controls ---
function bindPreviewControls() {
  $<HTMLInputElement>('#chk-grid').addEventListener('change', (e) => {
    state.showGrid = (e.target as HTMLInputElement).checked; renderPreview();
  });
  $<HTMLInputElement>('#chk-bbox').addEventListener('change', (e) => {
    state.showBbox = (e.target as HTMLInputElement).checked; renderPreview();
  });
  $<HTMLInputElement>('#chk-checker').addEventListener('change', (e) => {
    state.showCheckerboard = (e.target as HTMLInputElement).checked; renderPreview();
  });
  $<HTMLInputElement>('#chk-dark').addEventListener('change', (e) => {
    state.darkBg = (e.target as HTMLInputElement).checked; renderPreview();
  });
}

// --- Preview Rendering ---
function renderPreview() {
  const canvas = $<HTMLCanvasElement>('#preview-canvas');
  if (!state.imageData) {
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#2d2735';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#9a90a8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('画像を読み込んでください', 200, 150);
    return;
  }

  const { imageData, format, showGrid, showBbox, showCheckerboard, darkBg } = state;
  const w = imageData.width;
  const h = imageData.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Background
  if (showCheckerboard) {
    const sz = 8;
    for (let y = 0; y < h; y += sz) {
      for (let x = 0; x < w; x += sz) {
        const light = ((x / sz + y / sz) % 2 === 0);
        ctx.fillStyle = darkBg
          ? (light ? '#2a2a2a' : '#222222')
          : (light ? '#cccccc' : '#aaaaaa');
        ctx.fillRect(x, y, sz, sz);
      }
    }
  } else {
    ctx.fillStyle = darkBg ? '#1a1520' : '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }

  // Image
  ctx.putImageData(imageData, 0, 0);

  // Grid overlay
  if (showGrid) {
    ctx.strokeStyle = 'rgba(240, 168, 48, 0.4)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= format.columns; c++) {
      const x = c * format.cellWidth;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let r = 0; r <= format.rows; r++) {
      const y = r * format.cellHeight;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }

  // Bbox overlay
  if (showBbox && state.inspectResult) {
    for (const cell of state.inspectResult.cells) {
      if (cell.empty || !cell.bbox) continue;
      const ox = cell.col * format.cellWidth;
      const oy = cell.row * format.cellHeight;
      ctx.strokeStyle = cell.touchesEdge ? 'rgba(224, 80, 80, 0.7)' : 'rgba(80, 192, 112, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(ox + cell.bbox.x, oy + cell.bbox.y, cell.bbox.w, cell.bbox.h);

      // Center dot
      ctx.fillStyle = 'rgba(240, 168, 48, 0.8)';
      ctx.beginPath();
      ctx.arc(ox + cell.centerX, oy + cell.centerY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// --- Inspection ---
function runInspection() {
  if (!state.imageData) {
    state.inspectResult = null;
    return;
  }
  state.inspectResult = inspectImage(
    state.imageData.data, state.imageWidth, state.imageHeight,
    state.format, state.imageName,
  );
}

function renderInspect() {
  const container = $('#inspect-content');
  if (!state.inspectResult) {
    container.innerHTML = '<div class="empty-state">画像を読み込んで検査してください</div>';
    return;
  }
  const r = state.inspectResult;
  const errors = r.warnings.filter(w => w.level === 'error');
  const warns = r.warnings.filter(w => w.level === 'warn');

  container.innerHTML = `
    <div class="inspect-summary">
      <h3>検査結果: ${r.fileName}</h3>
      <div class="stat-row">
        <span class="stat-label">画像サイズ:</span>
        <span class="stat-value">${r.width} x ${r.height} px</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">グリッド:</span>
        <span class="stat-value">${r.format.columns} x ${r.format.rows} / ${r.format.cellWidth}x${r.format.cellHeight}px</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">セル数:</span>
        <span class="stat-value">${r.totalCells} (描画あり ${r.filledCells} / 空 ${r.emptyCells})</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">エラー:</span>
        <span class="stat-value" style="color:${errors.length ? 'var(--error)' : 'var(--success)'}">${errors.length}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">警告:</span>
        <span class="stat-value" style="color:${warns.length ? 'var(--warn)' : 'var(--success)'}">${warns.length}</span>
      </div>
    </div>

    ${r.warnings.length > 0 ? `
      <h3 class="section-header">警告 / エラー</h3>
      <div class="warnings-list">
        ${r.warnings.map(w => `
          <div class="warning-item ${w.level}">
            ${w.level === 'error' ? '❌' : '⚠️'} ${w.message}
          </div>
        `).join('')}
      </div>
    ` : '<div style="margin-top:16px;color:var(--success)">✅ 問題なし</div>'}

    <h3 class="section-header">セル詳細</h3>
    <div class="cell-grid" style="grid-template-columns: repeat(${Math.min(r.format.columns, 8)}, 1fr);">
      ${r.cells.map(c => {
        const cellWarns = r.warnings.filter(w => w.cell === c.index);
        const hasErr = cellWarns.some(w => w.level === 'error');
        const hasWarn = cellWarns.some(w => w.level === 'warn');
        return `<div class="cell-card${c.empty ? ' empty' : ''}${hasErr ? ' has-error' : hasWarn ? ' has-warning' : ''}">
          <div>[${c.row},${c.col}]</div>
          <div>${c.empty ? '空' : `${c.area}px²`}</div>
          ${c.bbox ? `<div>${c.bbox.w}x${c.bbox.h}</div>` : ''}
          ${c.touchesEdge ? '<div style="color:var(--error)">端接触</div>' : ''}
        </div>`;
      }).join('')}
    </div>
  `;
}

// --- Anchors ---
const ANCHOR_NAMES = [
  'head_center', 'eye_left', 'eye_right',
  'hand_right', 'hand_left',
  'waist_left', 'waist_right',
  'foot_left', 'foot_right', 'shadow_center',
];

function renderAnchors() {
  const list = $('#anchor-list');
  const m = state.manifest;
  const anchors = (m.type === 'character' && 'anchors' in m) ? m.anchors : {};

  list.innerHTML = `
    <div class="anchor-row" style="font-weight:600;color:var(--text-dim);">
      <span>名前</span><span>X</span><span>Y</span><span></span>
    </div>
    ${ANCHOR_NAMES.map(name => {
      const pt = (anchors as Record<string, { x: number; y: number } | undefined>)[name];
      return `<div class="anchor-row">
        <span class="name">${name}</span>
        <input type="number" data-anchor="${name}" data-axis="x" value="${pt?.x ?? ''}" placeholder="x">
        <input type="number" data-anchor="${name}" data-axis="y" value="${pt?.y ?? ''}" placeholder="y">
        <button class="btn" data-clear-anchor="${name}" style="font-size:11px;padding:2px 8px;">Clear</button>
      </div>`;
    }).join('')}
  `;

  for (const input of list.querySelectorAll<HTMLInputElement>('input[data-anchor]')) {
    input.addEventListener('change', () => {
      updateAnchor(input.dataset.anchor!, input.dataset.axis as 'x' | 'y', parseInt(input.value));
    });
  }
  for (const btn of list.querySelectorAll<HTMLButtonElement>('button[data-clear-anchor]')) {
    btn.addEventListener('click', () => {
      clearAnchor(btn.dataset.clearAnchor!);
      renderAnchors();
    });
  }

  $('#btn-copy-anchors')?.addEventListener('click', () => {
    const m2 = state.manifest;
    const a = (m2.type === 'character' && 'anchors' in m2) ? m2.anchors : {};
    navigator.clipboard.writeText(JSON.stringify(a, null, 2));
  });
}

function updateAnchor(name: string, axis: 'x' | 'y', value: number) {
  if (state.manifest.type !== 'character') return;
  const m = state.manifest as { anchors: Record<string, { x: number; y: number }> };
  if (!m.anchors[name]) m.anchors[name] = { x: 0, y: 0 };
  m.anchors[name][axis] = isNaN(value) ? 0 : value;
}

function clearAnchor(name: string) {
  if (state.manifest.type !== 'character') return;
  const m = state.manifest as { anchors: Record<string, unknown> };
  delete m.anchors[name];
}

// --- Manifest ---
function bindManifest() {
  $('#btn-copy-manifest').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(state.manifest, null, 2));
  });
  $('#btn-save-library').addEventListener('click', () => {
    addEntry(state.manifest, state.inspectResult ?? undefined, state.prompt || undefined);
    if (state.activeTab === 'library') renderLibrary();
    showToast('ライブラリに保存しました');
  });
}

function renderManifest() {
  const presetArea = $('#preset-area');
  const presets = getPresetsForType(state.assetType);
  if (presets.length > 0) {
    presetArea.innerHTML = `
      <div class="preset-selector">
        <h3>プリセット (${state.assetType})</h3>
        <div class="preset-list">
          ${presets.map(p => `<button class="preset-btn" data-preset="${p.id}">${p.label}</button>`).join('')}
        </div>
      </div>
    `;
    for (const btn of presetArea.querySelectorAll<HTMLButtonElement>('.preset-btn')) {
      btn.addEventListener('click', () => {
        const preset = presets.find(p => p.id === btn.dataset.preset);
        if (preset) {
          state.manifest = applyPreset(state.manifest, preset.manifest);
          renderManifestFields();
        }
      });
    }
  } else {
    presetArea.innerHTML = '';
  }

  renderManifestFields();
}

function renderManifestFields() {
  const editor = $('#manifest-editor');
  const m = state.manifest;
  const fields: Array<{ key: string; label: string; type: 'text' | 'number' | 'textarea' | 'tags' }> = [];

  // Common fields
  fields.push(
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'displayName', label: '表示名', type: 'text' },
    { key: 'sourceFileName', label: 'ソースファイル', type: 'text' },
    { key: 'tags', label: 'タグ (カンマ区切り)', type: 'tags' },
    { key: 'notes', label: 'メモ', type: 'textarea' },
  );

  // Type-specific fields
  switch (m.type) {
    case 'character':
      fields.push(
        { key: 'characterId', label: 'キャラクターID', type: 'text' },
        { key: 'bodyType', label: '体型', type: 'text' },
        { key: 'cellWidth', label: 'セル幅', type: 'number' },
        { key: 'cellHeight', label: 'セル高', type: 'number' },
        { key: 'columns', label: '列数', type: 'number' },
        { key: 'rows', label: '行数', type: 'number' },
      );
      break;
    case 'enemy':
      fields.push(
        { key: 'enemyId', label: '敵ID', type: 'text' },
        { key: 'baseFamily', label: '基本ファミリー', type: 'text' },
        { key: 'motif', label: 'モチーフ', type: 'text' },
        { key: 'behavior', label: '行動パターン', type: 'text' },
        { key: 'stage', label: 'ステージ', type: 'text' },
        { key: 'sizeTier', label: 'サイズ区分', type: 'text' },
        { key: 'palette', label: 'パレット', type: 'text' },
        { key: 'hpTier', label: 'HP区分', type: 'text' },
        { key: 'speedTier', label: '速度区分', type: 'text' },
        { key: 'expTier', label: '経験値区分', type: 'text' },
        { key: 'unityPrefabHint', label: 'Unity Prefabヒント', type: 'text' },
      );
      break;
    case 'weapon':
      fields.push(
        { key: 'weaponId', label: '武器ID', type: 'text' },
        { key: 'motif', label: 'モチーフ', type: 'text' },
        { key: 'trajectory', label: '軌道', type: 'text' },
        { key: 'maxLevel', label: '最大レベル', type: 'number' },
        { key: 'unityPrefabHint', label: 'Unity Prefabヒント', type: 'text' },
      );
      break;
    case 'item':
      fields.push(
        { key: 'itemId', label: 'アイテムID', type: 'text' },
        { key: 'category', label: 'カテゴリ', type: 'text' },
        { key: 'effectType', label: '効果タイプ', type: 'text' },
        { key: 'rarity', label: 'レアリティ', type: 'text' },
        { key: 'unityPrefabHint', label: 'Unity Prefabヒント', type: 'text' },
      );
      break;
    case 'background':
      fields.push(
        { key: 'stageId', label: 'ステージID', type: 'text' },
        { key: 'targetSize', label: '目標サイズ', type: 'text' },
        { key: 'visibilityNotes', label: '表示メモ', type: 'textarea' },
      );
      break;
    case 'cutin':
      fields.push(
        { key: 'characterId', label: 'キャラクターID', type: 'text' },
        { key: 'mode', label: 'モード', type: 'text' },
        { key: 'targetSize', label: '目標サイズ', type: 'text' },
      );
      break;
  }

  editor.innerHTML = fields.map(f => {
    const val = f.key === 'tags'
      ? ((m as Record<string, unknown>)[f.key] as string[] || []).join(', ')
      : String((m as Record<string, unknown>)[f.key] ?? '');

    if (f.type === 'textarea') {
      return `<div class="field-group"><label>${f.label}</label><textarea data-field="${f.key}">${val}</textarea></div>`;
    }
    return `<div class="field-group"><label>${f.label}</label><input type="${f.type === 'number' ? 'number' : 'text'}" data-field="${f.key}" value="${val}"></div>`;
  }).join('');

  for (const input of editor.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]')) {
    input.addEventListener('change', () => {
      const key = input.dataset.field!;
      if (key === 'tags') {
        (m as Record<string, unknown>)[key] = input.value.split(',').map(s => s.trim()).filter(Boolean);
      } else if (input.type === 'number') {
        (m as Record<string, unknown>)[key] = parseInt(input.value) || 0;
      } else {
        (m as Record<string, unknown>)[key] = input.value;
      }
    });
  }
}

// --- Prompt ---
function bindPrompt() {
  $('#btn-generate-prompt').addEventListener('click', () => {
    state.prompt = buildPrompt(state.manifest);
    $<HTMLTextAreaElement>('#prompt-textarea').value = state.prompt;
  });
  $('#btn-copy-prompt').addEventListener('click', () => {
    const text = $<HTMLTextAreaElement>('#prompt-textarea').value;
    if (text) navigator.clipboard.writeText(text);
  });
}

function renderPromptTab() {
  if (state.prompt) {
    $<HTMLTextAreaElement>('#prompt-textarea').value = state.prompt;
  }
}

// --- Library ---
function bindLibrary() {
  $('#btn-export-library').addEventListener('click', () => {
    downloadFile('asset-library.json', exportLibraryJSON(), 'application/json');
  });
  $('#btn-import-library').addEventListener('click', () => {
    $<HTMLInputElement>('#library-import-input').click();
  });
  $<HTMLInputElement>('#library-import-input').addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const count = importLibraryJSON(reader.result as string);
        showToast(`${count} 件インポートしました`);
        renderLibrary();
      } catch (err) {
        showToast('読込エラー: ' + (err as Error).message, true);
      }
    };
    reader.readAsText(file);
  });
}

function renderLibrary() {
  const list = $('#library-list');
  const entries = loadLibrary();
  if (entries.length === 0) {
    list.innerHTML = '<div class="empty-state">ライブラリは空です</div>';
    return;
  }
  list.innerHTML = entries.map((entry, i) => `
    <div class="library-card">
      <div class="info">
        <div class="name">${entry.manifest.displayName || entry.manifest.id || '(untitled)'}</div>
        <div class="meta">${entry.manifest.type} | ${entry.manifest.sourceFileName || '-'} | ${new Date(entry.updatedAt).toLocaleString()}</div>
      </div>
      <div class="actions">
        <button class="btn" data-lib-load="${i}">読込</button>
        <button class="btn" data-lib-dup="${i}">複製</button>
        <button class="btn btn-danger" data-lib-del="${i}">削除</button>
      </div>
    </div>
  `).join('');

  for (const btn of list.querySelectorAll<HTMLButtonElement>('[data-lib-load]')) {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.libLoad!);
      const entry = loadLibrary()[idx];
      if (entry) {
        state.manifest = entry.manifest;
        state.assetType = entry.manifest.type;
        state.prompt = entry.prompt || '';
        if (entry.inspectResult) state.inspectResult = entry.inspectResult;
        for (const b of $$<HTMLButtonElement>('.type-btn')) b.classList.toggle('active', b.textContent === state.assetType);
        switchTab('manifest');
      }
    });
  }
  for (const btn of list.querySelectorAll<HTMLButtonElement>('[data-lib-dup]')) {
    btn.addEventListener('click', () => {
      duplicateEntry(parseInt(btn.dataset.libDup!));
      renderLibrary();
    });
  }
  for (const btn of list.querySelectorAll<HTMLButtonElement>('[data-lib-del]')) {
    btn.addEventListener('click', () => {
      if (confirm('削除しますか?')) {
        deleteEntry(parseInt(btn.dataset.libDel!));
        renderLibrary();
      }
    });
  }
}

// --- Export / Download ---
function bindExport() {
  $('#btn-dl-manifest').addEventListener('click', () => {
    downloadFile('manifest.json', JSON.stringify(state.manifest, null, 2), 'application/json');
  });
  $('#btn-dl-inspect').addEventListener('click', () => {
    if (!state.inspectResult) { showToast('検査結果がありません', true); return; }
    downloadFile('inspection-report.json', JSON.stringify(state.inspectResult, null, 2), 'application/json');
  });
  $('#btn-dl-prompt').addEventListener('click', () => {
    const text = state.prompt || $<HTMLTextAreaElement>('#prompt-textarea')?.value;
    if (!text) { showToast('プロンプトがありません', true); return; }
    downloadFile('prompt.txt', text, 'text/plain');
  });
}

function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Toast ---
function showToast(msg: string, isError = false) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
    padding: '8px 20px', borderRadius: '6px', fontSize: '13px', zIndex: '9999',
    background: isError ? 'var(--error)' : 'var(--accent)', color: 'var(--bg-dark)',
    fontWeight: '600', boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    transition: 'opacity 0.3s',
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', init);
