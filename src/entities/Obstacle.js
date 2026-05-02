import * as THREE from 'three';

export default class Obstacle {
  constructor(scene, lane) {
    this.lane = lane;

    // Random type
    this.type = Math.random() < 0.5 ? 'low' : 'high';

    let height = this.type === 'high' ? 2 : 1;

    const geometry = new THREE.BoxGeometry(1, height, 1);
    const material = new THREE.MeshStandardMaterial({
  color: this.type === 'high' ? 0xff3333 : 0xffcc00,
  roughness: 0.5,
  metalness: 0.3
});

    this.mesh = new THREE.Mesh(geometry, material);

    this.mesh.position.set(lane, height / 2, -50);

    scene.add(this.mesh);
  }

  update(speed) {
    this.mesh.position.z += speed;
  }

  isOut() {
    return this.mesh.position.z > 5;
  }
}