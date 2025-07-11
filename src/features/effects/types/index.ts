export type BloomProps = {
  apply: boolean;
  intensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  blend: string;
};

export type AOProps = {
  apply: boolean;
  intensity: number;
  color: string;
  radius: number;
  distanceFalloff: number;
  samples: number;
  denoiseSamples: number;
  denoiseRadius: number;
};

export type AAProps = {
  apply: boolean;
};

export type AutoFocusProps = {
  apply: boolean;
  smoothTime: number;
  focusRange: number;
  bokehScale: number;
};

export type DOFProps = {
  apply: boolean;
  bokehScale: number;
  focusDistance: number;
  focalLength: number;
};

export type ToneMappingProps = {
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

export type VignetteProps = {
  apply: boolean;
  blend: string;
  eskil: boolean;
  offset: number;
  darkness: number;
};

export type HueSaturationProps = {
  apply: boolean;
  blend: string;
  saturation: number;
  hue: number;
};

export type EffectsProps = {
  bloom: BloomProps;
  ao: AOProps;
  aa: AAProps;
  autoFocus: AutoFocusProps;
  dof: DOFProps;
  toneMapping: ToneMappingProps;
  vignette: VignetteProps;
  hueSaturation: HueSaturationProps;
};
