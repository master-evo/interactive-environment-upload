export const isMobile =
  typeof window !== 'undefined' &&
  (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ) ||
    (window.innerWidth <= 800 && window.innerHeight <= 600));

export function getLoadingLabelByType(type?: string) {
  if (!type) return 'Carregando...';
  if (type === 'GLB') return 'Carregando GLB...';
  if (type === 'HDR') return 'Carregando HDR...';
  if (type === 'EXR') return 'Carregando EXR...';
  if (type === 'BLOB') return 'Carregando arquivo temporário...';
  return `Carregando ${type}...`;
}

export function dispatchMobileMove(angle: number | null, force: number) {
  window.dispatchEvent(
    new CustomEvent('mobile-move', { detail: { angle, force } }),
  );
}

export function dispatchMobileLook(dyaw: number, dpitch: number) {
  window.dispatchEvent(
    new CustomEvent('mobile-look', { detail: { dyaw, dpitch } }),
  );
}
