export function isRunStartUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const play = new URLSearchParams(search).get('play');
  return play === '1' || play === 'true';
}
