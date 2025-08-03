import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Database, Bell, Shield, Save, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      role: '',
      timezone: '',
      language: ''
    },
    database: {
      defaultSchema: '',
      queryTimeout: 0,
      maxRows: 0,
      autoCommit: false,
      showExecutionPlan: false
    },
    notifications: {
      emailAlerts: false,
      performanceAlerts: false,
      securityAlerts: false,
      maintenanceAlerts: false,
      alertThreshold: 0
    },
    security: {
      sessionTimeout: 0,
      requirePasswordChange: false,
      enableTwoFactor: false,
      auditLogging: false,
      ipRestriction: false
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: <User className="h-4 w-4" /> },
    { id: 'database', name: 'Base de données', icon: <Database className="h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', name: 'Sécurité', icon: <Shield className="h-4 w-4" /> }
  ];

  const handleSave = () => {
    // Logique de sauvegarde
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    // Logique de réinitialisation
    console.log('Resetting settings');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Paramètres</h1>
          <p className="text-gray-600 dark:text-gray-300">Configurez votre environnement Oracle et vos préférences</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Réinitialiser</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-4 border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations du Profil</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rôle
                  </label>
                  <select
                    value={settings.profile.role}
                    onChange={(e) => updateSetting('profile', 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="dba">DBA</option>
                    <option value="developer">Développeur</option>
                    <option value="analyst">Analyste</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuseau horaire
                  </label>
                  <select
                    value={settings.profile.timezone}
                    onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Base de données */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration Base de Données</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Schéma par défaut
                  </label>
                  <select
                    value={settings.database.defaultSchema}
                    onChange={(e) => updateSetting('database', 'defaultSchema', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="HR">HR</option>
                    <option value="SALES">SALES</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="SYSTEM">SYSTEM</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeout des requêtes (secondes)
                  </label>
                  <input
                    type="number"
                    value={settings.database.queryTimeout}
                    onChange={(e) => updateSetting('database', 'queryTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre maximum de lignes
                  </label>
                  <input
                    type="number"
                    value={settings.database.maxRows}
                    onChange={(e) => updateSetting('database', 'maxRows', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoCommit"
                    checked={settings.database.autoCommit}
                    onChange={(e) => updateSetting('database', 'autoCommit', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="autoCommit" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Auto-commit activé
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showExecutionPlan"
                    checked={settings.database.showExecutionPlan}
                    onChange={(e) => updateSetting('database', 'showExecutionPlan', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="showExecutionPlan" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Afficher le plan d'exécution
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Préférences de Notification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Alertes par email</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les notifications par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Alertes de performance</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notifications pour les problèmes de performance</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.performanceAlerts}
                    onChange={(e) => updateSetting('notifications', 'performanceAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Alertes de sécurité</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notifications pour les événements de sécurité</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.securityAlerts}
                    onChange={(e) => updateSetting('notifications', 'securityAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seuil d'alerte (%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={settings.notifications.alertThreshold}
                    onChange={(e) => updateSetting('notifications', 'alertThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>50%</span>
                    <span>{settings.notifications.alertThreshold}%</span>
                    <span>95%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paramètres de Sécurité</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeout de session (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Changement de mot de passe obligatoire</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Forcer le changement périodique du mot de passe</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.requirePasswordChange}
                    onChange={(e) => updateSetting('security', 'requirePasswordChange', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Activer la 2FA pour plus de sécurité</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.enableTwoFactor}
                    onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Journalisation d'audit</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enregistrer toutes les actions utilisateur</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.auditLogging}
                    onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Restriction par IP</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limiter l'accès à certaines adresses IP</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.ipRestriction}
                    onChange={(e) => updateSetting('security', 'ipRestriction', e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;