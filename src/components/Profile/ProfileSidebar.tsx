import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectProfileData, updateProfilePicture, handleEditClick } from '../../store/slices/profileSlice';

export const ProfileSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector(selectProfileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        dispatch(updateProfilePicture(imageUrl));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    dispatch(handleEditClick());
  };

  return (
    <div className="w-full md:w-80 bg-white flex flex-col border-b md:border-b-0 md:border-r border-gray-200 md:sticky md:top-20 md:h-[calc(100vh-80px)] overflow-y-auto">
      <div className="p-8 text-center border-b border-gray-200">
        <div className="relative inline-block mb-4">
          {profileData.profilePicture ? (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-[100px] h-[100px] rounded-full object-cover border-4 border-blue-400"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-blue-400 flex items-center justify-center border-4 border-blue-400">
              <span className="text-white text-4xl font-bold">
                {profileData.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-blue-400 border-none rounded-full w-8 h-8 text-base cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            📷
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <h3 className="text-base font-bold mb-1 text-gray-800">{profileData.fullName}</h3>
        <p className="text-xs text-gray-500 mb-4">{profileData.email}</p>
        <button
          onClick={handleEdit}
          className="bg-blue-400 text-white border-none py-2 px-4 cursor-pointer text-xs w-full transition-all duration-300 rounded-full hover:bg-blue-500 hover:-translate-y-0.5"
        >
          ✏️ Edit Personal Information
        </button>
      </div>

      <div className="p-5 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-400 mb-4 tracking-wide">BASIC DETAILS</h4>
        <div className="py-2 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 tracking-wide">NAME</span>
            <span className="text-sm text-gray-800 font-medium">{profileData.fullName}</span>
          </div>
        </div>
        <div className="py-2 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 tracking-wide">GENDER</span>
            <span className="text-sm text-gray-800 font-medium">
              {profileData.gender
                ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
                : 'Not specified'}
            </span>
          </div>
        </div>
        <div className="py-2 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 tracking-wide">MOBILE</span>
            <span className="text-sm text-gray-800 font-medium">
              {profileData.phone || 'Not provided'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};