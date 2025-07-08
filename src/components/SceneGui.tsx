import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';

export interface SceneGuiProps {
  ambientLightIntensity: number;
  setAmbientLightIntensity: (v: number) => void;
  environmentIntensity: number;
  setEnvironmentIntensity: (v: number) => void;
  lightMapIntensity: number;
  setLightMapIntensity: (v: number) => void;
}

export default function SceneGui({
  ambientLightIntensity,
  setAmbientLightIntensity,
  environmentIntensity,
  setEnvironmentIntensity,
  lightMapIntensity,
  setLightMapIntensity,
}: SceneGuiProps) {
  const guiRef = useRef<GUI | null>(null);

  useEffect(() => {
    const gui = new GUI();
    guiRef.current = gui;
    const folder = gui.addFolder('Scene Controls');
    folder
      .add({ ambientLightIntensity }, 'ambientLightIntensity', 0, 2, 0.01)
      .onChange(setAmbientLightIntensity);
    folder
      .add({ environmentIntensity }, 'environmentIntensity', 0, 2, 0.01)
      .onChange(setEnvironmentIntensity);
    folder
      .add({ lightMapIntensity }, 'lightMapIntensity', 0, 5, 0.01)
      .onChange(setLightMapIntensity);
    folder.open();
    return () => {
      gui.destroy();
    };
  }, []);

  // Sync values if changed externally
  useEffect(() => {
    if (guiRef.current) {
      guiRef.current.controllersRecursive().forEach((ctrl) => {
        if (ctrl._name === 'ambientLightIntensity')
          ctrl.setValue(ambientLightIntensity);
        if (ctrl._name === 'environmentIntensity')
          ctrl.setValue(environmentIntensity);
        if (ctrl._name === 'lightMapIntensity')
          ctrl.setValue(lightMapIntensity);
      });
    }
  }, [ambientLightIntensity, environmentIntensity, lightMapIntensity]);

  return null;
}
