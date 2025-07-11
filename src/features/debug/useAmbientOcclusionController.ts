import { useControls } from 'leva';

export default function useAmbientOcclusionController() {
  const aoValues = useControls(
    'ambient occlusion',
    {
      apply: { options: [true, false], value: true },
      radius: {
        value: 5,
        min: 0,
        step: 1,
      },
      distanceFalloff: {
        value: 1,
        min: 0,
        step: 0.2,
      },
      intensity: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      color: '#000',
      samples: {
        value: 16,
        min: 1,
        step: 1,
      },
      denoiseSamples: {
        value: 8,
        min: 1,
        step: 1,
      },
      denoiseRadius: {
        value: 12,
        min: 1,
        step: 1,
      },
    },
    { collapsed: true },
  );

  return aoValues;
}
