import axios from 'axios';

// Service URLs from environment or defaults
const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3001';
const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || 'http://localhost:3002';

// Axios instances with timeout and error handling
const studentServiceClient = axios.create({
  baseURL: STUDENT_SERVICE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

const feedbackServiceClient = axios.create({
  baseURL: FEEDBACK_SERVICE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// Error handler wrapper
const handleServiceError = (serviceName, error) => {
  if (error.response) {
    // Service responded with error
    console.error(`❌ ${serviceName} Error:`, error.response.data);
    return {
      success: false,
      message: `${serviceName} returned an error`,
      error: error.response.data
    };
  } else if (error.request) {
    // Service didn't respond
    console.error(`❌ ${serviceName} not responding`);
    return {
      success: false,
      message: `${serviceName} is not responding. Please ensure it's running.`,
      error: error.message
    };
  } else {
    // Other errors
    console.error(`❌ ${serviceName} Error:`, error.message);
    return {
      success: false,
      message: `Failed to communicate with ${serviceName}`,
      error: error.message
    };
  }
};

// Student Service API calls
export const studentService = {
  async getAllStudents() {
    try {
      const response = await studentServiceClient.get('/api/students');
      return response.data;
    } catch (error) {
      return handleServiceError('Student Service', error);
    }
  },

  async getStudentById(id) {
    try {
      const response = await studentServiceClient.get(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      return handleServiceError('Student Service', error);
    }
  },

  async checkHealth() {
    try {
      const response = await studentServiceClient.get('/health');
      return response.data;
    } catch (error) {
      return { success: false, message: 'Student Service is down' };
    }
  }
};

// Feedback Service API calls
export const feedbackService = {
  async getAllFeedbacks() {
    try {
      const response = await feedbackServiceClient.get('/api/feedbacks');
      return response.data;
    } catch (error) {
      return handleServiceError('Feedback Service', error);
    }
  },

  async getFeedbacksByStudentId(studentId) {
    try {
      const response = await feedbackServiceClient.get(`/api/feedbacks/student/${studentId}`);
      return response.data;
    } catch (error) {
      return handleServiceError('Feedback Service', error);
    }
  },

  async getFeedbackStats() {
    try {
      const response = await feedbackServiceClient.get('/api/feedbacks/stats/summary');
      return response.data;
    } catch (error) {
      return handleServiceError('Feedback Service', error);
    }
  },

  async checkHealth() {
    try {
      const response = await feedbackServiceClient.get('/health');
      return response.data;
    } catch (error) {
      return { success: false, message: 'Feedback Service is down' };
    }
  }
};