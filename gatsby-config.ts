import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  jsxRuntime: "automatic",
  graphqlTypegen: {
    generateOnBuild: true, // for running 'typecheck' script on GitHub actions.
  },
  trailingSlash: "never",
  siteMetadata: {
    title: "Noice: Natural calming noise",
    description:
      "Customisable soundscapes with Noice - Create personalised ambient atmospheres by blending various sounds and adjusting volume levels.",
    siteUrl:
      (process.env.CONTEXT === "production"
        ? process.env.URL
        : process.env.DEPLOY_PRIME_URL) || "http://localhost:8000",
  },
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
        display: "standalone",
        icon: "src/assets/icon-round.png",
        crossOrigin: "anonymous",
      },
    },
  ],
};

export default config;
