const TOKEN_KEY = 'golf_charity_access_token';

export const tokenStorage = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
};
