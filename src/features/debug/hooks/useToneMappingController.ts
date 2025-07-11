import { useSettings } from '@/features/debug/hooks/useSettings';
import { blends, toneMappings } from '@/features/effects/consts';
import type { ToneMappingProps } from '@/features/effects/types';
import { useControls } from 'leva';

export default function useToneMappingController(
  initial?: Partial<ToneMappingProps>,
) {
  const toneMappingValues = useControls(
    'tonemap',
    {
      apply: {
        options: [true, false],
        value: initial?.apply ?? true,
      },
      mode: {
        options: Object.keys(toneMappings),
        value: initial?.mode ?? 'REINHARD2_ADAPTIVE',
      },
      blend: {
        options: Object.keys(blends),
        value: initial?.blend ?? 'SRC',
      },
      adaptive: {
        options: [true, false],
        value: initial?.adaptive ?? true,
      },
      middleGrey: {
        value: initial?.middleGrey ?? 0.6,
        min: 0,
        step: 0.1,
      },
      maxLuminance: {
        value: initial?.maxLuminance ?? 16,
        min: 0,
        step: 1,
      },
      minLuminance: {
        value: initial?.minLuminance ?? 0.01,
        min: 0,
        step: 0.01,
      },
      averageLuminance: {
        value: initial?.averageLuminance ?? 1,
        min: 0,
        step: 0.1,
      },
      adaptationRate: {
        value: initial?.adaptationRate ?? 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  const { set } = useSettings();

  set('toneMapping', toneMappingValues);

  return toneMappingValues;
}
