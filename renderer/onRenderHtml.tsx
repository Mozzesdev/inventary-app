// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { renderToStream } from "react-streaming/server";
import React from "react";
import { renderToString } from "react-dom/server";
import { getHeadSetting } from "./getHeadSettings";
import { getPageElement } from "./getPageElement";
import "./index.css";
import { PageContextProvider } from "../hooks/PageContextProvider";

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const title = getHeadSetting("title", pageContext);
  const favicon = getHeadSetting("favicon", pageContext);
  const lang = getHeadSetting("lang", pageContext) || "en";

  const titleTag = !title ? "" : escapeInject`<title>${title}</title>`;
  const faviconTag = !favicon
    ? ""
    : escapeInject`<link rel="icon" href="${favicon}" />`;

  const Head = pageContext.config.Head || (() => <></>);
  let head = (
    <PageContextProvider pageContext={pageContext}>
      <Head />
    </PageContextProvider>
  );
  if (pageContext.config.reactStrictMode !== false) {
    head = <React.StrictMode>{head}</React.StrictMode>;
  }

  const headHtml = dangerouslySkipEscape(renderToString(head));

  let pageView:
    | string
    | ReturnType<typeof dangerouslySkipEscape>
    | Awaited<ReturnType<typeof renderToStream>>;
  if (!pageContext.Page) {
    pageView = "";
  } else {
    const page = getPageElement(pageContext);
    const { stream, streamIsRequired } = pageContext.config;
    if (!stream && !streamIsRequired) {
      pageView = dangerouslySkipEscape(renderToString(page));
    } else {
      const disable = stream === false ? true : undefined;
      pageView = await renderToStream(page, {
        userAgent: pageContext.headers?.["user-agent"] || pageContext.userAgent,
        disable,
      });
    }
  }

  return escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${headHtml}
        ${faviconTag}
      </head>
      <body>
        <div id="root">${pageView}</div>
      </body>
    </html>`;
};
