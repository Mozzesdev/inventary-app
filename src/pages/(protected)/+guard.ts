import { redirect } from "vike/abort";

export const guard = (pageContext) => {
  if (!pageContext.user) {
    throw redirect("/login");
  }
};
