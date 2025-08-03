import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
      onClick={toggleTheme}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {dark ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6 text-blue-900 dark:text-blue-200" />
      )}
    </button>
  );
};

export default ThemeToggle; 