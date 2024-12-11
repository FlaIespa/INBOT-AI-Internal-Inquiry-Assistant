import React, { useState, useEffect } from 'react';
import { PencilIcon, DocumentTextIcon, ChatAlt2Icon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: 'Tell us a bit about yourself!',
    avatar: 'https://via.placeholder.com/150', // Default avatar
  });
  const [stats, setStats] = useState({
    interactions: 0,
    documentsUploaded: 0,
    editsMade: 0,
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);

    // TODO: Add backend logic to upload the avatar to the server.
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    // TODO: Replace with your API logic to fetch user profile data.
    setProfile({
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Passionate developer and lifelong learner.',
      avatar: 'https://via.placeholder.com/150',
    });
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    // TODO: Replace with your API logic to fetch stats data.
    setStats({
      interactions: 25,
      documentsUploaded: 12,
      editsMade: 5,
    });
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    // TODO: Replace with your API logic to save profile changes.
    alert('Profile updated successfully!');
    setEditing(false);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-lg w-full"
      >
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl">
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden shadow-lg">
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
              {editing && (
                <div className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-md cursor-pointer hover:bg-blue-600">
                  <label>
                    <PencilIcon className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </motion.div>

          {/* User Info */}
          <div className="text-center mb-6">
            {editing ? (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                type="text"
                className="w-full p-3 mb-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
              >
                {profile.name}
              </motion.h1>
            )}
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
          </div>

          {/* Editable Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">About Me</h2>
            {editing ? (
              <textarea
                className="w-full p-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
              ></textarea>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            )}
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between space-x-4 mb-6"
          >
            {[
              {
                label: 'Chatbot Interactions',
                icon: ChatAlt2Icon,
                stat: stats.interactions,
              },
              {
                label: 'Documents Uploaded',
                icon: DocumentTextIcon,
                stat: stats.documentsUploaded,
              },
              {
                label: 'Edits Made',
                icon: PencilIcon,
                stat: stats.editsMade,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="w-1/3 bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center"
              >
                <item.icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-800 dark:text-white font-bold">{item.stat}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Edit Profile Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={editing ? saveProfileChanges : () => setEditing(true)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserProfilePage;
