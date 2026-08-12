const AUTHOR_DASHBOARD_SOURCES = {
  profile: './data/profile-book-navigation.v1.json',
  world: './data/world-bible.v1.json',
  relationships: './data/relationship-arcs.v1.json',
  eras: './data/core5-era-canon.v1.json',
  roots: './data/reality-root-map.v1.json',
};

const dashboardStyles = document.createElement('link');
dashboardStyles.rel = 'stylesheet';
dashboardStyles.href = './author-dashboard.css';
document.head.append(dashboardStyles);

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
};

function dashboardCardMarkup({ href, eyebrow, value, unit, title, copy, meta }) {
  return `
    <a class="author-dashboard-card" href="${href}">
      <span class="author-dashboard-card-eyebrow">${eyebrow}</span>
      <div class="author-dashboard-card-value"><strong>${value}</strong><small>${unit}</small></div>
      <h3>${title}</h3>
      <p>${copy}</p>
      <footer>${meta}</footer>
    </a>
  `;
}

function openGateMarkup({ label, value, href, detail }) {
  return `
    <a href="${href}" class="author-open-gate">
      <span>${label}</span>
      <strong>${value}</strong>
      <p>${detail}</p>
    </a>
  `;
}

function renderAuthorDashboard({ profile, world, relationships, eras, roots }) {
  const overview = document.querySelector('#overview');
  if (!overview || overview.querySelector('.author-overview-dashboard')) return;

  const relationCount = world.relationships?.length ?? 0;
  const detailedArcCount = relationships.arcs?.length ?? 0;
  const reserveLaneCount = relationships.relationshipReservoir?.length ?? 0;
  const eraAssignments = eras.assignments ?? [];
  const exactYearOpenCount = eraAssignments.filter((entry) => entry.exactYear == null).length;
  const rootEntries = roots.entries ?? [];
  const futureRootCount = roots.futureAbstractCount ?? rootEntries.filter((entry) => entry.placementKind === 'FUTURE_ABSTRACT').length;
  const openRootCount = roots.openUnmappedCount ?? rootEntries.filter((entry) => entry.placementKind === 'OPEN_UNMAPPED').length;
  const exactCoordinateCount = roots.exactCoordinateCount ?? rootEntries.filter((entry) => entry.exactCoordinates != null).length;
  const currentCount = profile.current21Count ?? 0;
  const future15Count = profile.future15Count ?? 0;

  const cards = [
    {
      href:'#characters', eyebrow:'PROFILE BOOK', value:profile.characterCount, unit:'CHARACTERS', title:'人物を6章で読む',
      copy:`${profile.dimensionCount} dimensionsを${profile.sectionCount} sectionsへ整理。情報量ではなく入口を揃える。`,
      meta:`Current21 ${currentCount} / Future15 ${future15Count}`,
    },
    {
      href:'#relationships', eyebrow:'RELATIONSHIP LANES', value:relationCount, unit:'CURRENT LANES', title:'線は好感度ではなくSourceへの道',
      copy:'Currentの関係レーンを、恋愛・血縁・善悪へ追加推論せず辿る。',
      meta:`Detailed arc ${detailedArcCount} / Reservoir ${reserveLaneCount}`,
    },
    {
      href:'#history', eyebrow:'TEMPORAL MAP', value:eraAssignments.length, unit:'REALITY ERAS', title:'5つの「今」を横断する',
      copy:'Realityの時系列とDream overlayを分離し、rough bandをexact yearへ偽装しない。',
      meta:`Exact year OPEN ${exactYearOpenCount}/${eraAssignments.length}`,
    },
    {
      href:'#world', eyebrow:'REALITY ROOT ATLAS', value:rootEntries.length, unit:'ROOTS', title:'Reality Rootと事件地域を分けて見る',
      copy:'root / incident area / mobilityを分離。Future/Openをfake座標へ置かない。',
      meta:`Future abstract ${futureRootCount} / Open ${openRootCount} / Coord ${exactCoordinateCount}`,
    },
  ].map(dashboardCardMarkup).join('');

  const gates = [
    {
      label:'PUBLIC / SPOILER',
      value: profile.publicSpoilerProjectionDefined ? 'DEFINED' : 'OPEN',
      href:'#characters',
      detail:'Public-safe projectionはまだAuthor viewから自動生成しない。',
    },
    {
      label:'EXACT YEARS',
      value:`${exactYearOpenCount} OPEN`,
      href:'#history',
      detail:'rough historical bandは使えるが、exact yearは未確定のまま。',
    },
    {
      label:'REALITY ROOT',
      value:`${openRootCount} OPEN`,
      href:'#world',
      detail:'Open locationをfalseや推測住所で埋めない。Future abstractの文字列にOpenが含まれてもOpen/unmappedへ二重計上しない。',
    },
    {
      label:'FUTURE15',
      value:`${future15Count} CANDIDATES`,
      href:'#characters',
      detail:'情報が厚くてもCurrent21へ自動昇格しない。',
    },
  ].map(openGateMarkup).join('');

  const anchor = overview.querySelector('.overview-grid') ?? overview.querySelector('.overview-board') ?? overview.querySelector('.section-head');
  if (!anchor) return;
  anchor.insertAdjacentHTML('afterend', `
    <section class="author-overview-dashboard" aria-labelledby="authorOverviewDashboardTitle">
      <header class="author-dashboard-heading">
        <div>
          <span>AUTHOR OVERVIEW / SOURCE-AWARE</span>
          <h2 id="authorOverviewDashboardTitle">設定の量ではなく、「どこを見るか」を最初に分かるようにする。</h2>
          <p>人物・関係・時間・地理のCurrent read-modelを同じ入口へ集める。数字は完成度点数ではなく、いま存在するSource-backed coverage。</p>
        </div>
        <small>NO READINESS SCORE<br>NO AUTO CANON PROMOTION</small>
      </header>
      <div class="author-dashboard-grid">${cards}</div>
      <div class="author-dashboard-gates">
        <div class="author-dashboard-gates-title"><span>OPEN / DO NOT FAKE</span><p>未確定は欠陥ではなく、まだ埋めないと決めている欄。</p></div>
        <div class="author-open-gate-grid">${gates}</div>
      </div>
      <footer class="author-dashboard-footer">
        <b>READING RULE</b>
        <p>coverage count ≠ quality score / Candidate ≠ Canon / Future15 ≠ Current21 / Open ≠ false</p>
      </footer>
    </section>
  `);
}

async function bootAuthorDashboard() {
  try {
    const [profile, world, relationships, eras, roots] = await Promise.all([
      fetchJson(AUTHOR_DASHBOARD_SOURCES.profile),
      fetchJson(AUTHOR_DASHBOARD_SOURCES.world),
      fetchJson(AUTHOR_DASHBOARD_SOURCES.relationships),
      fetchJson(AUTHOR_DASHBOARD_SOURCES.eras),
      fetchJson(AUTHOR_DASHBOARD_SOURCES.roots),
    ]);
    renderAuthorDashboard({ profile, world, relationships, eras, roots });
  } catch (error) {
    console.error('[lorebook] failed to load author overview dashboard', error);
  }
}

bootAuthorDashboard();
