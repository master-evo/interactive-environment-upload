import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type LoaderStep = {
  progress: number;
  done: boolean;
  currentType?: string;
  currentUrl?: string;
};

export function useThreeLoader(
  manager: THREE.LoadingManager,
  onLoading?: (step: LoaderStep) => void,
) {
  const seenUrls = useRef<Set<string>>(new Set());
  const lockRef = useRef(false);
  const lastType = useRef<string | undefined>(undefined);
  const lastUrl = useRef<string | undefined>(undefined);

  useEffect(() => {
    manager.onStart = () => {
      seenUrls.current.clear();
      lockRef.current = false;
      lastType.current = undefined;
      lastUrl.current = undefined;
      onLoading?.({ progress: 0, done: false });
      console.log('[Loader] ▶️ Iniciando carregamento...');
    };

    manager.onProgress = (url, loadedCount, total) => {
      if (lockRef.current) return;

      const isNew = !seenUrls.current.has(url);
      seenUrls.current.add(url);

      let tipo: string;
      if (url.endsWith('.glb')) tipo = 'GLB';
      else if (url.endsWith('.hdr')) tipo = 'HDR';
      else if (url.endsWith('.exr')) tipo = 'EXR';
      else if (url.startsWith('blob:')) tipo = 'BLOB';
      else tipo = 'Outro';

      if (isNew) {
        lastType.current = tipo;
        lastUrl.current = url;
        console.log(
          `[Loader] +${tipo.padEnd(5)} | ${loadedCount}/${total} | ${url}`,
        );
      }
      const progress = Math.min((loadedCount / total) * 100, 100);
      onLoading?.({
        progress,
        done: false,
        currentType: lastType.current,
        currentUrl: lastUrl.current,
      });
    };

    manager.onLoad = () => {
      if (lockRef.current) return;
      lockRef.current = true;
      onLoading?.({
        progress: 100,
        done: true,
        currentType: lastType.current,
        currentUrl: lastUrl.current,
      });
      console.log('[Loader] ✅ Tudo carregado!');
    };

    manager.onError = (url) => {
      if (lockRef.current) return;
      lockRef.current = true;
      console.error(`[Loader] ❌ Erro ao carregar: ${url}`);
      onLoading?.({
        progress: 100,
        done: true,
        currentType: lastType.current,
        currentUrl: lastUrl.current,
      });
    };

    return () => {
      manager.onStart = () => {};
      manager.onProgress = () => {};
      manager.onLoad = () => {};
      manager.onError = () => {};
    };
  }, [manager]);
}
