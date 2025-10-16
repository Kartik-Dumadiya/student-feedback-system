import express from 'express';
import axios from 'axios';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Get Student Service URL from env or default
const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3001';

// Helper function to verify student exists
const verifyStudent = async (studentId) => {
  try {
    const response = await axios.get(`${STUDENT_SERVICE_URL}/api/students/${studentId}`);
    return response.data.success;
  } catch (error) {
    console.error('Error verifying student:', error.message);
    return false;
  }
};

// @route   POST /api/feedbacks
// @desc    Create a new feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { studentId, subject, feedback, rating, category, semester, isAnonymous } = req.body;

    // Verify student exists (microservice communication)
    const studentExists = await verifyStudent(studentId);
    
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found. Please provide a valid student ID.'
      });
    }

    // Create feedback
    const newFeedback = await Feedback.create({
      studentId,
      subject,
      feedback,
      rating,
      category,
      semester,
      isAnonymous: isAnonymous || false
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks
// @desc    Get all feedbacks (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, rating, semester, status } = req.query;
    
    // Build filter object
    let filter = {};
    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);
    if (semester) filter.semester = semester;
    if (status) filter.status = status;

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks/student/:studentId
// @desc    Get all feedbacks for a specific student
// @access  Public
router.get('/student/:studentId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ 
      studentId: req.params.studentId 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    console.error('Error fetching student feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student feedbacks',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// @route   PUT /api/feedbacks/:id
// @desc    Update feedback status
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
});

// @route   DELETE /api/feedbacks/:id
// @desc    Delete feedback
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
});

// @route   GET /api/feedbacks/stats/summary
// @desc    Get feedback statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ratingDistribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFeedbacks,
        averageRating: avgRating[0]?.avgRating?.toFixed(2) || 0,
        categoryStats,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

export default router;