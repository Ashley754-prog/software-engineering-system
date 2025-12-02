import api from './axiosConfig';

export const teacherService = {
  // Get current teacher profile
  getCurrentTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/api/teachers/me?id=${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher data' };
    }
  },

  // Update teacher profile
  updateTeacherProfile: async (teacherId, updates) => {
    try {
      const response = await api.patch(`/api/teachers/me?id=${teacherId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update teacher data' };
    }
  }
};

export default teacherService;
