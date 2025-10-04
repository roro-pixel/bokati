// Fichier: src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart, 
  FileText, 
  Users, 
  Building,
  CreditCard,
  Calculator,
  ShoppingBag,
  ShoppingCart,
  X
} from 'lucide-react';

export interface SidebarProps {
  isOpen?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  isMobileOpen = false, 
  onMobileClose 
}) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients & Fournisseurs', to: '/clients-fournisseurs', icon: Users },
    { name: 'Produits & Tarification', to: '/produits-tarification', icon: ShoppingBag },
    { name: 'Ventes', to: '/ventes', icon: ShoppingCart },
    { name: 'Facturation', to: '/facturation', icon: Receipt },
    { name: 'Comptabilité', to: '/comptabilite', icon: Calculator },
    { name: 'Finance', to: '/finance', icon: BarChart },
    { name: 'Immobilisation', to: '/immobilisation', icon: Building },
    { name: 'Provisions & régulation', to: '/provision-regulation', icon: FileText }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'w-64' : 'w-20'}
          bg-red-800 text-white
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header de la sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-red-700">
            {isOpen ? (
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-red-300" />
                <span className="ml-2 text-xl font-bold text-white">
                  BOKATI
                </span>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <CreditCard className="h-8 w-8 text-red-300" />
              </div>
            )}
            <button
              onClick={onMobileClose}
              className="md:hidden p-1 rounded-md hover:bg-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || 
                              location.pathname.startsWith(item.to + '/');
              
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={onMobileClose}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-red-900 text-white'
                      : 'text-red-100 hover:bg-red-700'
                    }
                    ${isOpen ? 'justify-start' : 'justify-center'}
                  `}
                >
                  <Icon
                    className={`
                      flex-shrink-0 h-6 w-6 transition-colors
                      ${isActive ? 'text-red-300' : 'text-red-300 group-hover:text-red-100'}
                      ${isOpen ? 'mr-3' : ''}
                    `}
                    aria-hidden="true"
                  />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer de la sidebar */}
          <div className={`p-4 border-t border-red-700 ${isOpen ? 'text-left' : 'text-center'}`}>
            <div className="text-xs text-red-300">
              {isOpen && 'SYSCOHADA Révisé'}
              <div className="mt-1">v1.0.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;