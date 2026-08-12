const PROFILE_URL = './data/personal-profiles.v1.json';
const PROFILE_BOOK_NAV_URL = './data/profile-book-navigation.v1.json';
let profiles = [];
let profileBookNavigation = null;

const profileStyles = document.createElement('link');
profileStyles.rel = 'stylesheet';
profileStyles.href = './profile.css';
document.head.append(profileStyles);

const dimensionLabels = {
  realityRoot:'Reality Root', seasonArchitecture:'Season', themeColor:'Theme Color', physicalIdentityAuthority:'Physical',
  ordinaryLife:'Ordinary Life', livingPlace:'Living Place', environmentSensory:'Sensory', everydayEconomy:'Economy', leisurePlay:'Leisure', restDailyRhythm:'Rest',
  socialChemistry:'Social Chemistry', decisionCommitment:'Commitment', sharedSpaceEtiquette:'Shared Space',
  behaviorIdentity:'Behavior', communicationHabit:'Communication', humorTeasing:'Humor', addressNamingRegister:'Address', voiceProsody:'Voice',
  competenceLearning:'Learning', memoryRemembering:'Memory', livedArtifact:'Artifact',
};

function profileByName(name) {
  return profiles.find((profile) => profile.name === name);
}

function sectionCardMarkup(section, index) {
  const dimensions = section.dimensions.map((key) => `<span>${dimensionLabels[key] ?? key}</span>`).join('');
  return `
    <article class="profile-book-nav-card" data-profile-section="${section.id}">
      <div class="profile-book-nav-index">0${index + 1}</div>
      <div><small>${section.shortLabel}</small><h3>${section.label}</h3><p>${section.purpose}</p></div>
      <footer>${dimensions}</footer>
    </article>
  `;
}

function renderProfileBookGuide(book) {
  const chapter = document.querySelector('#characters');
  const toolbar = chapter?.querySelector('.toolbar');
  if (!chapter || !toolbar || chapter.querySelector('.profile-book-guide')) return;
  const sectionCards = book.sections.map(sectionCardMarkup).join('');
  const sourceLegend = book.sourceLegend.map((entry) => `
    <article data-source-kind="${entry.id}"><b>${entry.label}</b><p>${entry.meaning}</p></article>
  `).join('');
  const markup = `
    <section class="profile-book-guide" aria-labelledby="profileBookGuideTitle">
      <header>
        <div><span>PROFILE BOOK / SOURCE MAP</span><h3 id="profileBookGuideTitle">36人を、21項目の羅列ではなく6章で読む。</h3></div>
        <p><b>${book.characterCount}</b> characters · <b>${book.dimensionCount}</b> dimensions · <b>${book.sectionCount}</b> sections</p>
      </header>
      <div class="profile-book-nav-grid">${sectionCards}</div>
      <details class="profile-source-legend">
        <summary>「確定」「候補」「素材箱」「未確定」を混ぜないためのSource guide</summary>
        <div>${sourceLegend}</div>
      </details>
      <p class="profile-book-guide-rule">Profile Bookは新しい正本ではなく、正本とReservoirへ迷わず辿るための地図。Public spoiler-safe projectionはまだ未定義。</p>
    </section>
  `;
  toolbar.insertAdjacentHTML('beforebegin', markup);
}

function profileBookReadStrip(profile) {
  if (!profileBookNavigation) return '';
  return `
    <div class="profile-book-read-strip">
      <span>READ MODEL</span>
      <b>${profileBookNavigation.dimensionCount}/21 INDEXED</b>
      <small>${profileBookNavigation.sectionCount} reading sections · ${profile.name}</small>
    </div>
  `;
}

function profileMarkup(profile) {
  return `
    <section class="personal-profile-section" data-profile-for="${profile.lorebookId}">
      ${profileBookReadStrip(profile)}
      <div class="profile-section-heading">
        <div><span>PERSONAL FILE</span><h3>普段の ${profile.name}</h3></div>
        <small>${profile.birthday} / ${profile.ageImpression}</small>
      </div>
      <div class="profile-snapshot-grid">
        <article><span>好きな食べ物</span><strong>${profile.favoriteFood}</strong><p>${profile.favoriteFoodReason}</p></article>
        <article><span>趣味</span><strong>${profile.hobby}</strong></article>
        <article><span>小さな癖</span><strong>${profile.smallHabit}</strong></article>
        <article><span>好き / 苦手</span><strong>${profile.likes}</strong><p>苦手 — ${profile.dislikes}</p></article>
      </div>
      <blockquote class="daily-life-scene"><span>DAILY LIFE</span>${profile.dailyLifeScene}</blockquote>
      <details class="name-rationale"><summary>名前の制作意図</summary><p>${profile.nameRationale}</p><code>runtime: ${profile.runtimeId}</code></details>
      <p class="profile-book-detail-rule">このPersonal FileはProfile Bookの一部。21 source dimensionsの正本をここへコピーせず、必要な章からAuthority/Reservoirへ辿る。</p>
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
    const [profileResponse, navigationResponse] = await Promise.all([
      fetch(PROFILE_URL, { cache: 'no-store' }),
      fetch(PROFILE_BOOK_NAV_URL, { cache: 'no-store' }),
    ]);
    if (!profileResponse.ok || !navigationResponse.ok) throw new Error(`profile=${profileResponse.status} navigation=${navigationResponse.status}`);
    const [profileData, navigation] = await Promise.all([profileResponse.json(), navigationResponse.json()]);
    profiles = profileData.profiles ?? [];
    profileBookNavigation = navigation;

    renderProfileBookGuide(navigation);
    const dialogBody = document.querySelector('#characterDialogBody');
    const grid = document.querySelector('#characterGrid');
    if (dialogBody) new MutationObserver(enhanceDialog).observe(dialogBody, { childList: true, subtree: true });
    if (grid) new MutationObserver(enhanceCards).observe(grid, { childList: true, subtree: true });
    enhanceCards();
    enhanceDialog();
  } catch (error) {
    console.error('[lorebook] failed to load personal profiles / Profile Book navigation', error);
  }
}

bootProfiles();
