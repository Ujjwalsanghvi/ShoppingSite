import axios from 'axios';
import { Product } from '../types/Mainview';

const API_BASE_URL = 'https://fakestoreapi.com';

// User interface for stored users
interface StoredUser {
  id: number;
  email: string;
  name: string;
  password: string; // In a real app, this would be hashed
}

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },
  
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },
  
  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data;
  },
  
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/category/${category}`);
    return response.data;
  },
  
  // Mock authentication with proper password storage
  mockAuth: {
    // Initialize users from localStorage or create default
    getUsers: (): StoredUser[] => {
      const users = localStorage.getItem('registeredUsers');
      if (users) {
        return JSON.parse(users);
      }
      // Create a default test user
      const defaultUsers = [
        {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    },
    
    saveUsers: (users: StoredUser[]) => {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    },
    
    login: async (email: string, password: string): Promise<any> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = api.mockAuth.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isAuthenticated', 'true');
        return userWithoutPassword;
      }
      throw new Error('Invalid email or password');
    },
    
    signup: async (email: string, password: string, name: string): Promise<any> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = api.mockAuth.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email,
        name,
        password // Store password (in real app, hash this)
      };
      
      users.push(newUser);
      api.mockAuth.saveUsers(users);
      
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('isAuthenticated', 'true');
      return userWithoutPassword;
    },
    
    resetPassword: async (email: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = api.mockAuth.getUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In a real app, send reset email
        console.log(`Password reset link sent to ${email}`);
        return;
      }
      throw new Error('Email not found');
    },
    
    updatePassword: async (email: string, newPassword: string): Promise<void> => {
      const users = api.mockAuth.getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        api.mockAuth.saveUsers(users);
        return;
      }
      throw new Error('User not found');
    },
    
    getCurrentUser: (): any => {
      const userStr = localStorage.getItem('user');
      if (userStr && localStorage.getItem('isAuthenticated') === 'true') {
        return JSON.parse(userStr);
      }
      return null;
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }
};