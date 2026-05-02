import * as THREE from 'three';

export default class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();

    // Background color
    this.scene.background = new THREE.Color(0x87ceeb); // sky blue

// Add fog (depth feeling)
this.scene.fog = new THREE.Fog(0x87ceeb, 10, 100);

    // Light
    // Sun light
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 10, 5);
light.castShadow = true;
this.scene.add(light);

// Soft ambient light
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
this.scene.add(ambient);
  }
}