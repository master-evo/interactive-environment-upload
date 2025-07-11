import { blends } from '@/features/effects/consts';
import type { HueSaturationProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useHueSaturationController(
  initial?: Partial<HueSaturationProps>,
) {
  const hueSaturationValues = useControls(
    'hue saturation',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? false,
      },
      blend: {
        options: Object.keys(blends),
        value: initial?.blend ?? 'SRC',
      },
      saturation: {
        value: initial?.saturation ?? 0,
        min: -1,
        max: 1,
        step: 0.1,
      },
      hue: {
        value: initial?.hue ?? 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return hueSaturationValues;
}
