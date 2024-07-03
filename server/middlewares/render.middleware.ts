import { NextFunction, Request, Response } from "express";
import { renderPage } from "vike/server";

const renderMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
    user: req.user,
  };
  const pageContext = await renderPage(pageContextInit);

  const { httpResponse } = pageContext;

  if (!httpResponse) return next();

  const { statusCode, headers, earlyHints } = httpResponse;

  if (res.writeEarlyHints)
    res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });

  headers.forEach(([name, value]) => res.setHeader(name, value));

  res.status(statusCode);

  httpResponse.pipe(res);
};

export default renderMiddleware;
