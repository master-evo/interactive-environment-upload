import type { AutoFocusProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useAutoFocusController(
  initial?: Partial<AutoFocusProps>,
) {
  const autoFocusValue = useControls(
    'autofocus',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? false,
      },
      smoothTime: {
        value: initial?.smoothTime ?? 0.5,
        min: 0,
        max: 1,
        step: 0.1,
      },
      focusRange: {
        value: initial?.focusRange ?? 0.05,
        min: 0,
        max: 1,
        step: 0.01,
      },
      bokehScale: {
        value: initial?.bokehScale ?? 4,
        min: 0,
        max: 50,
        step: 0.5,
      },
    },
    { collapsed: true },
  );

  return autoFocusValue;
}
