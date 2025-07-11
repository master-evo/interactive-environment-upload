import { useSettings } from '@/features/debug/hooks/useSettings';
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

  const { set } = useSettings();

  set('aa', aaValues);

  return aaValues;
}
