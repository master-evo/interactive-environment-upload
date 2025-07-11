import EffectsController from '@/features/debug/EffectsController';
import useSceneController from '@/features/debug/hooks/useSceneController';
import { Bvh, Environment, Sky } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EXRLoader, RGBELoader } from 'three-stdlib';
import { FpsCounter } from '../features/debug/FpsCounter';
import PlayerController from '../features/player-controller/PlayerController';
import StaticModel from './StaticModel';

interface IDefaultSceneProps {
  children?: React.ReactNode;
  className?: string;
  modelUrl: string;
  hdrUrl: string;
}

function SceneContent({
  children,
  modelUrl,
  hdrUrl,
}: {
  children: React.ReactNode;
  modelUrl: string;
  hdrUrl: string;
  disableEnvironment?: boolean;
}) {
  const { set, gl } = useThree();
  const camRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ),
  );

  gl.debug.checkShaderErrors = true;
  gl.debug.onShaderError = (error) => {
    console.error('Shader error:', error);
  };

  useEffect(() => {
    const win = window as unknown as { rendererRef?: THREE.WebGLRenderer };
    win.rendererRef = gl;
    return () => {
      if (win.rendererRef === gl) {
        delete win.rendererRef;
      }
    };
  }, [gl]);

  useEffect(() => {
    camRef.current.position.set(0, 5, 5);
    set({ camera: camRef.current });
  }, [set]);

  const [envLoaded, setEnvLoaded] = useState(false);
  // @ts-expect-error: envMap not used
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);
  // @ts-expect-error: loadingEnv not used
  const [loadingEnv, setLoadingEnv] = useState(false);

  const sceneSettings = useSceneController();

  // Carrega HDR/EXR manualmente
  useEffect(() => {
    if (!hdrUrl) return;
    setLoadingEnv(true);
    let disposed = false;
    let loader: RGBELoader | EXRLoader;
    const isEXR = hdrUrl.toLowerCase().endsWith('.exr');
    if (isEXR) {
      loader = new EXRLoader();
    } else {
      loader = new RGBELoader();
    }
    loader.load(
      hdrUrl,
      (texture) => {
        if (disposed) return;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setEnvMap(texture);
        setLoadingEnv(false);
      },
      undefined,
      (err) => {
        setEnvMap(null);
        setLoadingEnv(false);
        console.error('Erro ao carregar HDR/EXR:', err);
      },
    );
    return () => {
      disposed = true;
    };
  }, [hdrUrl]);

  return (
    <>
      <ambientLight intensity={sceneSettings.ambientLightIntensity} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        castShadow={true}
        intensity={0.5 * 2}
      />
      <Environment
        files={'/assets/passendorf_snow_1k.exr'}
        background
        backgroundIntensity={0.5}
        blur={0.5}
        environmentIntensity={sceneSettings.environmentIntensity}
        resolution={32}
      />
      {sceneSettings.sun && (
        <Sky
          distance={sceneSettings.distance}
          sunPosition={sceneSettings.position}
          mieCoefficient={sceneSettings.mieCoefficient}
        />
      )}
      <Bvh firstHitOnly>
        {children}
        <StaticModel
          url={modelUrl}
          lightmapUrl={hdrUrl}
          lightMapIntensity={sceneSettings.lightMapIntensity}
          onLoaded={() => {
            setEnvLoaded(true);
          }}
        />
      </Bvh>

      {envLoaded && <PlayerController camera={camRef.current} />}
      <EffectsController />
    </>
  );
}

export default function DefaultScene({
  children,
  className,
  modelUrl,
  hdrUrl,
}: IDefaultSceneProps & { disableEnvironment?: boolean }) {
  return (
    <>
      <FpsCounter />
      <Canvas legacy className={className}>
        <SceneContent modelUrl={modelUrl} hdrUrl={hdrUrl}>
          {children}
        </SceneContent>
      </Canvas>
    </>
  );
}
