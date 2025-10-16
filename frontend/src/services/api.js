import axios from 'axios';

// Base URLs from environment variables or defaults
const STUDENT_API = import.meta.env.VITE_STUDENT_API_URL || 'http://localhost:3001/api';
const FEEDBACK_API = import.meta.env.VITE_FEEDBACK_API_URL || 'http://localhost:3002/api';
const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3003/api';

// Create axios instances
const studentAPI = axios.create({
  baseURL: STUDENT_API,
  headers: { 'Content-Type': 'application/json' }
});

const feedbackAPI = axios.create({
  baseURL: FEEDBACK_API,
  headers: { 'Content-Type': 'application/json' }
});

const adminAPI = axios.create({
  baseURL: ADMIN_API,
  headers: { 'Content-Type': 'application/json' }
});

// Student Service APIs
export const studentService = {
  getAll: () => studentAPI.get('/students'),
  getById: (id) => studentAPI.get(`/students/${id}`),
  create: (data) => studentAPI.post('/students', data),
  update: (id, data) => studentAPI.put(`/students/${id}`, data),
  delete: (id) => studentAPI.delete(`/students/${id}`)
};

// Feedback Service APIs
export const feedbackService = {
  getAll: () => feedbackAPI.get('/feedbacks'),
  getById: (id) => feedbackAPI.get(`/feedbacks/${id}`),
  getByStudentId: (studentId) => feedbackAPI.get(`/feedbacks/student/${studentId}`),
  create: (data) => feedbackAPI.post('/feedbacks', data),
  update: (id, data) => feedbackAPI.put(`/feedbacks/${id}`, data),
  delete: (id) => feedbackAPI.delete(`/feedbacks/${id}`),
  getStats: () => feedbackAPI.get('/feedbacks/stats/summary')
};

// Admin Service APIs
export const adminService = {
  getDashboard: () => adminAPI.get('/admin/dashboard'),
  getSummary: () => adminAPI.get('/admin/summary'),
  getStudentsWithFeedback: () => adminAPI.get('/admin/students-with-feedback'),
  getStudentComplete: (id) => adminAPI.get(`/admin/student/${id}/complete`),
  getDepartmentReport: () => adminAPI.get('/admin/reports/department'),
  healthCheck: () => adminAPI.get('/admin/health-check')
};

export default {
  studentService,
  feedbackService,
  adminService
};