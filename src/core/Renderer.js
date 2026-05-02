import * as THREE from 'three';

export default class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('gameCanvas'),
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}