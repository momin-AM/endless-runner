import Game from './core/Game';
import { initAuth } from "./authState.js";

window.onload = async () => {
  await initAuth(); // 🔥 wait for auth
  new Game();
};