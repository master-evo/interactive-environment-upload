import { blends } from '@/features/effects/consts';
import { useControls } from 'leva';

export default function useBloomController() {
  const bloomValues = useControls(
    'bloom',
    {
      apply: { options: [true, false], value: true },
      intensity: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      luminanceThreshold: {
        value: 0,
        min: 0,
        step: 0.1,
      },
      luminanceSmoothing: {
        value: 9,
        min: 0,
        step: 0.1,
      },
      blend: {
        options: Object.keys(blends),
        value: 'SCREEN',
      },
    },
    { collapsed: true },
  );

  return bloomValues;
}
