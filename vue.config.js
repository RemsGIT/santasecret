const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    manifestOptions: {
      name: "SANTA SECRET - 2022",
      start_url: "./",
      display: "standalone",
      theme_color: "#510001",
      background_color: "#510001",
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
        },
        {
          src: "./img/icons/santa-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
      ],
    },
    theme_color: "#510001",

  },
});
