import Effects from '@/features/effects/Effects';
import { Environment, Sky } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
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

  const { ambientLightIntensity, environmentIntensity, lightMapIntensity } =
    useControls(
      'scene',
      {
        ambientLightIntensity: {
          value: 0,
          min: 0,
          step: 0.1,
        },
        environmentIntensity: {
          value: 0.2,
          min: 0,
          step: 0.1,
        },
        lightMapIntensity: {
          value: 1,
          min: 0,
          step: 0.1,
        },
      },
      { collapsed: true },
    );

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
      <ambientLight intensity={ambientLightIntensity} />
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
        environmentIntensity={environmentIntensity}
        resolution={32}
      />
      <Sky distance={450000} sunPosition={[1, 1, -1]} mieCoefficient={0} />
      {children}
      <StaticModel
        url={modelUrl}
        lightmapUrl={hdrUrl}
        lightMapIntensity={lightMapIntensity}
        onLoaded={() => {
          setEnvLoaded(true);
        }}
      />
      {envLoaded && <PlayerController camera={camRef.current} />}
      <Effects />
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
