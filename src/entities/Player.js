import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Player {
  constructor(scene) {
    this.mixer = null;
    this.actions = {};
    this.activeAction = null;
    this.animMap = {};

    // Lanes
    this.lanes = [-2, 0, 2];
    this.currentLane = 1;

    // Physics
    this.velocityY = 0;
    this.gravity = -0.023;
    this.jumpForce = 0.32;
    this.isGrounded = true;

    // Slide
    this.isSliding = false;
    this.slideTimer = 0;

    this.mesh = new THREE.Group();

    const loader = new GLTFLoader();

    loader.load('/models/player.glb', (gltf) => {
      this.model = gltf.scene;

      // ✅ Fix direction
      this.model.rotation.y = Math.PI;

      this.model.scale.set(0.3, 0.3, 0.3);
      this.mesh.add(this.model);

      // 🎬 Animation setup
      this.mixer = new THREE.AnimationMixer(this.model);

      gltf.animations.forEach((clip) => {
        this.actions[clip.name] = this.mixer.clipAction(clip);
      });

      console.log("Animations:", Object.keys(this.actions));

      // ✅ Build animation map AFTER actions exist
      this.animMap = {
        run: this.findAnim("run"),
        left: this.findAnim("left"),
        right: this.findAnim("right"),
        jump: this.findAnim("jump"),
        slide: this.findAnim("slide"),
      };

      // ▶️ Default animation
      this.playAnimation(this.animMap.run || Object.keys(this.actions)[0]);
    });

    this.mesh.position.set(0, 0.5, 0);
    scene.add(this.mesh);
  }

  // 🔍 Helper to find animation
  findAnim(keyword) {
    return Object.keys(this.actions).find(name =>
      name.toLowerCase().includes(keyword)
    );
  }

  playAnimation(name) {
    if (!name || !this.actions[name]) return;

    if (this.activeAction === this.actions[name]) return;

    if (this.activeAction) {
      this.activeAction.fadeOut(0.2);
    }

    this.activeAction = this.actions[name];
    this.activeAction.reset().fadeIn(0.2).play();
  }

  moveLeft() {
    if (this.currentLane > 0) {
      this.currentLane--;

      if (this.animMap.left) {
        this.playAnimation(this.animMap.left);
        setTimeout(() => this.playAnimation(this.animMap.run), 300);
      }
    }
  }

  moveRight() {
    if (this.currentLane < this.lanes.length - 1) {
      this.currentLane++;

      if (this.animMap.right) {
        this.playAnimation(this.animMap.right);
        setTimeout(() => this.playAnimation(this.animMap.run), 300);
      }
    }
  }

 jump() {
  if (!this.isGrounded) return;

  this.velocityY = this.jumpForce;
  this.isGrounded = false;
}
  slide() {
    if (!this.isSliding && this.isGrounded) {
      this.isSliding = true;
      this.slideTimer = 30;

      this.mesh.scale.y = 0.3;

      if (this.animMap.slide) {
        this.playAnimation(this.animMap.slide);
      }
    }
  }

  update() {
    // 🎬 Animation update
    if (this.mixer) this.mixer.update(0.016);

    // Lane movement
    const targetX = this.lanes[this.currentLane];
    this.mesh.position.x += (targetX - this.mesh.position.x) * 0.2;

    // Tilt
    this.mesh.rotation.z =
      (this.lanes[this.currentLane] - this.mesh.position.x) * 0.2;

    // Gravity
    this.velocityY += this.gravity;
    this.mesh.position.y += this.velocityY;

    // Landing
    if (this.mesh.position.y <= 0.5) {
      this.mesh.position.y = 0.5;
      this.velocityY = 0;

      if (!this.isGrounded) {
        this.isGrounded = true;
        if (this.animMap.run) this.playAnimation(this.animMap.run);
      }
    }

    // Slide handling
    if (this.isSliding) {
      this.slideTimer--;

      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.mesh.scale.y = 1;

        if (this.animMap.run) this.playAnimation(this.animMap.run);
      }
    }
  }
}