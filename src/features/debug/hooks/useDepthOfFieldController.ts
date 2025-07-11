import type { DOFProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useDepthOfFieldController(initial?: Partial<DOFProps>) {
  const depthOfFieldValues = useControls(
    'depth of field',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? true,
      },
      focusDistance: {
        value: initial?.focusDistance ?? 0,
        min: 0,
        max: 1,
        step: 0.001,
      },
      focalLength: {
        value: initial?.focalLength ?? 0.02,
        min: 0,
        max: 1,
        step: 0.001,
      },
      bokehScale: {
        value: initial?.bokehScale ?? 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return depthOfFieldValues;
}
