import { useControls } from 'leva';

export default function useDepthOfFieldController() {
  const depthOfFieldValues = useControls(
    'depth of field',
    {
      apply: { options: [true, false], value: true },
      focusDistance: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.001,
      },
      focalLength: {
        value: 0.02,
        min: 0,
        max: 1,
        step: 0.001,
      },
      bokehScale: {
        value: 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return depthOfFieldValues;
}
