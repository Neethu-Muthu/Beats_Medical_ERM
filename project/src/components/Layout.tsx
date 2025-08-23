import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Wrench,
  LogOut, 
  User,
  Search,
  Settings
} from 'lucide-react';
import { User as UserType } from '../types';
import { Dashboard } from './Dashboard';
import { Employees } from './Employees';
import { CRM } from './CRM';
import { Service } from './Service';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '../hooks/useNotifications';

interface LayoutProps {
  currentUser: UserType;
  onLogout: () => void;
}

type ActiveTab = 'dashboard' | 'employees' | 'crm' | 'service';

export const Layout: React.FC<LayoutProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    getUnreadCount 
  } = useNotifications(currentUser);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'crm', label: 'CRM', icon: Building2 },
    { id: 'service', label: 'Service', icon: Wrench },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} addNotification={addNotification} />;
      case 'employees':
        return <Employees currentUser={currentUser} />;
      case 'crm':
        return <CRM currentUser={currentUser} addNotification={addNotification} />;
      case 'service':
        return <Service currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} addNotification={addNotification} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Watermark on top of everything */}
  {/* <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
    <img
      src="/Logo-Final-BeatsMed-Dubai.webp"
      alt="Watermark"
      className="w-[600px] opacity-20"
    />
  </div> */}
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">


        {/* Logo */}
        {/* <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">BM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Beats Medicals</h1>
              <p className="text-xs text-gray-400">ERP System</p>
            </div>
          </div>
        </div> */}

<div className="p-6 border-b border-gray-800">
  <div className="flex flex-col items-center space-y-2">
    <img
      src="/Logo-Final-BeatsMed-Dubai.webp"
      alt="Beats Medicals Logo"
      className="h-37 object-contain"
    />
    <div className="text-center">
      <h1 className="text-sm font-bold">Beats Medicals</h1>
      <p className="text-xs text-gray-400">ERP System</p>
    </div>
  </div>
</div>





        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-700 p-2 rounded-full">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{currentUser.designation}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mb-2">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">

        {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <img
      src="/Logo-Final-BeatsMed-Dubai.webp"
      alt="Watermark"
      className="w-[600px] opacity-10"
    />
  </div> */}
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
              <p className="text-gray-600 text-sm">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
              
              {/* Notifications */}
              <NotificationDropdown
                notifications={notifications}
                unreadCount={getUnreadCount()}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDeleteNotification={deleteNotification}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
 <main className="flex-1 overflow-auto relative z-10 bg-transparent">
    {renderContent()}
  </main>

      </div>
    </div>
  );
};