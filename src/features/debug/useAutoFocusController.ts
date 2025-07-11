import { useControls } from 'leva';

export default function useAutoFocusController() {
  const autoFocusValue = useControls(
    'autofocus',
    {
      apply: { options: [true, false], value: false },
      smoothTime: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
      },
      focusRange: {
        value: 0.05,
        min: 0,
        max: 1,
        step: 0.01,
      },
      bokehScale: {
        value: 4,
        min: 0,
        max: 50,
        step: 0.5,
      },
    },
    { collapsed: true },
  );

  return autoFocusValue;
}
