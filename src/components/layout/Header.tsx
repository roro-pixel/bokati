// Fichier: src/components/layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  User, 
  HelpCircle,
  LogOut,
  Building
} from 'lucide-react';
import { useAuth } from '../../hooks/authentification/useAuth';
import { useEntityManagement } from '../../hooks/administration/useEntityManagement';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, toggleMobileSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const { entities } = useEntityManagement();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    // Navigation vers la page de profil (à implémenter)
    setDropdownOpen(false);
  };

  const getEntityName = () => {
    if (!user?.entity) return "Mon entreprise";
    const entity = entities.find(e => e.code === user.entity);
    return entity ? entity.name : "Mon entreprise";
  };

  const getUserName = () => {
    if (!user) return "Utilisateur";
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` || 'U';
  };

  // Pour la démo - période actuelle
  const currentPeriod = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear();

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={toggleMobileSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <button
            type="button"
            className="hidden md:block px-4 text-gray-500 focus:outline-none"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          
          <div className="ml-4">
            <h1 className="text-xl font-medium text-gray-900">
              {getEntityName()}
            </h1>
            <p className="text-sm text-gray-500">
              Exercice {currentYear} • Période: {currentPeriod}
            </p>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleSettings}
          >
            <span className="sr-only">Settings</span>
            <Settings className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu-button"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {getUserInitials()}
                </div>
                <span className="ml-2 text-gray-700 hidden md:block">{getUserName()}</span>
                <span className="ml-1 text-gray-500 text-xs hidden md:block">({user?.role})</span>
              </button>
            </div>

            {dropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                
                <button
                  onClick={handleProfile}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  role="menuitem"
                >
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </button>
                
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  role="menuitem"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Aide
                </a>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                  role="menuitem"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;