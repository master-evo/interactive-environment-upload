import { useSettings } from '@/features/debug/hooks/useSettings';
import { folder, useControls } from 'leva';

export default function useSceneController(
  initial?: Partial<{
    ambientLightIntensity: number;
    environmentIntensity: number;
    lightMapIntensity: number;
    sun: boolean;
    distance: number;
    position: [number, number, number];
    mieCoefficient: number;
  }>,
) {
  const sceneValues = useControls(
    'scene',
    {
      ambientLightIntensity: {
        value: initial?.ambientLightIntensity ?? 0,
        min: 0,
        step: 0.1,
      },
      environmentIntensity: {
        value: initial?.environmentIntensity ?? 0.2,
        min: 0,
        step: 0.1,
      },
      lightMapIntensity: {
        value: initial?.lightMapIntensity ?? 1,
        min: 0,
        step: 0.1,
      },
      sun: folder({
        sun: {
          options: [true, false],
          value: initial?.sun ?? true,
        },
        distance: {
          value: initial?.distance ?? 450000,
          min: 100,
          step: 1000,
        },
        position: initial?.position ?? [1, 1, -1],
        mieCoefficient: {
          value: initial?.mieCoefficient ?? 0,
          min: 0,
          step: 0.0001,
        },
      }),
    },
    { collapsed: true },
  );

  const { set } = useSettings();

  set('scene', sceneValues);

  return sceneValues;
}
