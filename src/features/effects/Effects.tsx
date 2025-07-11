import useAmbientOcclusionController from '@/features/debug/useAmbientOcclusionController';
import useAntiAliasingController from '@/features/debug/useAntiAliasingController';
import useAutoFocusController from '@/features/debug/useAutoFocusController';
import useBloomController from '@/features/debug/useBloomController';
import useDepthOfFieldController from '@/features/debug/useDepthOfFieldController';
import useToneMappingController from '@/features/debug/useToneMappingController';
import useVignetteController from '@/features/debug/useVignetteController';
import { blends, toneMappings } from '@/features/effects/consts';
import {
  Autofocus,
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  SMAA,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';

export default function Effects() {
  const bloom = useBloomController();
  const ao = useAmbientOcclusionController();
  const aa = useAntiAliasingController();
  const autoFocus = useAutoFocusController();
  const dof = useDepthOfFieldController();
  const toneMapping = useToneMappingController();
  const vignette = useVignetteController();

  return (
    <EffectComposer>
      {bloom.apply ? (
        <Bloom
          intensity={bloom.intensity}
          luminanceThreshold={bloom.luminanceThreshold}
          luminanceSmoothing={bloom.luminanceSmoothing}
          blendFunction={blends[bloom.blend]}
          height={300}
        />
      ) : (
        <></>
      )}

      {dof.apply ? (
        <DepthOfField
          focusDistance={dof.focusDistance}
          focalLength={dof.focalLength}
          bokehScale={dof.bokehScale}
          height={480}
        />
      ) : (
        <></>
      )}

      {autoFocus.apply ? (
        <Autofocus
          bokehScale={autoFocus.bokehScale}
          focusRange={autoFocus.focusRange}
          smoothTime={autoFocus.smoothTime}
        />
      ) : (
        <></>
      )}

      {ao.apply ? (
        <N8AO
          aoRadius={ao.radius}
          aoSamples={ao.samples}
          color={ao.color}
          denoiseRadius={ao.denoiseRadius}
          denoiseSamples={ao.denoiseSamples}
          distanceFalloff={ao.distanceFalloff}
          intensity={ao.intensity}
        />
      ) : (
        <></>
      )}

      {aa.apply ? <SMAA /> : <></>}

      {vignette.apply ? (
        <Vignette
          offset={vignette.offset}
          darkness={vignette.darkness}
          eskil={vignette.eskil}
          blendFunction={blends[vignette.blend]}
        />
      ) : (
        <></>
      )}

      {toneMapping.apply ? (
        <ToneMapping
          mode={toneMappings[toneMapping.mode]}
          blendFunction={blends[toneMapping.blend]}
          adaptive={toneMapping.adaptive}
          middleGrey={toneMapping.middleGrey}
          maxLuminance={toneMapping.maxLuminance}
          minLuminance={toneMapping.minLuminance}
          averageLuminance={toneMapping.averageLuminance}
          adaptationRate={toneMapping.adaptationRate}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
