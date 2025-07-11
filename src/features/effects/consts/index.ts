import { BlendFunction, ToneMappingMode } from 'postprocessing';

export const toneMappings = Object.fromEntries(
  Object.entries(ToneMappingMode).map(([key, value]) => [key, Number(value)]),
);

export const blends = Object.fromEntries(
  Object.entries(BlendFunction).map(([key, value]) => [key, Number(value)]),
);
