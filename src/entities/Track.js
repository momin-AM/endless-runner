import * as THREE from 'three';

export default class Track {
  constructor(scene) {
    // 🛣️ Ground
    const geometry = new THREE.PlaneGeometry(10, 200);
    const material = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.z = -50;

    scene.add(this.mesh);

    // 🚦 Lane lines
    this.lines = [];

    for (let i = -2; i <= 2; i += 2) {
      const lineGeo = new THREE.BoxGeometry(0.1, 0.01, 200);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(i, 0.01, -50);

      scene.add(line);
      this.lines.push(line);
    }
  }

  update(speed) {
    this.mesh.position.z += speed;

    this.lines.forEach(line => {
      line.position.z += speed;
    });

    // Reset ground
    if (this.mesh.position.z > 0) {
      this.mesh.position.z = -100;
    }

    // Reset lane lines
    this.lines.forEach(line => {
      if (line.position.z > 0) {
        line.position.z = -100;
      }
    });
  }
}