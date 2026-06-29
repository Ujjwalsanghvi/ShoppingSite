import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';  // Fixed path
import { login, resetPassword, clearError } from '../store/slices/authSlice';  // Fixed path

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);

  const validateEmailFormat = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pass: string, emailAddress: string) => {
    const checks = {
      length: pass.length >= 8,
      notInEmail: emailAddress ? !pass.toLowerCase().includes(emailAddress.toLowerCase().split('@')[0]) : true,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    };
    return checks;
  };

  const validateEmail = (email: string) => {
    if (email.length > 50) {
      return 'Email must be at most 50 characters';
    }
    if (!validateEmailFormat(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const isFormValid = () => {
    if (!email || !password) {
      return false;
    }
    if (email.length > 50) {
      return false;
    }
    if (!validateEmailFormat(email)) {
      return false;
    }
    
    const passwordChecks = validatePassword(password, email);
    if (!passwordChecks.length || !passwordChecks.notInEmail || 
        !passwordChecks.uppercase || !passwordChecks.lowercase || 
        !passwordChecks.number || !passwordChecks.special) {
      return false;
    }
    
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
    }
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setResetEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    dispatch(clearError());
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    const passwordChecks = validatePassword(password, email);
    if (!passwordChecks.length || !passwordChecks.notInEmail || 
        !passwordChecks.uppercase || !passwordChecks.lowercase || 
        !passwordChecks.number || !passwordChecks.special) {
      setError('Password does not meet the requirements. Hover over password field for details.');
      return;
    }
    
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    dispatch(clearError());
    
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    const emailError = validateEmail(resetEmail);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    try {
      await dispatch(resetPassword({ email: resetEmail })).unwrap();
      setResetMessage('Password reset link sent to your email! Check console for demo.');
      setTimeout(() => {
        setShowReset(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Email not found. Please check and try again.');
    }
  };

  const passwordChecks = validatePassword(password, email);
  const formValid = isFormValid();

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-100 p-5 md:p-4 md:min-h-[calc(100vh-70px)]">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[450px] md:p-6 md:mx-2.5">
        <h2 className="text-center mb-2 text-[#1a1a2e] text-[28px] font-bold md:text-2xl">Welcome Back</h2>
        <p className="text-center mb-8 text-gray-500 text-sm md:text-xs md:mb-6">Please sign in to your account</p>
        
        {(error || reduxError) && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 text-center text-xs md:p-2.5">
            {error || reduxError}
          </div>
        )}
        
        {!showReset ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800 md:text-xs">
                Email Address <span className="text-red-500 text-xs">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  className={`w-full p-3 pr-[60px] border rounded-lg text-base outline-none transition-all duration-300 bg-white box-border focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5 md:pr-[55px] md:text-sm ${
                    email && !validateEmail(email) && validateEmailFormat(email) ? 'border-green-500 border-2' : ''
                  } ${email && validateEmail(email) ? 'border-red-500 border-2' : 'border-gray-300'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1 pointer-events-none">
                  <span className={`text-xs text-gray-400 ${
                    email.length > 45 ? 'text-orange-500 font-bold' : ''
                  } ${email.length >= 50 ? 'text-red-500 font-bold' : ''}`}>
                    {email.length}/50
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">
                Email must be at most 50 characters and in valid format (e.g., name@example.com)
              </div>
              {email && email.length > 0 && !validateEmailFormat(email) && (
                <div className="text-red-500 text-xs mt-1">Please enter a valid email address</div>
              )}
              {email && validateEmailFormat(email) && email.length > 0 && email.length <= 50 && (
                <div className="text-green-500 text-xs mt-1">✓ Valid email format</div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800 md:text-xs">
                Password <span className="text-red-500 text-xs">*</span>
              </label>
              <div 
                className="relative w-full"
                onMouseEnter={() => setIsPasswordHovered(true)}
                onMouseLeave={() => setIsPasswordHovered(false)}
                onTouchStart={() => setIsPasswordHovered(true)}
                onTouchEnd={() => setTimeout(() => setIsPasswordHovered(false), 2000)}
              >
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`w-full p-3 border rounded-lg text-base outline-none transition-all duration-300 bg-white focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5 md:text-sm ${
                      password ? 'border-green-500 border-2' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-blue-400 cursor-pointer text-sm font-semibold py-1 px-2 rounded-md z-[1] hover:text-blue-500 md:text-xs md:px-1.5"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                
                {isPasswordHovered && (
                  <div className="absolute top-full left-0 mt-2.5 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-[1000] animate-fadeIn md:w-[calc(100vw-40px)] md:max-w-[320px] md:left-1/2 md:-translate-x-1/2 md:fixed md:top-auto md:bottom-auto">
                    <div className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-400 md:text-xs">
                      Password Requirements:
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.length ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.length ? '✓' : '❌'} Minimum of eight (8) characters
                      </div>
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.notInEmail ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.notInEmail ? '✓' : '❌'} Cannot be part of email
                      </div>
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.uppercase ? '✓' : '❌'} One uppercase letter
                      </div>
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.lowercase ? '✓' : '❌'} One lowercase letter
                      </div>
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.number ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.number ? '✓' : '❌'} One number
                      </div>
                      <div className={`text-xs flex items-center gap-2 leading-5 py-1 ${passwordChecks.special ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                        {passwordChecks.special ? '✓' : '❌'} One special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={!formValid || loading}
              className={`bg-blue-400 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 md:py-3 md:text-sm ${
                (!formValid || loading) ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'hover:bg-blue-500'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="flex justify-between mt-2.5 pt-2.5 border-t border-gray-100 md:flex-col md:gap-2.5 md:items-center">
              <Link to="/signup" className="text-blue-400 no-underline text-[13px] font-medium hover:underline md:text-xs">
                Create new account
              </Link>
              <button
                onClick={() => setShowReset(true)}
                className="text-blue-400 bg-none border-none cursor-pointer text-[13px] font-medium hover:underline md:text-xs"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5 md:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800 md:text-xs">
                Email Address <span className="text-red-500 text-xs">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  placeholder="Enter your registered email"
                  required
                  className={`w-full p-3 pr-[60px] border rounded-lg text-base outline-none transition-all duration-300 bg-white box-border focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5 md:pr-[55px] md:text-sm ${
                    resetEmail && !validateEmail(resetEmail) && validateEmailFormat(resetEmail) ? 'border-green-500 border-2' : ''
                  } ${resetEmail && validateEmail(resetEmail) ? 'border-red-500 border-2' : 'border-gray-300'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1 pointer-events-none">
                  <span className={`text-xs text-gray-400 ${
                    resetEmail.length > 45 ? 'text-orange-500 font-bold' : ''
                  } ${resetEmail.length >= 50 ? 'text-red-500 font-bold' : ''}`}>
                    {resetEmail.length}/50
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1 leading-tight">
                Email must be at most 50 characters and in valid format (e.g., name@example.com)
              </div>
              {resetEmail && resetEmail.length > 0 && !validateEmailFormat(resetEmail) && (
                <div className="text-red-500 text-xs mt-1">Please enter a valid email address</div>
              )}
              {resetEmail && validateEmailFormat(resetEmail) && resetEmail.length > 0 && resetEmail.length <= 50 && (
                <div className="text-green-500 text-xs mt-1">✓ Valid email format</div>
              )}
            </div>
            
            {resetMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-xs">
                {resetMessage}
              </div>
            )}
            {(error || reduxError) && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center text-xs">
                {error || reduxError}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={!resetEmail || !validateEmailFormat(resetEmail) || resetEmail.length > 50 || loading}
              className={`bg-blue-400 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 md:py-3 md:text-sm ${
                (!resetEmail || !validateEmailFormat(resetEmail) || resetEmail.length > 50 || loading) ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'hover:bg-blue-500'
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setError('');
                dispatch(clearError());
              }}
              className="bg-none border-none text-blue-400 cursor-pointer text-sm font-medium mt-4 py-2 w-full text-center rounded-md transition-colors duration-300 hover:bg-gray-100 md:text-xs"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;