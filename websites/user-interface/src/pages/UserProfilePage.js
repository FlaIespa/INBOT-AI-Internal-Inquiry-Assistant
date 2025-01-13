import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, DocumentTextIcon, ChatAlt2Icon, 
  UserCircleIcon, SaveIcon, GlobeIcon, ShieldCheckIcon,
  LinkIcon, BellIcon, LockClosedIcon, TrashIcon,
  DocumentIcon, CloudUploadIcon
} from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: 'Tell us a bit about yourself!',
    avatar: 'https://via.placeholder.com/150',
    linkedIn: '',
    github: ''
  });
  
  const [stats, setStats] = useState({
    interactions: 0,
    documentsUploaded: 0,
    editsMade: 0,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    showActivity: true
  });

  const [recentActivities] = useState([
    {
      icon: DocumentIcon,
      description: "Uploaded 'Project Proposal.pdf'",
      time: "2 hours ago"
    },
    {
      icon: ChatAlt2Icon,
      description: "Asked a question about document processing",
      time: "5 hours ago"
    },
    {
      icon: PencilIcon,
      description: "Updated profile information",
      time: "1 day ago"
    }
  ]);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
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

  const fetchUserProfile = async () => {
    setProfile({
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Passionate developer and lifelong learner.',
      avatar: 'https://via.placeholder.com/150',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    });
  };

  const fetchUserStats = async () => {
    setStats({
      interactions: 25,
      documentsUploaded: 12,
      editsMade: 5,
    });
  };

  const saveProfileChanges = async () => {
    // TODO: Add API call to save changes
    setEditing(false);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  // Toggle component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="ml-56 flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 mt-16">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                User Profile
              </h1>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 p-1.5 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600">
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
                    className="w-full p-2 mb-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-800 dark:text-white"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                    {profile.name}
                  </h2>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Me
              </h3>
              {editing ? (
                <textarea
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-800 dark:text-white text-sm"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows="3"
                ></textarea>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile.bio}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Chatbot Interactions', icon: ChatAlt2Icon, stat: stats.interactions },
                { label: 'Documents Uploaded', icon: DocumentTextIcon, stat: stats.documentsUploaded },
                { label: 'Edits Made', icon: PencilIcon, stat: stats.editsMade },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <item.icon className="h-5 w-5 text-blue-500 mb-2" />
                  <div className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {item.stat}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</h3>
            <span className="text-sm text-blue-500">80%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Complete your profile to unlock all features</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                <activity.icon className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Document Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Most Used Document</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">Project Proposal.pdf</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Total Storage Used</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">1.2 GB</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Notifications</span>
              <Toggle 
                enabled={preferences.emailNotifications} 
                onChange={() => handlePreferenceChange('emailNotifications')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Authentication</span>
              <Toggle 
                enabled={preferences.twoFactorAuth} 
                onChange={() => handlePreferenceChange('twoFactorAuth')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show Activity Status</span>
              <Toggle 
                enabled={preferences.showActivity} 
                onChange={() => handlePreferenceChange('showActivity')} 
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Security</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Password</span>
                <button className="text-sm text-blue-500 hover:text-blue-600">Change</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-xs text-gray-500">Strong</span>
              </div>
            </div>
            <button className="text-sm text-red-500 hover:text-red-600">
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
          <button
            onClick={editing ? saveProfileChanges : () => setEditing(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
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
      </div>
    </div>
  );
}

export default UserProfilePage;