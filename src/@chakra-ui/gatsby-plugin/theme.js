import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins/latin-400-italic.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500-italic.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600-italic.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700-italic.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/urbanist/latin-500-italic.css";
import "@fontsource/urbanist/latin-500.css";

// Since we're shadowing a file from the plugin, we also need to export anything
// else that the original file exported to prevent the following warning during
// Gatsby build.
//
// `Attempted import error: 'baseTheme' is not exported from './theme' (imported as 'baseTheme').`
//
// https://github.com/chakra-ui/chakra-ui/issues/7179#issuecomment-1367307044
export const baseTheme = {};

export default extendTheme({
  colors: {
    black: "#1d1d08",
    white: "#fdfdf8",
    primary: {
      50: "#eefaf6",
      100: "#bcead9",
      200: "#7dd7b6",
      300: "#27bc85",
      400: "#1eb980",
      500: "#178e62",
      600: "#137853",
      700: "#106043",
      800: "#0d5238",
      900: "#0a3b29",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "medium",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "medium",
      },
    },
  },
  fonts: {
    body: `"Poppins", sans-serif`,
    heading: `"Urbanist", sans-serif`,
    mono: `"SF Mono", "Menlo", "Monaco", "Cascadia Mono",
      "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace",
      "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", "Consolas",
      "Liberation Mono", "Courier New", monospace`,
  },
  styles: {
    global: {
      body: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
  semanticTokens: {
    sizes: {
      maxContentWidth: "5xl",
    },
  },
});
