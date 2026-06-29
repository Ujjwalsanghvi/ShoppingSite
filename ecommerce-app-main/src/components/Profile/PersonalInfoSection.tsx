import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectProfileData } from '../../store/slices/profileSlice';

export const PersonalInfoSection: React.FC = () => {
  const profileData = useAppSelector(selectProfileData);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl mb-5 overflow-hidden shadow-sm">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer bg-white transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-2xl">👤</span>
        <h2 className="flex-1 text-lg font-semibold text-gray-800 m-0">Personal Information</h2>
        <span className="text-base text-gray-400">{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <p className="text-base text-gray-800 py-1.5">{profileData.email}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
              <p className="text-base text-gray-800 py-1.5">{profileData.dateOfBirth || 'Not provided'}</p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
              <p className="text-base text-gray-800 py-1.5">{profileData.bio || 'No bio provided'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Member Since</label>
              <p className="text-base text-gray-800 py-1.5">{new Date(profileData.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};