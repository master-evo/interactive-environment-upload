import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import PlayerController from './PlayerController';
import { Environment } from '@react-three/drei';
import StaticModel from './StaticModel';
import { FpsCounter } from './Overlay/FpsCounter';
import { RGBELoader, EXRLoader } from 'three-stdlib';

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
  //@ts-expect-error: scene is not used
  const { set, gl, scene } = useThree();
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
  //@ts-expect-error: envMap and LoadingEnv vars are not used
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);
  //@ts-expect-error: envMap and LoadingEnv vars are not used
  const [loadingEnv, setLoadingEnv] = useState(false);

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
      <ambientLight intensity={0.5} />
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
        environmentIntensity={0.5}
        resolution={32}
      />
      {children}
      <StaticModel
        url={modelUrl}
        lightmapUrl={hdrUrl}
        onLoaded={() => {
          setEnvLoaded(true);
        }}
      />
      {envLoaded && <PlayerController camera={camRef.current} />}
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
