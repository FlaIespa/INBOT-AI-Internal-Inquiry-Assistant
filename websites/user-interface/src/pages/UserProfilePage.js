import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, DocumentTextIcon, ChatAlt2Icon, 
  UserCircleIcon, SaveIcon, BellIcon
} from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });

  const [stats, setStats] = useState({
    interactions: 0,
    documentsUploaded: 0,
    editsMade: 0,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    showActivity: true,
  });

  const togglePreference = (field) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfileChanges = async () => {
    // Add API call here to save the changes
    setEditing(false);
  };

  const fetchUserProfile = async () => {
    // Fetch user profile data from API
    setProfile({
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Creative professional with a passion for design and innovation.',
      avatar: 'https://via.placeholder.com/150',
    });
  };

  const fetchUserStats = async () => {
    // Fetch user statistics from API
    setStats({
      interactions: 0,
      documentsUploaded: 0,
      editsMade: 0,
    });
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            User <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage your account details and preferences.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={profile.avatar || 'https://via.placeholder.com/150'}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                  <PencilIcon className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{profile.name}</h2>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bio</h3>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full mt-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
              />
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Chatbot Interactions', stat: stats.interactions, icon: ChatAlt2Icon },
            { label: 'Documents Uploaded', stat: stats.documentsUploaded, icon: DocumentTextIcon },
            { label: 'Edits Made', stat: stats.editsMade, icon: PencilIcon },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-md"
            >
              <item.icon className="h-6 w-6 mb-2" />
              <p className="text-2xl font-semibold">{item.stat}</p>
              <p className="text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={editing ? saveProfileChanges : () => setEditing(true)}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {editing ? (
              <>
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default UserProfilePage;
