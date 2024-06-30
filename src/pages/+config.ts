export default {
  passToClient: ["user"],
  meta: {
    location_label: {
      env: { server: true, client: true },
    },
  },
};

declare global {
  namespace Vike {
    interface Config {
      location_label?: string;
    }
  }
}
