import * as THREE from 'three';
import { acceleratedRaycast, computeBoundsTree } from 'three-mesh-bvh';

THREE.Mesh.prototype.raycast = acceleratedRaycast;

export class CollisionDetector {
  raycaster: THREE.Raycaster;
  collisionDistance: number;
  obstacles: THREE.Mesh[];
  private _tmpDirection = new THREE.Vector3();

  constructor(obstacles: THREE.Mesh[] = [], collisionDistance = 1) {
    this.raycaster = new THREE.Raycaster();
    this.collisionDistance = collisionDistance;
    this.obstacles = [];

    for (const mesh of obstacles) {
      if (!('boundsTree' in mesh.geometry)) {
        mesh.geometry.computeBoundsTree = computeBoundsTree;
        mesh.geometry.computeBoundsTree();
      }
      this.obstacles.push(mesh);
    }
  }

  willCollide(from: THREE.Vector3, to: THREE.Vector3): boolean {
    this._tmpDirection.subVectors(to, from).normalize();
    console.log('_tmpDirection', this._tmpDirection);
    const distance = from.distanceTo(to);

    if (distance < 0.01) return false;

    this.raycaster.set(from, this._tmpDirection);
    this.raycaster.far = distance + this.collisionDistance;
    const intersects = this.raycaster.intersectObjects(this.obstacles, true);
    return intersects.length > 0;
  }
}
