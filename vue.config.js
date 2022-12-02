const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    manifestOptions: {
      name: "Santa secret",
      short_name: "santa-secret",
      start_url: "./",
      display: "standalone",
      theme_color: "#510001",
      icons: [
        {
          src: "./img/icons/santa-icon-50x50.png",
          sizes: "50x50",
          type: "image/png",
        },
        {
          src: "./img/icons/santa-icon-100x100.png",
          sizes: "100x100",
          type: "image/png",
        }
      ],
    },
  },
});
