import { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUserGraduate } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    year: 1,
    rollNumber: ''
  });

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT'];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAll();
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentService.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        department: 'Computer Science',
        year: 1,
        rollNumber: ''
      });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
      }
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600 mt-2">Manage student records</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="label">Department</label>
              <select
                className="input-field"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select
                className="input-field"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              >
                {[1, 2, 3, 4].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Roll Number</label>
              <input
                type="text"
                className="input-field"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                required
              />
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="btn-primary flex-1">
                Create Student
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

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student._id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-[#dbeafe] p-3 rounded-full mr-3">
                  <FaUserGraduate className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.rollNumber}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {student.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Department:</span> {student.department}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Year:</span> {student.year}
              </p>
            </div>
            <div className="flex space-x-2 mt-4 pt-4 border-t">
              <button className="btn-secondary flex-1 text-sm flex items-center justify-center">
                <FaEdit className="mr-1" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(student._id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center justify-center"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No students found. Add your first student!</p>
        </div>
      )}
    </div>
  );
};

export default Students;