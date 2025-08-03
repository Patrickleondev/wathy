import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex flex-col items-center space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-2">
          <Database className="h-14 w-14 text-blue-700 dark:text-blue-300" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">SAO</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Votre plateforme Oracle simple et moderne</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold text-center transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto border-2 border-blue-700 dark:border-blue-400 text-blue-700 dark:text-blue-200 px-8 py-3 rounded-lg text-lg font-semibold text-center hover:bg-blue-700 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;