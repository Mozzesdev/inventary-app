export default {
  passToClient: ["user"],
  isr: { expiration: 15 },
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
