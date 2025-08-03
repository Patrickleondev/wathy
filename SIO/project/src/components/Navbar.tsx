import React from 'react';
import { Bot, Bell, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate('/dashboard/settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full h-20 bg-gray-50 dark:bg-gray-900 shadow-2xl flex items-center justify-between px-10 border-b border-gray-100 dark:border-gray-800 z-40 transition-colors backdrop-blur-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-700 dark:bg-blue-700/80 shadow-lg">
          <Bot className="h-7 w-7 text-white" />
        </div>
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide drop-shadow-lg">SAO</span>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5 text-blue-900 dark:text-blue-200" />
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <ThemeToggle />
        {isAuthenticated && (
          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
              <User className="h-5 w-5 text-blue-900 dark:text-blue-200" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{user?.name || 'Admin'}</span>
            </div>
            <button
              onClick={handleSettings}
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
              title="Paramètres"
            >
              <SettingsIcon className="h-5 w-5 text-blue-900 dark:text-blue-200" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;