import { useLoaderManager } from '@/features/loader/contexts/loaderContext';
import { useGltfWithManager } from '@/features/loader/hooks/useGltfWithManager';
import { useEffect, useRef } from 'react';
import {
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Texture,
} from 'three';
import { RGBELoader } from 'three-stdlib';

interface IStaticModelProps {
  url: string;
  lightmapUrl?: string;
  onLoaded?: () => void;
  lightMapIntensity?: number;
}

export default function StaticModel({
  url,
  lightmapUrl,
  onLoaded,
  lightMapIntensity = 1.0,
}: IStaticModelProps) {
  const group = useRef<Group>(null);
  const manager = useLoaderManager();

  const { scene } = useGltfWithManager(url);

  useEffect(() => {
    if (!scene) return;

    let loadedLightmap: Texture | null = null;
    let alreadyCalled = false;
    const callLoaded = () => {
      if (!alreadyCalled && onLoaded) {
        alreadyCalled = true;
        onLoaded();
      }
    };

    const applyLightmap = () => {
      scene.scale.set(1, 1, 1);
      scene.position.set(0, 0, 0);
      scene.updateMatrixWorld(true);
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          const mat = mesh.material;
          if (Array.isArray(mat)) return;

          if (mat?.type === 'MeshBasicMaterial') {
            const basicMat = mat as MeshBasicMaterial;
            mesh.material = new MeshStandardMaterial({
              color: basicMat.color,
              map: basicMat.map ?? null,
            });
            mesh.material.needsUpdate = true;
          }

          const material = mesh.material as MeshStandardMaterial;
          if (loadedLightmap && mesh.geometry.attributes.uv1) {
            loadedLightmap.channel = 1;
            material.lightMap = loadedLightmap;
            material.lightMapIntensity = lightMapIntensity;
            material.needsUpdate = true;
          }
        }
      });

      callLoaded();
    };

    if (lightmapUrl) {
      const rgbeLoader = new RGBELoader(manager);
      rgbeLoader.load(
        lightmapUrl,
        (hdrTexture: Texture) => {
          hdrTexture.flipY = false;
          // @ts-expect-error
          hdrTexture.encoding = LinearSRGBColorSpace;
          loadedLightmap = hdrTexture;
          applyLightmap();
          console.log('Lightmap HDR carregado com sucesso:', lightmapUrl);
        },
        undefined,
        (err: unknown) => {
          console.error('Erro ao carregar lightmap HDR:', err);
          applyLightmap();
        },
      );
    } else {
      applyLightmap();
    }
  }, [scene, lightmapUrl, lightMapIntensity]);

  if (!scene) return null;

  return <primitive ref={group} object={scene} />;
}
