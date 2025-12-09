export const authService = {
  login: async (email: string, _password: string) => {
    // Placeholder for actual auth logic
    void _password; // Used for authentication
    return { id: '1', email, name: 'User' };
  },

  logout: async () => {
    // Placeholder for logout logic
  },

  getCurrentUser: async () => {
    // Placeholder for getting current user
    return null;
  },

  register: async (email: string, _password: string, name: string) => {
    // Placeholder for registration logic
    void _password; // Used for registration
    return { id: '1', email, name };
  },
};

