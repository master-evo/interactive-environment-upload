import { useLoaderManager } from '@/components/context/loaderContext';
import { useEffect, useMemo, useState } from 'react';
import { GLTFLoader, type GLTF } from 'three-stdlib';
import { Group } from 'three';

const gltfCache = new Map<string, Promise<GLTF>>();

export function useGltfWithManager(url: string): {
  scene: Group | null;
  gltf: GLTF | null;
} {
  const manager = useLoaderManager();
  const [gltf, setGltf] = useState<GLTF | null>(null);

  const [scene, setScene] = useState<Group | null>(null);
  const memoizedScene = useMemo(() => scene, [scene]);

  useEffect(() => {
    console.log('[useGltfWithManager] carregando', url);

    let cancelled = false;

    let loaderPromise = gltfCache.get(url);
    if (!loaderPromise) {
      const loader = new GLTFLoader(manager);
      loaderPromise = new Promise<GLTF>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
      gltfCache.set(url, loaderPromise);
    }

    loaderPromise
      .then((loaded) => {
        if (!cancelled) {
          setScene(loaded.scene);
          setGltf(loaded);
        }
      })
      .catch((err) => {
        console.error(`Erro ao carregar GLTF ${url}:`, err);
      });

    return () => {
      cancelled = true;
    };
  }, [url, manager]);

  return { scene: memoizedScene, gltf };
}
