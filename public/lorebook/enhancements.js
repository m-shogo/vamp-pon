const modules = [
  './profile-enhancement.js',
  './relationship-enhancement.js',
  './combat-enhancement.js',
  './history-enhancement.js',
  './decision-lab.js',
  './theme-enhancement.js',
  './franchise-enhancement.js',
  './silhouette-enhancement.js',
  './motion-enhancement.js',
  './series-cast-enhancement.js',
];

const results = await Promise.allSettled(modules.map((path) => import(path)));
results.forEach((result, index) => {
  if (result.status === 'rejected') {
    console.error(`[lorebook] enhancement failed: ${modules[index]}`, result.reason);
  }
});

document.documentElement.dataset.enhancementsReady = 'true';
