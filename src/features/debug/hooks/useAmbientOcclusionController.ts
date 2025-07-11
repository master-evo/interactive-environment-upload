import type { AOProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useAmbientOcclusionController(
  initial?: Partial<AOProps>,
) {
  const aoValues = useControls(
    'ambient occlusion',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? true,
      },
      radius: {
        value: initial?.radius ?? 5,
        min: 0,
        step: 1,
      },
      distanceFalloff: {
        value: initial?.distanceFalloff ?? 1,
        min: 0,
        step: 0.2,
      },
      intensity: {
        value: initial?.intensity ?? 1,
        min: 0,
        step: 0.1,
      },
      color: initial?.color ?? '#000',
      samples: {
        value: initial?.samples ?? 16,
        min: 1,
        step: 1,
      },
      denoiseSamples: {
        value: initial?.denoiseSamples ?? 8,
        min: 1,
        step: 1,
      },
      denoiseRadius: {
        value: initial?.denoiseRadius ?? 12,
        min: 1,
        step: 1,
      },
    },
    { collapsed: true },
  );

  return aoValues;
}
