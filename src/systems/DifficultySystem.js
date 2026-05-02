export default class DifficultySystem {
  constructor() {
    this.time = 0;

    this.baseSpeed = 0.14;
    this.maxSpeed = 0.45;

    this.baseSpawnRate = 0.015;
    this.maxSpawnRate = 0.06;
  }

  update() {
    this.time += 1;
  }

  getSpeed() {
    const t = this.time / 1500; // slow scaling
    return Math.min(this.baseSpeed + t * 0.1, this.maxSpeed);
  }

  getSpawnRate() {
    const t = this.time / 1500;
    return Math.min(this.baseSpawnRate + t * 0.01, this.maxSpawnRate);
  }
}