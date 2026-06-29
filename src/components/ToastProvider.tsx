import React from 'react';
import { Toaster } from 'sonner';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          duration: 3000,
        }}
        visibleToasts={9}
      />
    </>
  );
};

export default ToastProvider;