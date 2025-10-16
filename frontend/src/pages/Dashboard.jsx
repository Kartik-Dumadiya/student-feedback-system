import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { FaUserGraduate, FaComments, FaStar, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSummary();
      setSummary(response.data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={fetchDashboardData} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: summary?.totalStudents || 0,
      icon: FaUserGraduate,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Feedbacks',
      value: summary?.totalFeedbacks || 0,
      icon: FaComments,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: summary?.averageRating || '0.00',
      icon: FaStar,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Feedback Rate',
      value: summary?.totalStudents > 0 
        ? `${((summary?.totalFeedbacks / summary?.totalStudents) * 100).toFixed(1)}%`
        : '0%',
      icon: FaChartLine,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of student feedback system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-4 rounded-full`}>
                <stat.icon className={`text-2xl ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Statistics */}
      {summary?.statistics?.categoryStats && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Feedback by Category
          </h3>
          <div className="space-y-3">
            {summary.statistics.categoryStats.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{cat._id}</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-[#2563eb] h-2 rounded-full"
                      style={{ 
                        width: `${(cat.count / summary.totalFeedbacks) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-600 font-semibold w-12 text-right">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {summary?.statistics?.ratingDistribution && (
        <div className="card mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="flex items-end justify-around h-48">
            {[1, 2, 3, 4, 5].map((rating) => {
              const ratingData = summary.statistics.ratingDistribution.find(
                r => r._id === rating
              );
              const count = ratingData?.count || 0;
              const maxCount = Math.max(
                ...summary.statistics.ratingDistribution.map(r => r.count)
              );
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

              return (
                <div key={rating} className="flex flex-col items-center">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    {count}
                  </div>
                  <div 
                    className="w-16 bg-[#3b82f6] rounded-t"
                    style={{ height: `${height}%`, minHeight: count > 0 ? '20px' : '0' }}
                  ></div>
                  <div className="mt-2 flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">{rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;