import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import {
  Color,
  DirectionalLight,
  Euler,
  Light,
  PointLight,
  SpotLight,
  Vector3,
} from 'three';

export interface LightData {
  name: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: [number, number, number];
  intensity: number;
  distance: number;
  spot_size: number;
  spot_blend: number;
}

export interface SceneLightsProps {
  lightsJson: string;
}

export function SceneLights({ lightsJson }: SceneLightsProps) {
  const { scene } = useThree();

  useEffect(() => {
    fetch(lightsJson)
      .then((res) => res.json())
      .then((lights: LightData[]) => {
        lights.forEach((l) => {
          const pos = l.position;
          const rot = l.rotation;
          const color = new Color(...l.color);
          let light: Light | null = null;

          if (l.type === 'POINT') {
            light = new PointLight(color, l.intensity, l.distance);
            light.position.set(...pos);
          }

          if (l.type === 'SPOT') {
            const spot = new SpotLight(
              color,
              l.intensity,
              l.distance,
              l.spot_size,
              l.spot_blend,
            );
            spot.position.set(...pos);
            const dirEuler = new Euler(...rot, 'XYZ');
            const dir = new Vector3(0, -1, 0).applyEuler(dirEuler).normalize();
            const target = new Vector3().copy(spot.position).add(dir);
            spot.target.position.copy(target);
            scene.add(spot.target);
            light = spot;
          }

          if (l.type === 'SUN') {
            const sun = new DirectionalLight(color, l.intensity);
            sun.position.set(...pos);
            const dirEuler = new Euler(...rot, 'XYZ');
            const dir = new Vector3(0, -1, 0).applyEuler(dirEuler).normalize();
            const target = new Vector3().copy(sun.position).add(dir);
            sun.target.position.copy(target);
            scene.add(sun.target);
            light = sun;
          }
          if (light) {
            scene.add(light);
            // console.log(`✅ Luz adicionada: ${l.name}`);
          }
        });
      });
  }, [lightsJson, scene]);

  return null;
}
