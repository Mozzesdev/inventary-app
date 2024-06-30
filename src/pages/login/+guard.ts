export { guard };

import type { GuardAsync } from "vike/types";
import { redirect } from "vike/abort";

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const { user } = pageContext;
  if (user) {
    throw redirect("/dashboard");
  }
};
