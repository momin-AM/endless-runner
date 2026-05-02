export default class CollisionSystem {
  check(player, obstacles) {
    const px = player.mesh.position.x;
    const py = player.mesh.position.y;
    const pz = player.mesh.position.z;

    for (let o of obstacles) {
      const ox = o.mesh.position.x;
      const oy = o.mesh.position.y;
      const oz = o.mesh.position.z;

      const dx = Math.abs(px - ox);
      const dz = Math.abs(pz - oz);

      const sameLane = dx < 1;
      const closeZ = dz < 1.2;
      if (o.mesh.userData.type === "coin") {
  const dx = Math.abs(px - ox);
  const dz = Math.abs(pz - oz);

  if (dx < 1 && dz < 1.2) {
    o.mesh.visible = false;
    o.collected = true;
    player.coins = (player.coins || 0) + 1;
  }

  continue;
}
      if (!sameLane || !closeZ) continue;

      const type = o.mesh.userData.type;

      // 🟠 ignore cones / non gameplay
      if (type === "none") continue;

      // 📦 CRATE → can pass BOTH jump or slide
      if (type === "crate") {
        if (player.isSliding) continue;
        if (py > 1.0) continue;
        return true;
      }

      // 🟫 LOW (jump required)
      if (type === "low") {
        if (py > 1.0) continue;
        return true;
      }

      // 🟥 HIGH (slide required)
      if (type === "high") {
        if (player.isSliding) continue;
        return true;
      }
    }

    return false;
  }
}