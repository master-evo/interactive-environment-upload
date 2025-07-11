import { blends, toneMappings } from '@/features/effects/consts';
import {
  Autofocus,
  Bloom,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  N8AO,
  SMAA,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';

export type EffectsProps = {
  bloom: {
    apply: boolean;
    intensity: number;
    luminanceThreshold: number;
    luminanceSmoothing: number;
    blend: string;
  };
  ao: {
    apply: boolean;
    intensity: number;
    color: string;
    radius: number;
    distanceFalloff: number;
    samples: number;
    denoiseSamples: number;
    denoiseRadius: number;
  };
  aa: {
    apply: boolean;
  };
  autoFocus: {
    apply: boolean;
    smoothTime: number;
    focusRange: number;
    bokehScale: number;
  };
  dof: {
    apply: boolean;
    bokehScale: number;
    focusDistance: number;
    focalLength: number;
  };
  toneMapping: {
    apply: boolean;
    blend: string;
    mode: string;
    adaptive: boolean;
    middleGrey: number;
    maxLuminance: number;
    minLuminance: number;
    averageLuminance: number;
    adaptationRate: number;
  };
  vignette: {
    apply: boolean;
    blend: string;
    eskil: boolean;
    offset: number;
    darkness: number;
  };
  hueSaturation: {
    apply: boolean;
    blend: string;
    saturation: number;
    hue: number;
  };
};

export default function Effects({
  bloom,
  ao,
  aa,
  autoFocus,
  dof,
  toneMapping,
  vignette,
  hueSaturation,
}: EffectsProps) {
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

      {hueSaturation.apply ? (
        <HueSaturation
          blendFunction={blends[hueSaturation.blend]}
          hue={hueSaturation.hue}
          saturation={hueSaturation.saturation}
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
