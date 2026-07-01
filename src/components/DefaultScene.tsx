import { effects } from '@/consts/effects';
import CopyButton from '@/features/debug/CopyButton';
import EffectsController from '@/features/debug/EffectsController';
import { Bvh, Environment, Sky } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EXRLoader, RGBELoader } from 'three-stdlib';
import { FpsCounter } from '../features/debug/FpsCounter';
import PlayerController from '../features/player-controller/PlayerController';
import StaticModel from './StaticModel';

const DEFAULT_HDR_URL = '/assets/passendorf_snow_1k.exr';

interface IDefaultSceneProps {
  children?: React.ReactNode;
  className?: string;
  modelUrl: string;
  hdrUrl?: string;
}

function SceneContent({
  children,
  modelUrl,
  hdrUrl,
  sceneSettings,
}: {
  children: React.ReactNode;
  modelUrl: string;
  hdrUrl?: string;
  disableEnvironment?: boolean;
  sceneSettings: {
    ambientLightIntensity: number;
    environmentIntensity: number;
    lightMapIntensity: number;
    sun: boolean;
    distance: number;
    position: [number, number, number];
    mieCoefficient: number;
  };
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

  // Carrega HDR/EXR manualmente
  useEffect(() => {
    const resolvedHdrUrl = hdrUrl ?? DEFAULT_HDR_URL;
    let disposed = false;
    let loader: RGBELoader | EXRLoader;
    const isEXR = resolvedHdrUrl.toLowerCase().endsWith('.exr');
    if (isEXR) {
      loader = new EXRLoader();
    } else {
      loader = new RGBELoader();
    }
    loader.load(
      resolvedHdrUrl,
      (texture) => {
        if (disposed) return;
        texture.mapping = THREE.EquirectangularReflectionMapping;
      },
      undefined,
      (err) => {
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
          lightmapUrl={hdrUrl ?? DEFAULT_HDR_URL}
          lightMapIntensity={sceneSettings.lightMapIntensity}
        />
      </Bvh>

      <PlayerController camera={camRef.current} />
      <EffectsController {...effects} />
      <CopyButton />
    </>
  );
}

export default function DefaultScene({
  children,
  className,
  modelUrl,
  hdrUrl,
  sceneSettings,
}: IDefaultSceneProps & {
  disableEnvironment?: boolean;
  sceneSettings: {
    ambientLightIntensity: number;
    environmentIntensity: number;
    lightMapIntensity: number;
    sun: boolean;
    distance: number;
    position: [number, number, number];
    mieCoefficient: number;
  };
}) {
  return (
    <>
      <FpsCounter />
      <Canvas legacy className={className}>
        <SceneContent
          modelUrl={modelUrl}
          hdrUrl={hdrUrl}
          sceneSettings={sceneSettings}
        >
          {children}
        </SceneContent>
      </Canvas>
    </>
  );
}
