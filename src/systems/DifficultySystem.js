export default class DifficultySystem {
  constructor() {
    this.time = 0;

    this.baseSpeed = 0.2;
    this.maxSpeed = 0.6;

    this.baseSpawnRate = 0.02;
    this.maxSpawnRate = 0.08;
  }

  update() {
    this.time += 1;
  }

  getSpeed() {
    const t = this.time / 1000; // slow scaling
    return Math.min(this.baseSpeed + t * 0.1, this.maxSpeed);
  }

  getSpawnRate() {
    const t = this.time / 1000;
    return Math.min(this.baseSpawnRate + t * 0.01, this.maxSpawnRate);
  }
}