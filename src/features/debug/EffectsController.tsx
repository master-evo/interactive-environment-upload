import useAmbientOcclusionController from '@/features/debug/hooks/useAmbientOcclusionController';
import useAntiAliasingController from '@/features/debug/hooks/useAntiAliasingController';
import useAutoFocusController from '@/features/debug/hooks/useAutoFocusController';
import useBloomController from '@/features/debug/hooks/useBloomController';
import useDepthOfFieldController from '@/features/debug/hooks/useDepthOfFieldController';
import useHueSaturationController from '@/features/debug/hooks/useHueSaturationController';
import useToneMappingController from '@/features/debug/hooks/useToneMappingController';
import useVignetteController from '@/features/debug/hooks/useVignetteController';
import Effects, { type EffectsProps } from '@/features/effects/Effects';

export default function EffectsController({
  bloom,
  ao,
  aa,
  autoFocus,
  dof,
  toneMapping,
  vignette,
  hueSaturation,
}: RecursivePartial<EffectsProps>) {
  const bloomSettings = useBloomController(bloom);
  const aoSettings = useAmbientOcclusionController(ao);
  const aaSettings = useAntiAliasingController(aa);
  const autoFocusSettings = useAutoFocusController(autoFocus);
  const dofSettings = useDepthOfFieldController(dof);
  const toneMappingSettings = useToneMappingController(toneMapping);
  const vignetteSettings = useVignetteController(vignette);
  const hueSaturationSettings = useHueSaturationController(hueSaturation);

  return (
    <Effects
      bloom={bloomSettings}
      ao={aoSettings}
      aa={aaSettings}
      autoFocus={autoFocusSettings}
      dof={dofSettings}
      toneMapping={toneMappingSettings}
      vignette={vignetteSettings}
      hueSaturation={hueSaturationSettings}
    />
  );
}
