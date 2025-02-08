import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  DocumentTextIcon,
  ChatAlt2Icon,
  ChatIcon,
  SaveIcon,
} from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Import Supabase client

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
  });
  const [stats, setStats] = useState({
    documentsUploaded: 0,
    conversations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error('User is not authenticated.');

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setProfile({
        id: profileData.id,
        name: profileData.name || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
        avatarUrl: profileData.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user stats from Supabase, including uploaded documents and conversation count
  const fetchUserStats = async () => {
    try {
      // Query the files table for document count
      const { count: filesCount, error: filesError } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id);
      if (filesError) throw filesError;

      // Query the conversations table for conversation count
      const { count: convCount, error: convError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id);
      if (convError) throw convError;

      setStats({
        documentsUploaded: filesCount || 0,
        conversations: convCount || 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
    }
  };

  // Handle avatar upload to bucket "profile"
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Use the "profile" bucket instead of "avatars"
      const fileName = `${profile.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl, error: urlError } = supabase.storage
        .from('profile')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      // Update local state
      setProfile((prev) => ({ ...prev, avatarUrl: publicUrl.publicUrl }));
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

  const saveProfileChanges = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatarUrl,
        })
        .eq('id', profile.id);

      if (error) throw error;

      setEditing(false);
    } catch (error) {
      console.error('Error saving profile changes:', error.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profile.id) {
      fetchUserStats();
    }
  }, [profile.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-gray-800 dark:text-white"
        >
          Loading user profile...
        </motion.div>
      </div>
    );
  }

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
                  src={profile.avatarUrl || 'https://via.placeholder.com/150'}
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
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Documents Uploaded', stat: stats.documentsUploaded, icon: DocumentTextIcon },
            { label: 'Conversations', stat: stats.conversations, icon: ChatIcon },
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
