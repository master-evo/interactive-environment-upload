import { CameraController } from '@/core/CameraController';
import { CollisionDetector } from '@/core/CollisionDetector';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const SPEED = 16;
const LOOK_SENSITIVITY = 0.002;

export default function PlayerController({
  camera,
}: {
  camera: THREE.PerspectiveCamera;
}) {
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pointerLocked = useRef(false);
  const { scene } = useThree();

  const collisionDetectorRef = useRef<CollisionDetector | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);

  const [obstaclesReady, setObstaclesReady] = useState(false);

  const mobileInput = useRef({
    move: { x: 0, z: 0 },
    look: { dyaw: 0, dpitch: 0 },
  });

  useEffect(() => {
    const obstacles: THREE.Mesh[] = [];
    setTimeout(() => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
          const mesh = child as THREE.Mesh;
          if (!mesh.geometry.boundingBox) {
            mesh.geometry.computeBoundingBox();
          }
          obstacles.push(mesh);
        }
      });

      collisionDetectorRef.current = new CollisionDetector(obstacles);
      cameraControllerRef.current = new CameraController(
        camera,
        collisionDetectorRef.current,
      );
      setObstaclesReady(true);
    }, 500);

    const onKeyDown = (e: KeyboardEvent) =>
      (keysPressed.current[e.key.toLowerCase()] = true);
    const onKeyUp = (e: KeyboardEvent) =>
      (keysPressed.current[e.key.toLowerCase()] = false);
    const onMouseMove = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      yaw.current -= e.movementX * LOOK_SENSITIVITY;
      pitch.current -= e.movementY * LOOK_SENSITIVITY;
      pitch.current = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, pitch.current),
      );
    };

    const onClick = () => {
      if (!pointerLocked.current) document.body.requestPointerLock();
    };

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === document.body;
    };

    const mobileMove = (e: CustomEvent) => {
      const { angle, force } = e.detail;
      if (angle === null || force === 0) {
        mobileInput.current.move = { x: 0, z: 0 };
      } else {
        mobileInput.current.move = {
          x: Math.cos(angle) * force,
          z: -Math.sin(angle) * force,
        };
      }
    };

    const mobileLook = (e: CustomEvent) => {
      mobileInput.current.look = e.detail;
    };

    window.addEventListener('mobile-move', mobileMove as EventListener);
    window.addEventListener('mobile-look', mobileLook as EventListener);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('mobile-move', mobileMove as EventListener);
      window.removeEventListener('mobile-look', mobileLook as EventListener);
    };
  }, [scene, camera]);

  const lastDirection = useRef(new THREE.Vector3());
  const tmpForward = useRef(new THREE.Vector3());
  const tmpRight = useRef(new THREE.Vector3());
  const tmpDirection = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!obstaclesReady || !cameraControllerRef.current) return;

    yaw.current += mobileInput.current.look.dyaw;
    pitch.current += mobileInput.current.look.dpitch;
    mobileInput.current.look.dyaw = 0;
    mobileInput.current.look.dpitch = 0;
    pitch.current = Math.max(
      -Math.PI / 2 + 0.1,
      Math.min(Math.PI / 2 - 0.1, pitch.current),
    );

    tmpForward.current
      .set(Math.sin(yaw.current), 0, Math.cos(yaw.current))
      .normalize();
    tmpRight.current
      .crossVectors(tmpForward.current, new THREE.Vector3(0, 1, 0))
      .normalize();

    tmpDirection.current.set(0, 0, 0);
    if (keysPressed.current['w']) tmpDirection.current.add(tmpForward.current);
    if (keysPressed.current['s']) tmpDirection.current.sub(tmpForward.current);
    if (keysPressed.current['a']) tmpDirection.current.sub(tmpRight.current);
    if (keysPressed.current['d']) tmpDirection.current.add(tmpRight.current);

    const { x, z } = mobileInput.current.move;
    if (x !== 0 || z !== 0) {
      tmpDirection.current.add(tmpForward.current.clone().multiplyScalar(-z));
      tmpDirection.current.add(tmpRight.current.clone().multiplyScalar(x));
    }

    if (tmpDirection.current.lengthSq() > 0) {
      tmpDirection.current.normalize();
      lastDirection.current.lerp(tmpDirection.current, 0.15);
      const moveDir = lastDirection.current
        .clone()
        .multiplyScalar(SPEED * delta);
      if (moveDir.lengthSq() > 1e-6) {
        const nextPos = camera.position.clone().add(moveDir);
        cameraControllerRef.current.moveCameraSafely(nextPos);
      }
    } else {
      if (lastDirection.current.lengthSq() > 0.001) {
        lastDirection.current.multiplyScalar(0.9);
        const moveDir = lastDirection.current
          .clone()
          .multiplyScalar(SPEED * delta);
        const nextPos = camera.position.clone().add(moveDir);
        cameraControllerRef.current.moveCameraSafely(nextPos);
      } else {
        lastDirection.current.set(0, 0, 0);
      }
    }

    camera.position.y = 6;

    const lookTarget = new THREE.Vector3(
      Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      Math.cos(yaw.current) * Math.cos(pitch.current),
    );

    camera.lookAt(camera.position.clone().add(lookTarget));
  });

  return null;
}
