export default class DifficultySystem {
  constructor() {
    this.time = 0;

    this.baseSpeed = 0.12;
    this.maxSpeed = 0.35;

    this.baseSpawnRate = 0.015;
    this.maxSpawnRate = 0.06;
  }

  update() {
    this.time += 1;
  }

  getSpeed() {
    const t = this.time / 1600; // slow scaling
    return Math.min(this.baseSpeed + t * 0.07, this.maxSpeed);
  }

  getSpawnRate() {
    const t = this.time / 1600;
    return Math.min(this.baseSpawnRate + t * 0.01, this.maxSpawnRate);
  }
}