import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  passToClient: ["user"],
  meta: {
    location_label: {
      env: { server: true, client: true },
    },
  },
  prerender: false,
  extends: [vikeReact],
} satisfies Config;

declare global {
  namespace Vike {
    interface Config {
      location_label?: string;
    }
  }
}
