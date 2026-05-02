export default class InputHandler {
  constructor(player) {
    this.player = player;

    // 🎮 KEYBOARD CONTROLS (Arrow + WASD)
    window.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          this.player.moveLeft();
          break;

        case "arrowright":
        case "d":
          this.player.moveRight();
          break;

        case "arrowup":
        case "w":
          this.player.jump();
          break;

        case "arrowdown":
        case "s":
          this.player.slide();
          break;
      }
    });

    // 📱 TOUCH CONTROLS (SWIPE)
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;

    window.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    });

    window.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      this.endX = touch.clientX;
      this.endY = touch.clientY;

      this.handleSwipe();
    });
  }

  handleSwipe() {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const threshold = 50; // 🔥 higher = better control (prevents accidental swipes)

    // ❌ Ignore tiny touches (important!)
    if (absX < threshold && absY < threshold) return;

    if (absX > absY) {
      // 👉 LEFT / RIGHT
      if (dx > 0) {
        this.player.moveRight();
      } else {
        this.player.moveLeft();
      }
    } else {
      // 👉 UP / DOWN
      if (dy < 0) {
        this.player.jump();
      } else {
        this.player.slide();
      }
    }
  }
}