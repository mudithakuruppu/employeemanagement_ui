import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UsersIcon, FileTextIcon, HomeIcon } from 'lucide-react';
export const Header = () => {
  const location = useLocation();
  return <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">
                Fortium Employee Directory
              </h1>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <HomeIcon className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
            <Link to="/reports" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/reports' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <FileTextIcon className="h-4 w-4 mr-1" />
              Reports
            </Link>
          </nav>
        </div>
      </div>
    </header>;
};