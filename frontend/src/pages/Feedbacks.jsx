import { useState, useEffect } from 'react';
import { feedbackService, studentService } from '../services/api';
import { FaPlus, FaStar, FaComments, FaFilter } from 'react-icons/fa';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ category: '', rating: '' });
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    feedback: '',
    rating: 5,
    category: 'Teaching',
    semester: '1',
    isAnonymous: false
  });

  const categories = ['Teaching', 'Infrastructure', 'Facilities', 'Administration', 'Other'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedbackRes, studentRes] = await Promise.all([
        feedbackService.getAll(),
        studentService.getAll()
      ]);
      setFeedbacks(feedbackRes.data.data);
      setStudents(studentRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.create(formData);
      setShowForm(false);
      setFormData({
        studentId: '',
        subject: '',
        feedback: '',
        rating: 5,
        category: 'Teaching',
        semester: '1',
        isAnonymous: false
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting feedback');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackService.delete(id);
        fetchData();
      } catch (error) {
        alert('Error deleting feedback');
      }
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s._id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filter.category && fb.category !== filter.category) return false;
    if (filter.rating && fb.rating !== parseInt(filter.rating)) return false;
    return true;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Feedbacks</h2>
          <p className="text-gray-600 mt-2">Manage student feedbacks</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Feedback
        </button>
      </div>

      {/* Add Feedback Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Submit New Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Select Student</label>
                <select
                  className="input-field"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.rollNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Database Management System"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label className="label">Feedback</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Write your detailed feedback here..."
                value={formData.feedback}
                onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.feedback.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Rating</label>
                <select
                  className="input-field"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Semester</label>
                <select
                  className="input-field"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                  />
                  <span className="text-sm text-gray-700">Anonymous</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <button type="submit" className="btn-primary flex-1">
                Submit Feedback
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <FaFilter className="text-gray-500 mr-2" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              className="input-field"
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Rating</label>
            <select
              className="input-field"
              value={filter.rating}
              onChange={(e) => setFilter({...filter, rating: e.target.value})}
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>{rating} Stars</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => setFilter({ category: '', rating: '' })}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((fb) => (
          <div key={fb._id} className="card hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{fb.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    fb.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    fb.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {fb.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">
                    {fb.isAnonymous ? '🎭 Anonymous' : `👤 ${getStudentName(fb.studentId)}`}
                  </span>
                  <span>📚 Semester {fb.semester}</span>
                  <span className="px-2 py-1 bg-[#dbeafe] text-primary-700 rounded">
                    {fb.category}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  {renderStars(fb.rating)}
                  <span className="ml-2 text-sm font-semibold text-gray-600">
                    ({fb.rating}/5)
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{fb.feedback}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Submitted on {new Date(fb.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 pt-4 border-t">
              <button className="btn-secondary text-sm">
                Mark as Reviewed
              </button>
              <button 
                onClick={() => handleDelete(fb._id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="text-center py-12">
          <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {feedbacks.length === 0 
              ? 'No feedbacks yet. Submit your first feedback!'
              : 'No feedbacks match the selected filters.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;