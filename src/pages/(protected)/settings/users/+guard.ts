import { redirect } from "vike/abort";

export const guard = async (pageContext) => {
  if (!pageContext.user.isAdmin) {
    throw redirect("/settings/security");
  }
};
