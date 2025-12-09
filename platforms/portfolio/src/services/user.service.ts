export const userService = {
  getProfile: async (userId: string) => {
    // Placeholder for getting user profile
    return { id: userId, email: '', name: '' };
  },

  updateProfile: async (userId: string, data: { name?: string; email?: string }) => {
    // Placeholder for updating user profile
    return { id: userId, ...data };
  },

  deleteAccount: async (_userId: string) => {
    // Placeholder for deleting user account
    void _userId; // Used for account deletion
  },
};

