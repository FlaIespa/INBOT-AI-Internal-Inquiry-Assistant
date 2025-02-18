import React, { useState, useEffect } from 'react';
import { PencilIcon, SaveIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
    createdAt: '',
    notes: '',    // Personal Goals / Notes
    feedback: '', // User feedback
  });
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  
  // Snackbar state for confirmation messages
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success', // or 'error'
  });

  // Helper function to show snackbar
  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ visible: true, message, type });
    setTimeout(() => {
      setSnackbar({ visible: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch the user profile including the new columns
  const fetchUserProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
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
        createdAt: profileData.created_at || '',
        notes: profileData.notes || '',
        feedback: profileData.feedback || '',
      });
      setFeedback(profileData.feedback || '');
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `${profile.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl, error: urlError } = supabase.storage
        .from('profile')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      setProfile((prev) => ({ ...prev, avatarUrl: publicUrl.publicUrl }));
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

  // Save profile changes (update name, bio, avatar, notes, and feedback)
  const saveProfileChanges = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatarUrl,
          notes: profile.notes,
          feedback: feedback, // Save the feedback field from the form below
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating user:', error);
        alert('Failed to save changes: ' + error.message);
        return;
      }
      setEditing(false);
      showSnackbar('Profile changes saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving profile changes:', err.message);
      alert('Error saving changes: ' + err.message);
    }
  };

  // Feedback submission handler that updates the profile's feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ feedback })
        .eq('id', profile.id);
      if (error) {
        console.error('Error saving feedback:', error);
        showSnackbar('Failed to save feedback: ' + error.message, 'error');
        return;
      }
      showSnackbar('Feedback submitted successfully!', 'success');
    } catch (error) {
      console.error('Error saving feedback:', error.message);
      showSnackbar('Error saving feedback: ' + error.message, 'error');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Updated Loader using the same spinner as in the Analytics Dashboard
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10 space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            My <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
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

            {/* Basic Info */}
            <div className="flex-1 w-full">
              <div className="mb-4">
                {editing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {profile.name}
                  </h2>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Email:</span> {profile.email}
                </p>
                {profile.createdAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Member Since:</span>{' '}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              About Me
            </h3>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full mt-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
                placeholder="Tell us a bit about yourself..."
                rows="4"
              />
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {profile.bio && profile.bio !== 'EMPTY'
                  ? profile.bio
                  : 'No bio available. Update your bio to let people know more about you.'}
              </p>
            )}
          </div>

          {/* Personal Goals / Notes Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personal Goals / Notes
            </h3>
            {editing ? (
              <textarea
                value={profile.notes}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full mt-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
                placeholder="Jot down your personal goals or reminders..."
                rows="3"
              />
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {profile.notes
                  ? profile.notes
                  : 'No personal notes. Add some goals or reminders for yourself!'}
              </p>
            )}
          </div>
        </div>

        {/* Feedback & Support Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Feedback & Support
          </h3>
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white"
              placeholder="Enter your feedback or support request..."
              rows="3"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700"
            >
              Send Feedback
            </button>
          </form>
        </div>

        {/* Action Buttons */}
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

      {/* Snackbar for confirming actions */}
      {snackbar.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-md text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </motion.div>
      )}
    </div>
  );
}

export default UserProfilePage;
