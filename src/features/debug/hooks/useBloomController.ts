import { useSettings } from '@/features/debug/hooks/useSettings';
import { blends } from '@/features/effects/consts';
import type { BloomProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useBloomController(initial?: Partial<BloomProps>) {
  const bloomValues = useControls(
    'bloom',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? true,
      },
      intensity: {
        value: initial?.intensity ?? 1,
        min: 0,
        step: 0.1,
      },
      luminanceThreshold: {
        value: initial?.luminanceThreshold ?? 0,
        min: 0,
        step: 0.1,
      },
      luminanceSmoothing: {
        value: initial?.luminanceSmoothing ?? 9,
        min: 0,
        step: 0.1,
      },
      blend: {
        options: Object.keys(blends),
        value: initial?.blend ?? 'SCREEN',
      },
    },
    { collapsed: true },
  );

  const { set } = useSettings();

  set('bloom', bloomValues);

  return bloomValues;
}
