import { blends, toneMappings } from '@/features/effects/consts';
import { useControls } from 'leva';

export default function useToneMappingController() {
  const toneMappingValues = useControls(
    'tonemap',
    {
      apply: { options: [true, false], value: true },
      mode: {
        options: Object.keys(toneMappings),
        value: 'REINHARD2_ADAPTIVE',
      },
      blend: {
        options: Object.keys(blends),
        value: 'SRC',
      },
      adaptive: { options: [true, false], value: true },
      middleGrey: {
        value: 0.6,
        min: 0,
        step: 0.1,
      },
      maxLuminance: {
        value: 16,
        min: 0,
        step: 1,
      },
      minLuminance: {
        value: 0.01,
        min: 0,
        step: 0.01,
      },
      averageLuminance: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      adaptationRate: {
        value: 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  return toneMappingValues;
}
