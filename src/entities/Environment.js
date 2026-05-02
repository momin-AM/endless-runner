import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Environment {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();

    this.objects = [];
    this.loadPole();
    this.loadBuilding();
  }

  loadBuilding() {
    this.loader.load('/models/building.glb', (gltf) => {
      this.buildingModel = gltf.scene;

      for (let i = 0; i < 10; i++) {
        this.spawnBuilding(-4, -i *15); // left
        this.spawnBuilding(4, -i * 15);  // right
      }
    });
  }

  spawnBuilding(x, z) {
    const clone = this.buildingModel.clone();

    clone.scale.set(2, 3, 3);
    clone.position.set(x, 0, z);
    clone.rotation.y = Math.PI / 2; // 👈 rotate 90°
    this.scene.add(clone);
    this.objects.push(clone);
  }
  loadPole() {
  this.loader.load('/models/pole.glb', (gltf) => {
    this.poleModel = gltf.scene;

    for (let i = 0; i < 10; i++) {
  const side = Math.random() > 0.5 ? -3 : 3; // 👈 random side
  this.spawnPole(side, -i * 20);
}
  });
}

spawnPole(x, z) {
  const clone = this.poleModel.clone();

  clone.scale.set(0.01, 0.01, 0.01);
  clone.position.set(x, 0, z);
  clone.rotation.y = Math.PI; // 👈 rotate 180°
  this.scene.add(clone);
  this.objects.push(clone);
}

  update(speed) {
    this.objects.forEach(obj => {
      obj.position.z += speed;

      // recycle forward
      if (obj.position.z > 10) {
        obj.position.z -= 200;
      }
    });
  }
}