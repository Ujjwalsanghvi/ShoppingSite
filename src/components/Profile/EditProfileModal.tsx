import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  selectEditData, 
  selectIsEditModalOpen,
  closeEditModal,
  handleInputChange,
  handleSaveChanges
} from '../../store/slices/profileSlice';

export const EditProfileModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isEditModalOpen = useAppSelector(selectIsEditModalOpen);
  const editData = useAppSelector(selectEditData);

  const handleClose = () => {
    dispatch(closeEditModal());
  };

  const handleChange = (field: string, value: string) => {
    dispatch(handleInputChange({ field: field as any, value }));
  };

  const handleSave = () => {
    dispatch(handleSaveChanges());
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-xl w-[90%] max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 m-0">Edit Personal Information</h2>
          <button
            onClick={handleClose}
            className="bg-none border-none text-xl cursor-pointer text-gray-400 w-8 h-8 flex items-center justify-center rounded hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Full Name</label>
            <input
              type="text"
              value={editData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Email Address</label>
            <input
              type="email"
              value={editData.email}
              disabled
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-gray-100"
            />
            <small className="text-xs text-gray-400 mt-1 block">Email cannot be changed</small>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={editData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Gender</label>
            <select
              value={editData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5">Bio</label>
            <textarea
              value={editData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              placeholder="Tell us about yourself"
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm font-inherit resize-vertical"
            />
          </div>
        </div>
        <div className="flex gap-2.5 p-5 border-t border-gray-200">
          <button onClick={handleClose} className="flex-1 py-2.5 bg-gray-100 border-none rounded-md cursor-pointer text-sm hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-400 text-white border-none rounded-md cursor-pointer text-sm hover:bg-blue-500">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};