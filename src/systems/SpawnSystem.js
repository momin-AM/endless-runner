import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class SpawnSystem {
  constructor(scene) {
    this.scene = scene;
    this.coinTimer = 0;
    this.coinModels = [];
    this.loader = new GLTFLoader();
    this.obstacleModels = [];

    this.obstacles = [];
    this.lanes = [-2, 0, 2];

    this.loadModels();
  }

  loadModels() {
    this.loader.load('/models/coin.glb', (gltf) => {
  gltf.scene.userData.type = "coin";
  this.coinModels.push(gltf.scene);
});
  this.loader.load('/models/barrier.glb', (gltf) => {
    gltf.scene.userData.type = "barrier";
    this.obstacleModels.push(gltf.scene);
  });

  this.loader.load('/models/cone.glb', (gltf) => {
  // ❌ do NOT use cones for gameplay anymore
  // gltf.scene.userData.type = "cone";

  // optional: still load but ignore in spawn
  gltf.scene.userData.type = "ignore";
  this.obstacleModels.push(gltf.scene);
});

  this.loader.load('/models/crate.glb', (gltf) => {
    gltf.scene.userData.type = "crate";
    this.obstacleModels.push(gltf.scene);
  });
}
spawnCoin() {
  if (this.coinModels.length === 0) return;

  const lane = this.lanes[Math.floor(Math.random() * this.lanes.length)];

  const coinTemplate =
    this.coinModels[Math.floor(Math.random() * this.coinModels.length)];

  if (!coinTemplate) return;

  const coin = coinTemplate.clone();
  
  coin.position.set(
    lane,
    0.3,
    -100 - Math.random() * 30
  );
  coin.scale.set(1.2, 1.2, 1.2);
  coin.rotation.y = Math.PI / 2;
  coin.userData.type = "coin";

  this.scene.add(coin);

  this.obstacles.push({
    mesh: coin,
    isCoin: true
  });
}

  spawn() {
  if (this.obstacleModels.length === 0) return;

  const lane = this.lanes[Math.floor(Math.random() * 3)];

  const validModels = this.obstacleModels.filter(
  m => m.userData.type !== "ignore"
);

const baseModel =
  validModels[Math.floor(Math.random() * validModels.length)];

  const obstacle = baseModel.clone();

  const modelType = baseModel.userData.type;

  // default values FIRST
  obstacle.rotation.y = Math.PI;
  obstacle.userData.type = "none";

  // 🟠 CONE → NO COLLISION
  if (modelType === "cone") {
    obstacle.scale.set(0.2, 0.2, 0.2);
    obstacle.position.set(lane, 0, -100);
    obstacle.userData.type = "none";
  }

  // 📦 CRATE → LOW (jump)
else if (modelType === "crate") {
  obstacle.scale.set(1.0, 1.0, 1.0);
  obstacle.position.set(lane, 0, -100);

  // 🎯 neutral obstacle
  obstacle.userData.type = "crate";
}
  // 🚧 BARRIER → mixed
  else {
    if (Math.random() < 0.5) {
      obstacle.scale.set(0.25, 0.25, 0.25);
      obstacle.position.set(lane, 0, -100);
      obstacle.userData.type = "low";
    } else {
      obstacle.scale.set(0.25, 0.25, 0.25);
      obstacle.position.set(lane, 1.0, -100);
      obstacle.userData.type = "high";
    }
  }
  
  this.scene.add(obstacle);

  this.obstacles.push({
    mesh: obstacle
  });
}
  update(speed, spawnRate) {
    this.coinTimer++;

const maxCoins = 15;

const coinCount = this.obstacles.filter(o => o.isCoin).length;

if (coinCount < maxCoins && this.coinTimer > 30) {
  this.spawnCoin();
  this.coinTimer = 0;
}

    // Move obstacles
    this.obstacles.forEach(o => {
      o.mesh.position.z += speed;
    });
    this.obstacles.forEach(o => {
  o.mesh.position.z += speed;

  // 🪙 coin spin animation
  if (o.isCoin) {
    o.mesh.rotation.y += 0.03;
    
  }
});
    // Remove passed obstacles
    this.obstacles = this.obstacles.filter(o => {
      if (o.collected) {
    this.scene.remove(o.mesh);
    return false;
  }
      if (o.mesh.position.z > 5) {
        this.scene.remove(o.mesh);
        return false;
      }
      return true;
    });

    // Spawn new
    if (Math.random() < spawnRate) {
      this.spawn();
    }
  }
}