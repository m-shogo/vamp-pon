const PROFILE_URL = './data/personal-profiles.v1.json';
let profiles = [];

const profileStyles = document.createElement('link');
profileStyles.rel = 'stylesheet';
profileStyles.href = './profile.css';
document.head.append(profileStyles);

function profileByName(name) {
  return profiles.find((profile) => profile.name === name);
}

function profileMarkup(profile) {
  return `
    <section class="personal-profile-section" data-profile-for="${profile.lorebookId}">
      <div class="profile-section-heading">
        <div><span>PERSONAL FILE</span><h3>普段の ${profile.name}</h3></div>
        <small>${profile.birthday} / ${profile.zodiac} / ${profile.ageImpression}</small>
      </div>
      <div class="profile-snapshot-grid">
        <article><span>好きな食べ物</span><strong>${profile.favoriteFood}</strong><p>${profile.favoriteFoodReason}</p></article>
        <article><span>趣味</span><strong>${profile.hobby}</strong></article>
        <article><span>小さな癖</span><strong>${profile.smallHabit}</strong></article>
        <article><span>好き / 苦手</span><strong>${profile.likes}</strong><p>苦手 — ${profile.dislikes}</p></article>
      </div>
      <blockquote class="daily-life-scene"><span>DAILY LIFE</span>${profile.dailyLifeScene}</blockquote>
      <details class="name-rationale"><summary>名前の制作意図</summary><p>${profile.nameRationale}</p><code>runtime: ${profile.runtimeId}</code></details>
    </section>
  `;
}

function enhanceDialog() {
  const body = document.querySelector('#characterDialogBody .dialog-body');
  if (!body || body.querySelector('.personal-profile-section')) return;
  const name = body.querySelector('.dialog-head h2')?.textContent?.trim();
  if (!name) return;
  const profile = profileByName(name);
  if (!profile) return;
  const source = body.querySelector('.source-note');
  if (source) source.insertAdjacentHTML('beforebegin', profileMarkup(profile));
  else body.insertAdjacentHTML('beforeend', profileMarkup(profile));
}

function enhanceCards() {
  document.querySelectorAll('.character-card').forEach((card) => {
    if (card.querySelector('.profile-hint')) return;
    const name = card.querySelector('h3')?.textContent?.trim();
    const profile = profileByName(name);
    if (!profile) return;
    const core = card.querySelector('.core');
    if (!core) return;
    core.insertAdjacentHTML('beforebegin', `<div class="profile-hint"><span>${profile.birthday}</span><span>${profile.favoriteFood}</span><span>${profile.hobby.split('、')[0]}</span></div>`);
  });
}

async function bootProfiles() {
  try {
    const response = await fetch(PROFILE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    profiles = data.profiles ?? [];

    const dialogBody = document.querySelector('#characterDialogBody');
    const grid = document.querySelector('#characterGrid');
    if (dialogBody) new MutationObserver(enhanceDialog).observe(dialogBody, { childList: true, subtree: true });
    if (grid) new MutationObserver(enhanceCards).observe(grid, { childList: true, subtree: true });
    enhanceCards();
    enhanceDialog();
  } catch (error) {
    console.error('[lorebook] failed to load personal profiles', error);
  }
}

bootProfiles();
import('./relationship-enhancement.js').catch((error) => console.error('[lorebook] failed to boot relationship enhancement', error));
