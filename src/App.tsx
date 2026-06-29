import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider } from './components/ToastProvider'; // Add this import
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute'; // Add this import
import { BackButton } from './components/BackButton';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Address } from './pages/Profile/Address';
import { Orders } from './pages/Profile/Orders';
import { Wallet } from './pages/Profile/Wallet';
import { ViewProfile } from './pages/Profile/ViewProfile';
import { Analytics } from './pages/Profile/Analytics';
import { OrderManagement } from './pages/Admin/OrderManagement';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider> {/* Wrap with ToastProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            {/* Order Management Route - Admin */}
            <Route path="/admin/orders" element={
              <AdminRoute> {/* Changed from ProtectedRoute to AdminRoute */}
                <OrderManagement />
              </AdminRoute>
            } />
            <Route path="/profile/view" element={
              <ProtectedRoute>
                <ViewProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile/address" element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            } />
            <Route path="/profile/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/profile/wallet" element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } />
          </Routes>
          <BackButton />
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;