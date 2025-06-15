import * as THREE from 'three';
import { CollisionDetector } from './CollisionDetector';

export class CameraController {
  camera: THREE.Camera;
  collisionDetector: CollisionDetector;
  lastSafePosition: THREE.Vector3;

  constructor(camera: THREE.Camera, collisionDetector: CollisionDetector) {
    this.camera = camera;
    this.collisionDetector = collisionDetector;
    this.lastSafePosition = camera.position.clone();
  }

  checkMultipleDirections(nextPosition: THREE.Vector3): THREE.Vector3 | null {
    if (!this.collisionDetector.willCollide(this.camera.position, nextPosition))
      return nextPosition;

    const xOnly = new THREE.Vector3(
      nextPosition.x,
      this.camera.position.y,
      this.camera.position.z,
    );
    if (!this.collisionDetector.willCollide(this.camera.position, xOnly))
      return xOnly;

    const zOnly = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      nextPosition.z,
    );
    if (!this.collisionDetector.willCollide(this.camera.position, zOnly))
      return zOnly;

    return null;
  }

  moveCameraSafely(nextPosition: THREE.Vector3): void {
    const safe = this.checkMultipleDirections(nextPosition);
    if (safe) {
      this.camera.position.copy(safe);
      this.lastSafePosition.copy(safe);
    } else {
      this.camera.position.copy(this.lastSafePosition);
    }
  }
}
