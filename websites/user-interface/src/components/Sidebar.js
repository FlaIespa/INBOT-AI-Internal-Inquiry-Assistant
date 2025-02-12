import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChatAlt2Icon,
  CloudUploadIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  BellIcon,
  ChartPieIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
  ClockIcon,
} from '@heroicons/react/solid';
import { supabase } from '../supabaseClient'; // Import Supabase client

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatarUrl: '',
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during logout:', error.message);
        return;
      }
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (error) {
      console.error('Unexpected error during logout:', error.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return;
      const { data: profile, error } = await supabase
        .from('users') // Replace with your table name
        .select('name, email, avatar')
        .eq('id', currentUser.id)
        .single();
      if (error) throw error;
      setUser({
        name: profile.name || 'Unknown User',
        email: profile.email || 'unknown@example.com',
        avatarUrl: profile.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen 
        bg-gradient-to-b from-blue-600 via-purple-600 to-purple-800 
        dark:from-gray-800 dark:via-gray-900 dark:to-black 
        text-white flex flex-col 
        ${isCollapsed ? 'w-16' : 'w-56'} 
        transition-all duration-300 z-10 shadow-md`}
    >
      <div className="flex flex-col flex-1">
        {/* Top Section with Logo and Toggle */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
              <ChatAlt2Icon className="h-6 w-6 text-white" />
              <h2 className="text-lg font-bold ml-2 tracking-wide">INBOT</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <Link
          to="/user-profile"
          className="px-3 py-4 border-y border-white/10 hover:bg-blue-700 dark:hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-300 sidebar-profile"
        >
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-lg font-medium">{user.name.charAt(0)}</span>
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-white/70 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 p-3">
          <ul className="space-y-4">
            {[
              { to: '/home', Icon: HomeIcon, label: 'Home', tour: 'home' },
              { to: '/file-management', Icon: CloudUploadIcon, label: 'File Management', tour: 'fileManagement' },
              { to: '/chatbot', Icon: ChatAlt2Icon, label: 'Chatbot', tour: 'chatbot' },
              { to: '/history', Icon: ClockIcon, label: 'History', tour: 'history' },
              { to: '/user-profile', Icon: UserIcon, label: 'User Profile', tour: 'userProfile' },
              { to: '/admin-dashboard', Icon: ChartPieIcon, label: 'Analytics', tour: 'analytics' },
              { to: '/settings', Icon: CogIcon, label: 'Settings', tour: 'settings' },
              { to: '/faq', Icon: QuestionMarkCircleIcon, label: 'Help/FAQ', tour: 'faq' },
              { to: '/notifications', Icon: BellIcon, label: 'Notifications', tour: 'notifications' },
            ].map(({ to, Icon, label, tour }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-300 sidebar-link-${tour}`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-md bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 transition-colors duration-200 sidebar-logout"
          >
            <LogoutIcon className="h-4 w-4" />
            {!isCollapsed && <span className="text-xs">Logout</span>}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-3 text-center text-xs bg-opacity-20">
        <p className="text-gray-300 dark:text-gray-400">&copy; 2025 INBOT</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
