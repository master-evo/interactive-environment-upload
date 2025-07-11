import { folder, useControls } from 'leva';

export default function useSceneController() {
  const sceneValues = useControls(
    'scene',
    {
      ambientLightIntensity: {
        value: 0,
        min: 0,
        step: 0.1,
      },
      environmentIntensity: {
        value: 0.2,
        min: 0,
        step: 0.1,
      },
      lightMapIntensity: {
        value: 1,
        min: 0,
        step: 0.1,
      },
      sun: folder({
        sun: { options: [true, false], value: true },
        distance: {
          value: 450000,
          min: 100,
          step: 1000,
        },
        position: [1, 1, -1],
        mieCoefficient: {
          value: 0,
          min: 0,
          step: 0.0001,
        },
      }),
    },
    { collapsed: true },
  );

  return sceneValues;
}
