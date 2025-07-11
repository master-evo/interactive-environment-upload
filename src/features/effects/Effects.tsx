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
import { useControls } from 'leva';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

const tonemappings = Object.fromEntries(
  Object.entries(ToneMappingMode).map(([key, value]) => [key, Number(value)]),
);

const blends = Object.fromEntries(
  Object.entries(BlendFunction).map(([key, value]) => [key, Number(value)]),
);

export default function Effects() {
  const {
    apply: bloomApply,
    intensity: bloomIntensity,
    luminanceThreshold: bloomLuminanceThreshold,
    luminanceSmoothing: bloomLuminanceSmoothing,
    blend: bloomBlend,
  } = useControls(
    'bloom',
    {
      apply: { options: [true, false], value: true },
      intensity: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      luminanceThreshold: {
        value: 0,
        min: 0,
        step: 0.1,
      },
      luminanceSmoothing: {
        value: 9,
        min: 0,
        step: 0.1,
      },
      blend: {
        options: Object.keys(blends),
        value: 'SCREEN',
      },
    },
    { collapsed: true },
  );

  const {
    apply: depthApply,
    focusDistance,
    focalLength,
    bokehScale,
  } = useControls(
    'depth of field',
    {
      apply: { options: [true, false], value: true },
      focusDistance: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.001,
      },
      focalLength: {
        value: 0.02,
        min: 0,
        max: 1,
        step: 0.001,
      },
      bokehScale: {
        value: 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true },
  );

  const {
    apply: autofocusApply,
    smoothTime,
    focusRange,
    bokehScale: autofocusBokehScale,
  } = useControls(
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

  const {
    apply: aoApply,
    radius: aoRadius,
    color: aoColor,
    denoiseRadius: aoDenoiseRadius,
    denoiseSamples: aoDenoiseSamples,
    distanceFalloff,
    intensity: aoIntensity,
    samples: aoSamples,
  } = useControls(
    'ambient occlusion',
    {
      apply: { options: [true, false], value: true },
      radius: {
        value: 5,
        min: 0,
        step: 1,
      },
      distanceFalloff: {
        value: 1,
        min: 0,
        step: 0.2,
      },
      intensity: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      color: '#000',
      samples: {
        value: 16,
        min: 1,
        step: 1,
      },
      denoiseSamples: {
        value: 8,
        min: 1,
        step: 1,
      },
      denoiseRadius: {
        value: 12,
        min: 1,
        step: 1,
      },
    },
    { collapsed: true },
  );

  const { apply: aaApply } = useControls(
    'anti aliasing',
    {
      apply: { options: [true, false], value: true },
    },
    { collapsed: true },
  );

  const {
    apply: vignetteApply,
    eskil,
    blend: vignetteBlend,
    offset,
    darkness,
  } = useControls('vignette', {
    apply: { options: [true, false], value: true },
    eskil: { options: [true, false], value: true },
    blend: {
      options: Object.keys(blends),
      value: 'SRC',
    },
    offset: { value: 0.5, step: 0.1 },
    darkness: { value: 1.1, min: 0, step: 0.1 },
  });

  const {
    apply: toneApply,
    mode: tonemapMode,
    blend: tonemapblend,
    adaptive,
    adaptationRate,
    averageLuminance,
    maxLuminance,
    middleGrey,
    minLuminance,
  } = useControls(
    'tonemap',
    {
      apply: { options: [true, false], value: true },
      mode: {
        options: Object.keys(tonemappings),
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

  return (
    <EffectComposer>
      {bloomApply ? (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomLuminanceThreshold}
          luminanceSmoothing={bloomLuminanceSmoothing}
          blendFunction={blends[bloomBlend]}
          height={300}
        />
      ) : (
        <></>
      )}

      {depthApply ? (
        <DepthOfField
          focusDistance={focusDistance}
          focalLength={focalLength}
          bokehScale={bokehScale}
          height={480}
        />
      ) : (
        <></>
      )}

      {autofocusApply ? (
        <Autofocus
          bokehScale={autofocusBokehScale}
          focusRange={focusRange}
          smoothTime={smoothTime}
        />
      ) : (
        <></>
      )}

      {aoApply ? (
        <N8AO
          aoRadius={aoRadius}
          aoSamples={aoSamples}
          color={aoColor}
          denoiseRadius={aoDenoiseRadius}
          denoiseSamples={aoDenoiseSamples}
          distanceFalloff={distanceFalloff}
          intensity={aoIntensity}
        />
      ) : (
        <></>
      )}

      {aaApply ? <SMAA /> : <></>}

      {vignetteApply ? (
        <Vignette
          offset={offset}
          darkness={darkness}
          eskil={eskil}
          blendFunction={blends[vignetteBlend]}
        />
      ) : (
        <></>
      )}

      {toneApply ? (
        <ToneMapping
          mode={tonemappings[tonemapMode]}
          blendFunction={blends[tonemapblend]}
          adaptive={adaptive}
          middleGrey={middleGrey}
          maxLuminance={maxLuminance}
          minLuminance={minLuminance}
          averageLuminance={averageLuminance}
          adaptationRate={adaptationRate}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
