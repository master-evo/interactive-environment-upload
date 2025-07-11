import { useControls } from 'leva';

export default function useAntiAliasingController() {
  const aaValues = useControls(
    'anti aliasing',
    {
      apply: { options: [true, false], value: true },
    },
    { collapsed: true },
  );

  return aaValues;
}
