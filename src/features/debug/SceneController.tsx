import DefaultScene from '@/components/DefaultScene';
import useSceneController from '@/features/debug/hooks/useSceneController';

export default function SceneController({
  children,
  modelUrl,
  hdrUrl,
  sceneSettings,
}: {
  children?: React.ReactNode;
  modelUrl: string;
  hdrUrl: string;
  disableEnvironment?: boolean;
  sceneSettings?: Partial<{
    ambientLightIntensity: number;
    environmentIntensity: number;
    lightMapIntensity: number;
    sun: boolean;
    distance: number;
    position: [number, number, number];
    mieCoefficient: number;
  }>;
}) {
  const settings = useSceneController(sceneSettings);

  return (
    <DefaultScene modelUrl={modelUrl} hdrUrl={hdrUrl} sceneSettings={settings}>
      {children}
    </DefaultScene>
  );
}
