import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import PlayerController from './PlayerController';
import { Environment } from '@react-three/drei';
import StaticModel from './StaticModel';
import { FpsCounter } from './Overlay/FpsCounter';

interface IDefaultSceneProps {
  children?: React.ReactNode;
  className?: string;
}

function SceneContent({
  children,
}: {
  children: React.ReactNode;
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
        files="/hdr/passendorf_snow_1k.exr"
        background
        backgroundIntensity={0.5}
        blur={0.5}
        environmentIntensity={0.5}
        resolution={32}
      />
      {children}
      <StaticModel
        url="/models/roberto_cozinha.glb"
        lightmapUrl="/Lightmaps/lightmap2048.0001.hdr"
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
}: IDefaultSceneProps & { disableEnvironment?: boolean }) {
  const envMode = import.meta.env.DEV;

  return (
    <>
      {envMode == true && <FpsCounter />}
      <Canvas legacy className={className}>
        <SceneContent>{children}</SceneContent>
      </Canvas>
    </>
  );
}
