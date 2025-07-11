import { blends } from '@/features/effects/consts';
import { useControls } from 'leva';

export default function useHueSaturationController() {
  const hueSaturationValues = useControls(
    'hue saturation',
    {
      apply: { options: [true, false], value: false },
      blend: {
        options: Object.keys(blends),
        value: 'SRC',
      },
      saturation: {
        value: 0,
        min: -1,
        max: 1,
        step: 0.1,
      },
      hue: {
        value: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return hueSaturationValues;
}
