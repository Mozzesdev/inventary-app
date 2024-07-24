import { NextFunction, Request, Response } from "express";
import { renderPage } from "vike/server";
import userModel from "../api/models/mysql/users";

const renderMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;

  if (req.user) {
    const { data } = await userModel.getById({ id: req.user.id });
    user = {
      ...req.user,
      isAdmin: data?.role?.name?.toLowerCase() === "admin",
    };
  }

  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
    user,
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
