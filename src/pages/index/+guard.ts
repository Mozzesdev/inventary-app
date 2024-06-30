export { guard };

import { redirect } from "vike/abort";
import type { GuardAsync } from "vike/types";

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const { user } = pageContext;
  if (user) {
    throw redirect("/dashboard");
  } else {
    throw redirect("/login");
  }
};
