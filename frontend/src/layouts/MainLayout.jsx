import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaComments, FaChartBar } from 'react-icons/fa';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/students', label: 'Students', icon: FaUserGraduate },
    { path: '/feedbacks', label: 'Feedbacks', icon: FaComments },
    { path: '/reports', label: 'Reports', icon: FaChartBar },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaUserGraduate className="text-primary-600 text-3xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Student Feedback System
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Kartik-Dumadiya | 2025-10-16
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors
                  ${isActive(item.path)
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Student Feedback System - Microservices Architecture | 
            Built with React + Vite + Tailwind + Node.js + Docker + Kubernetes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;