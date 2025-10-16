import express from 'express';
import { studentService, feedbackService } from '../utils/serviceClient.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get complete dashboard data
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch data from both services in parallel
    const [studentsData, feedbacksData, statsData] = await Promise.all([
      studentService.getAllStudents(),
      feedbackService.getAllFeedbacks(),
      feedbackService.getFeedbackStats()
    ]);

    // Check if services responded successfully
    if (!studentsData.success || !feedbacksData.success) {
      return res.status(503).json({
        success: false,
        message: 'One or more services are unavailable',
        services: {
          studentService: studentsData.success,
          feedbackService: feedbacksData.success
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        students: {
          total: studentsData.count,
          list: studentsData.data
        },
        feedbacks: {
          total: feedbacksData.count,
          list: feedbacksData.data
        },
        statistics: statsData.data || {}
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// @route   GET /api/admin/summary
// @desc    Get summary statistics only
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const [studentsData, feedbacksData, statsData] = await Promise.all([
      studentService.getAllStudents(),
      feedbackService.getAllFeedbacks(),
      feedbackService.getFeedbackStats()
    ]);

    if (!studentsData.success || !feedbacksData.success) {
      return res.status(503).json({
        success: false,
        message: 'One or more services are unavailable'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents: studentsData.count,
        totalFeedbacks: feedbacksData.count,
        averageRating: statsData.data?.averageRating || 0,
        statistics: statsData.data || {}
      }
    });

  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
      error: error.message
    });
  }
});

// @route   GET /api/admin/students-with-feedback
// @desc    Get all students with their feedback count
// @access  Public
router.get('/students-with-feedback', async (req, res) => {
  try {
    const [studentsData, feedbacksData] = await Promise.all([
      studentService.getAllStudents(),
      feedbackService.getAllFeedbacks()
    ]);

    if (!studentsData.success || !feedbacksData.success) {
      return res.status(503).json({
        success: false,
        message: 'One or more services are unavailable'
      });
    }

    // Map students with their feedback counts
    const studentsWithFeedback = studentsData.data.map(student => {
      const studentFeedbacks = feedbacksData.data.filter(
        fb => fb.studentId === student._id
      );

      const avgRating = studentFeedbacks.length > 0
        ? (studentFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / studentFeedbacks.length).toFixed(2)
        : 0;

      return {
        ...student,
        feedbackCount: studentFeedbacks.length,
        averageRating: parseFloat(avgRating),
        latestFeedback: studentFeedbacks[0] || null
      };
    });

    res.status(200).json({
      success: true,
      count: studentsWithFeedback.length,
      data: studentsWithFeedback
    });

  } catch (error) {
    console.error('Error fetching students with feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students with feedback',
      error: error.message
    });
  }
});

// @route   GET /api/admin/student/:id/complete
// @desc    Get complete student profile with all feedbacks
// @access  Public
router.get('/student/:id/complete', async (req, res) => {
  try {
    const studentId = req.params.id;

    const [studentData, feedbacksData] = await Promise.all([
      studentService.getStudentById(studentId),
      feedbackService.getFeedbacksByStudentId(studentId)
    ]);

    if (!studentData.success) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!feedbacksData.success) {
      return res.status(503).json({
        success: false,
        message: 'Feedback service unavailable'
      });
    }

    const avgRating = feedbacksData.count > 0
      ? (feedbacksData.data.reduce((sum, fb) => sum + fb.rating, 0) / feedbacksData.count).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        student: studentData.data,
        feedbacks: {
          total: feedbacksData.count,
          averageRating: parseFloat(avgRating),
          list: feedbacksData.data
        }
      }
    });

  } catch (error) {
    console.error('Error fetching complete student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complete student profile',
      error: error.message
    });
  }
});

// @route   GET /api/admin/reports/department
// @desc    Get feedback analysis by department
// @access  Public
router.get('/reports/department', async (req, res) => {
  try {
    const [studentsData, feedbacksData] = await Promise.all([
      studentService.getAllStudents(),
      feedbackService.getAllFeedbacks()
    ]);

    if (!studentsData.success || !feedbacksData.success) {
      return res.status(503).json({
        success: false,
        message: 'One or more services are unavailable'
      });
    }

    // Group by department
    const departmentStats = {};

    studentsData.data.forEach(student => {
      const dept = student.department;
      const studentFeedbacks = feedbacksData.data.filter(
        fb => fb.studentId === student._id
      );

      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          department: dept,
          studentCount: 0,
          feedbackCount: 0,
          totalRating: 0
        };
      }

      departmentStats[dept].studentCount++;
      departmentStats[dept].feedbackCount += studentFeedbacks.length;
      departmentStats[dept].totalRating += studentFeedbacks.reduce(
        (sum, fb) => sum + fb.rating, 0
      );
    });

    // Calculate averages
    const report = Object.values(departmentStats).map(dept => ({
      ...dept,
      averageRating: dept.feedbackCount > 0 
        ? (dept.totalRating / dept.feedbackCount).toFixed(2) 
        : 0
    }));

    res.status(200).json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error generating department report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate department report',
      error: error.message
    });
  }
});

// @route   GET /api/admin/health-check
// @desc    Check health of all microservices
// @access  Public
router.get('/health-check', async (req, res) => {
  try {
    const [studentHealth, feedbackHealth] = await Promise.all([
      studentService.checkHealth(),
      feedbackService.checkHealth()
    ]);

    const allHealthy = studentHealth.success && feedbackHealth.success;

    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      services: {
        adminService: { status: 'healthy' },
        studentService: studentHealth,
        feedbackService: feedbackHealth
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

export default router;