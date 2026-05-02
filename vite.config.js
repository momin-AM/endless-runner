export default {
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: "./game.html",
        home: "./index.html"
      }
    }
  }
};