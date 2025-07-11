import { blends } from '@/features/effects/consts';
import type { VignetteProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useVignetteController(
  initial?: Partial<VignetteProps>,
) {
  const vignetteValues = useControls(
    'vignette',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? true,
      },
      eskil: {
        options: [true, false],
        value: initial?.eskil ?? true,
      },
      blend: {
        options: Object.keys(blends),
        value: initial?.blend ?? 'SRC',
      },
      offset: {
        value: initial?.offset ?? 0.5,
        step: 0.1,
      },
      darkness: {
        value: initial?.darkness ?? 1.1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return vignetteValues;
}
