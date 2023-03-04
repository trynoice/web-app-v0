import type { GatsbyBrowser } from "gatsby";

export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  gtag("js", new Date());
  gtag("consent", "default", { ad_storage: "denied" });
};
