import type { AAProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useAntiAliasingController(initial?: Partial<AAProps>) {
  const aaValues = useControls(
    'anti aliasing',
    {
      apply: { options: [true, false], value: initial?.apply ?? true },
    },
    { collapsed: true },
  );

  return aaValues;
}
