import api from './api';

const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data?.message || 'An error occurred while fetching users.';
    }
  },

  approveUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/approve`);
      return response;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error.response?.data?.message || 'An error occurred while approving the user.';
    }
  },

  rejectUser: async (userId) => {
    try {
      // This will call the DELETE /api/users/{id} endpoint
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error.response?.data?.message || 'An error occurred while rejecting the user.';
    }
  },
};

export default adminService;
