import * as THREE from 'three';
import Renderer from './Renderer';
import SceneManager from './SceneManager';
import Player from '../entities/Player.js';
import InputHandler from './InputHandler.js';
import Track from '../entities/Track.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import DifficultySystem from '../systems/DifficultySystem.js';
import Environment from '../entities/Environment.js';
import { updateScore } from '../userService.js';
import { getUser, subscribeAuth } from "../authState.js";

let currentUser = null;

subscribeAuth((u) => {
  currentUser = u;
});


export default class Game {
  constructor() {
    this.renderer = new Renderer();
    this.sceneManager = new SceneManager();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 2, 5);

    this.scene = this.sceneManager.scene;

    this.init();
    this.environment = new Environment(this.scene);
    this.spawnSystem = new SpawnSystem(this.scene);
    this.collisionSystem = new CollisionSystem();
    this.gameOver = false;
    this.scoreSystem = new ScoreSystem();
    this.scoreEl = document.getElementById('score');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.finalScoreEl = document.getElementById('finalScore');
    this.restartBtn = document.getElementById('restartBtn');

    this.restartBtn.addEventListener('click', () => {
      location.reload();
    });
    this.cameraOffset = new THREE.Vector3(0, 1, 2);
    this.difficulty = new DifficultySystem();
    console.log(this.scoreEl, this.gameOverScreen, this.finalScoreEl);
    this.coinEl = document.getElementById('coins');
    this.currentUser = null;

    subscribeAuth((u) => {
      this.currentUser = u;
    });
    this.homeBtn = document.getElementById('homeBtn');

    this.homeBtn.addEventListener('click', () => {
      window.location.href = "/";
    });
    this.animate();
  }

  init() {
    this.player = new Player(this.scene);
    this.input = new InputHandler(this.player);
    this.track = new Track(this.scene);
    this.speed = 0.2;
  }

  animate() {
    this.environment.update(this.speed);
    requestAnimationFrame(() => this.animate());
    if (!this.gameOver) {
      this.difficulty.update();
      this.coinEl.innerText = this.player.coins ?? 0;
      this.speed = this.difficulty.getSpeed();
      const spawnRate = this.difficulty.getSpawnRate();

      this.track.update(this.speed);
      this.player.update();
      this.spawnSystem.update(this.speed, spawnRate);

      // Camera follow (keep your existing code)
      const targetPosition = new THREE.Vector3(
        this.player.mesh.position.x,
        this.player.mesh.position.y,
        this.player.mesh.position.z
      ).add(this.cameraOffset);

      this.camera.position.lerp(targetPosition, 0.1);
      this.camera.lookAt(this.player.mesh.position);
      this.scoreSystem.update();
      this.scoreEl.innerText = this.scoreSystem.score;

      if (!this.gameOver && this.collisionSystem.check(this.player, this.spawnSystem.obstacles)) {
        this.gameOver = true;

        this.gameOverScreen.style.display = "block";
        this.finalScoreEl.innerText = "Score: " + this.scoreSystem.score;

        console.log("GAME OVER TRIGGERED");

        const user = this.currentUser;

        if (user) {
          updateScore(this.scoreSystem.score, this.player.coins || 0);
        } else {
          console.log("NO USER - SKIP SAVE");
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}