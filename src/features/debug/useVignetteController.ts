import { blends } from '@/features/effects/consts';
import { useControls } from 'leva';

export default function useVignetteController() {
  const vignetteValues = useControls(
    'vignette',
    {
      apply: { options: [true, false], value: true },
      eskil: { options: [true, false], value: true },
      blend: {
        options: Object.keys(blends),
        value: 'SRC',
      },
      offset: { value: 0.5, step: 0.1 },
      darkness: { value: 1.1, min: 0, step: 0.1 },
    },
    { collapsed: true },
  );

  return vignetteValues;
}
