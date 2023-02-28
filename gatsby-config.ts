import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  jsxRuntime: "automatic",
  graphqlTypegen: true,
  trailingSlash: "never",
  plugins: [
    "@chakra-ui/gatsby-plugin",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Noice",
        short_name: "Noice",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#23232d",
        display: "browser",
        icon: "src/assets/icon-round.png",
        crossOrigin: "anonymous",
      },
    },
  ],
};

export default config;
