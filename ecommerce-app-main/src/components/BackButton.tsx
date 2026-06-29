import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page and products page
  if (location.pathname === '/' || location.pathname === '/products') {
    return null;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button className="floating-back-btn" onClick={handleGoBack}>
      ←
    </button>
  );
};

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .floating-back-btn {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4fc3f7, #2196f3);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 28px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-back-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .floating-back-btn:active {
    transform: scale(0.95);
  }

  @media (min-width: 769px) {
    .floating-back-btn {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .floating-back-btn {
      display: flex;
      bottom: 70px;
      right: 15px;
      width: 50px;
      height: 50px;
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    .floating-back-btn {
      bottom: 60px;
      right: 12px;
      width: 45px;
      height: 45px;
      font-size: 22px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default BackButton;