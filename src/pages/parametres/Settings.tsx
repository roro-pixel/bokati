import React, { useState } from 'react';
import { EntityManagement } from './administration/EntityManagement';
import { UserManagement } from './administration/UserManagement';
import { SystemSettings } from './administration/SystemSettings';
import { RolePermissions } from './administration/RolePermissions';

type SettingsTab = 'entities' | 'users' | 'system' | 'roles';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('entities');

  const tabs = [
    { id: 'entities' as SettingsTab, label: 'Entités', component: <EntityManagement /> },
    { id: 'users' as SettingsTab, label: 'Utilisateurs', component: <UserManagement /> },
    { id: 'system' as SettingsTab, label: 'Configuration', component: <SystemSettings /> },
    { id: 'roles' as SettingsTab, label: 'Rôles', component: <RolePermissions /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};