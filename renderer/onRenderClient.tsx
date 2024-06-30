// https://vike.dev/onRenderClient
export { onRenderClient };

import ReactDOM from "react-dom/client";
import type { OnRenderClientSync } from "vike/types";
import { getPageElement } from "./getPageElement.js";
import { getHeadSetting } from "./getHeadSettings.js";

let root: ReactDOM.Root;
const onRenderClient: OnRenderClientSync = (
  pageContext
): ReturnType<OnRenderClientSync> => {
  pageContext.config.onBeforeRenderClient?.(pageContext);

  const page = getPageElement(pageContext);

  const onUncaughtError = (_error: any, _errorInfo: any) =>
    console.log({ _error, _errorInfo });

  const container = document.getElementById("root")!;
  if (
    // Whether the page was rendered to HTML. (I.e. whether the user set the [`ssr`](https://vike.dev/ssr) setting to `false`.)
    container.innerHTML !== "" &&
    pageContext.isHydration
  ) {
    root = ReactDOM.hydrateRoot(container, page, {
      // @ts-expect-error sad
      onUncaughtError,
    });
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container, {
        // @ts-expect-error asd
        onUncaughtError,
      });
    } else {

      const title = getHeadSetting("title", pageContext) || "";
      const lang = getHeadSetting("lang", pageContext) || "en";
      const favicon = getHeadSetting("favicon", pageContext);

      if (title !== undefined) document.title = title;
      if (lang !== undefined) document.documentElement.lang = lang;
      if (favicon !== undefined) setFavicon(favicon);
    }

    root.render(page);
  }

  pageContext.page = page;
  pageContext.root = root;

  pageContext.config.onAfterRenderClient?.(pageContext);
};

function setFavicon(faviconUrl: string | null) {
  let link: HTMLLinkElement | null =
    document.querySelector("link[rel~='icon']");
  if (!faviconUrl) {
    if (link) document.head.removeChild(link);
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
}
