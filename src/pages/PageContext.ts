declare global {
  namespace Vike {
    interface PageContext {
      user?: {
        email: string;
        id: string;
        two_factor: any;
        app_secret: boolean;
      };
      searchAll: any;
    }
  }
}

export {};
