import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  selectProfileData,
  selectEditData,
  selectIsEditModalOpen,
  selectOrders,
  selectAddresses,
  selectTransactions,
  selectWalletBalance,
  selectProfileLoading,
  selectProfileError,
  openEditModal,
  closeEditModal,
  setEditData,
  handleInputChange,
  handleSaveChanges,
  handleEditClick,
  clearProfileError,
  updateProfilePicture,
  updateProfileData,
  loadProfileData,
  loadOrders,
  loadAddresses,
  loadWalletData,
} from './slices/profileSlice';
import { ProfileData } from '../types/ProfileData';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  
  const profileData = useAppSelector(selectProfileData);
  const editData = useAppSelector(selectEditData);
  const isEditModalOpen = useAppSelector(selectIsEditModalOpen);
  const orders = useAppSelector(selectOrders);
  const addresses = useAppSelector(selectAddresses);
  const transactions = useAppSelector(selectTransactions);
  const walletBalance = useAppSelector(selectWalletBalance);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);

  const loadProfile = useCallback(() => {
    dispatch(loadProfileData());
    dispatch(loadOrders());
    dispatch(loadAddresses());
    dispatch(loadWalletData());
  }, [dispatch]);

  const updatePicture = useCallback((imageUrl: string) => {
    dispatch(updateProfilePicture(imageUrl));
  }, [dispatch]);

  const updateData = useCallback((data: Partial<ProfileData>) => {
    dispatch(updateProfileData(data));
  }, [dispatch]);

  const editClick = useCallback(() => {
    dispatch(handleEditClick());
  }, [dispatch]);

  const saveChanges = useCallback(() => {
    dispatch(handleSaveChanges());
  }, [dispatch]);

  const inputChange = useCallback((field: keyof ProfileData, value: string) => {
    dispatch(handleInputChange({ field, value }));
  }, [dispatch]);

  const openModal = useCallback(() => {
    dispatch(openEditModal());
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch(closeEditModal());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearProfileError());
  }, [dispatch]);

  return {
    profileData,
    editData,
    isEditModalOpen,
    orders,
    addresses,
    transactions,
    walletBalance,
    loading,
    error,
    loadProfile,
    updateProfilePicture: updatePicture,
    updateProfileData: updateData,
    handleEditClick: editClick,
    handleSaveChanges: saveChanges,
    handleInputChange: inputChange,
    openEditModal: openModal,
    closeEditModal: closeModal,
    clearProfileError: clearError,
  };
};