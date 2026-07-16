import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData } from '../../types/ProfileData';
import { IAddress } from '../../types/Address';
import { Transaction } from '../../types/Transaction';
import { Order } from '../../types/Order';
import { RootState } from '../index';

interface ProfileState {
  profileData: ProfileData;
  editData: ProfileData;
  isEditModalOpen: boolean;
  orders: Order[];
  addresses: IAddress[];
  transactions: Transaction[];
  walletBalance: number;
  loading: boolean;
  error: string | null;
}


const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const user = getUser();

const initialState: ProfileState = {
  profileData: {
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profilePicture: '',
    joinDate: new Date().toISOString().split('T')[0]
  },
  editData: {
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profilePicture: '',
    joinDate: new Date().toISOString().split('T')[0]
  },
  isEditModalOpen: false,
  orders: [],
  addresses: [],
  transactions: [],
  walletBalance: 0,
  loading: false,
  error: null,
};


export const loadProfileData = createAsyncThunk(
  'profile/loadProfileData',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return null;
  }
);

export const loadOrders = createAsyncThunk(
  'profile/loadOrders',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const savedOrders = localStorage.getItem(`orders_${userId}`);
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    return [];
  }
);

export const loadAddresses = createAsyncThunk(
  'profile/loadAddresses',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const savedAddresses = localStorage.getItem(`addresses_${userId}`);
    if (savedAddresses) {
      return JSON.parse(savedAddresses);
    }
    return [];
  }
);

export const loadWalletData = createAsyncThunk(
  'profile/loadWalletData',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const savedBalance = localStorage.getItem(`wallet_balance_${userId}`);
    const savedTransactions = localStorage.getItem(`wallet_transactions_${userId}`);
    
    return {
      balance: savedBalance ? parseFloat(savedBalance) : 500.0,
      transactions: savedTransactions ? JSON.parse(savedTransactions) : []
    };
  }
);

export const updateProfilePicture = createAsyncThunk(
  'profile/updateProfilePicture',
  async (imageUrl: string, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const currentProfile = state.profile?.profileData || initialState.profileData;
    const updatedData = { ...currentProfile, profilePicture: imageUrl };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
    return updatedData;
  }
);

export const updateProfileData = createAsyncThunk(
  'profile/updateProfileData',
  async (data: Partial<ProfileData>, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth?.user?.id;
    const currentProfile = state.profile?.profileData || initialState.profileData;
    const updatedData = { ...currentProfile, ...data };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
    return updatedData;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
    setEditData: (state, action: PayloadAction<ProfileData>) => {
      state.editData = action.payload;
    },
    handleInputChange: (state, action: PayloadAction<{ field: keyof ProfileData; value: string }>) => {
      state.editData[action.payload.field] = action.payload.value;
    },
    handleSaveChanges: (state) => {
      state.profileData = { ...state.editData };
      state.isEditModalOpen = false;
    },
    handleEditClick: (state) => {
      state.editData = { ...state.profileData };
      state.isEditModalOpen = true;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfileData.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileData = action.payload;
          state.editData = action.payload;
        }
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(loadAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(loadWalletData.fulfilled, (state, action) => {
        state.walletBalance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.editData = action.payload;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.editData = action.payload;
      });
  },
});

export const {
  openEditModal,
  closeEditModal,
  setEditData,
  handleInputChange,
  handleSaveChanges,
  handleEditClick,
  clearProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;


export const selectProfileData = (state: RootState) => state.profile?.profileData || initialState.profileData;
export const selectEditData = (state: RootState) => state.profile?.editData || initialState.editData;
export const selectIsEditModalOpen = (state: RootState) => state.profile?.isEditModalOpen || false;
export const selectOrders = (state: RootState) =>state.profile?.orders || [];
export const selectAddresses = (state: RootState) => state.profile?.addresses || [];
export const selectTransactions = (state: RootState) => state.profile?.transactions || [];
export const selectWalletBalance = (state: RootState) => state.profile?.walletBalance || 0;
export const selectProfileLoading = (state: RootState) => state.profile?.loading || false;
export const selectProfileError = (state: RootState) => state.profile?.error || null;