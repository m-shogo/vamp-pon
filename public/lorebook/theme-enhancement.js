const THEME_URL = './data/character-themes.v1.json';
let themeEntries = [];

const themeStyles = document.createElement('link');
themeStyles.rel = 'stylesheet';
themeStyles.href = './theme.css';
document.head.append(themeStyles);

function byName(name) {
  return themeEntries.find((entry) => entry.name === name);
}

function cssVars(entry) {
  return `--char-primary:${entry.primary.hex};--char-accent:${entry.accent.hex};--star-color:${entry.constellation.colorHex};`;
}

function swatchMarkup(entry) {
  const shared = entry.paletteFamilyKey
    ? `<span class="palette-share" title="${entry.sharedReason}">共有色に意味あり</span>`
    : '<span class="palette-unique">固有配色</span>';
  return `
    <section class="theme-palette" data-theme-for="${entry.lorebookId}" style="${cssVars(entry)}">
      <div class="theme-palette__head">
        <div><span>COLOR / STAR BEAST</span><h3>${entry.name}の色設計</h3></div>
        ${shared}
      </div>
      <div class="theme-swatches">
        <div><i style="background:${entry.primary.hex}"></i><span>THEME</span><strong>${entry.primary.hex}</strong><small>${entry.primary.name}</small></div>
        <div><i style="background:${entry.accent.hex}"></i><span>ACCENT</span><strong>${entry.accent.hex}</strong><small>${entry.accent.name}</small></div>
        <div><i style="background:${entry.constellation.colorHex}"></i><span>STAR</span><strong>${entry.constellation.colorHex}</strong><small>${entry.constellation.name}</small></div>
      </div>
      <div class="star-beast-profile">
        <span class="star-beast-orb" aria-hidden="true">✦</span>
        <div><small>星獣</small><strong>${entry.constellation.starBeast}</strong><p>${entry.rationale}</p></div>
      </div>
      ${entry.sharedReason ? `<details><summary>この色が共有される理由</summary><p>${entry.sharedReason}</p></details>` : ''}
    </section>
  `;
}

function enhanceCards() {
  document.querySelectorAll('.character-card').forEach((card) => {
    const name = card.querySelector('h3')?.textContent?.trim();
    const entry = byName(name);
    if (!entry) return;
    card.style.cssText += cssVars(entry);
    if (!card.querySelector('.character-palette-strip')) {
      const top = card.querySelector('.card-top');
      top?.insertAdjacentHTML('beforebegin', `
        <div class="character-palette-strip" aria-label="${name}のテーマカラー">
          <i style="background:${entry.primary.hex}"></i>
          <i style="background:${entry.accent.hex}"></i>
          <i style="background:${entry.constellation.colorHex}"></i>
        </div>
      `);
    }
    const star = card.querySelector('.star');
    if (star) star.innerHTML = `<span class="star-dot"></span>${entry.constellation.name} · ${entry.constellation.starBeast}`;
  });

  document.querySelectorAll('.relation-node').forEach((node) => {
    const label = node.querySelector('small')?.textContent?.trim();
    const entry = byName(label);
    if (!entry) return;
    node.style.cssText += cssVars(entry);
  });
}

function enhanceDialog() {
  const body = document.querySelector('#characterDialogBody .dialog-body');
  if (!body || body.querySelector('.theme-palette')) return;
  const name = body.querySelector('.dialog-head h2')?.textContent?.trim();
  const entry = byName(name);
  if (!entry) return;
  body.style.cssText += cssVars(entry);
  const personal = body.querySelector('.personal-profile-section');
  const combat = body.querySelector('.combat-guide-section');
  const anchor = personal || combat || body.querySelector('.source-note');
  if (anchor) anchor.insertAdjacentHTML('beforebegin', swatchMarkup(entry));
  else body.insertAdjacentHTML('beforeend', swatchMarkup(entry));

  const star = body.querySelector('.dialog-head .star');
  if (star) star.innerHTML = `<span class="star-dot"></span>${entry.constellation.name} · ${entry.constellation.starBeast}`;
}

async function bootThemes() {
  try {
    const response = await fetch(THEME_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    themeEntries = data.characters ?? [];

    const rootObserver = new MutationObserver(() => {
      enhanceCards();
      enhanceDialog();
    });
    rootObserver.observe(document.body, { childList: true, subtree: true });
    enhanceCards();
    enhanceDialog();
  } catch (error) {
    console.error('[lorebook] failed to load character themes', error);
  }
}

bootThemes();
