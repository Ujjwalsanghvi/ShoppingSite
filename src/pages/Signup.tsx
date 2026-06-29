import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';  // Fixed path
import { signup, clearError } from '../store/slices/authSlice';  // Fixed path
export const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useAppSelector((state) => state.auth);
  
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);

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

  const getPasswordErrors = (pass: string, emailAddress: string) => {
    const errors = [];
    if (pass.length < 8) errors.push('Minimum of eight (8) characters in length');
    if (emailAddress && pass.toLowerCase().includes(emailAddress.toLowerCase().split('@')[0])) {
      errors.push('Cannot be part of Email Address');
    }
    if (!/[A-Z]/.test(pass)) errors.push('At least one (1) uppercase letter (A-Z)');
    if (!/[a-z]/.test(pass)) errors.push('At least one (1) lowercase letter (a-z)');
    if (!/[0-9]/.test(pass)) errors.push('At least one (1) number (0-9)');
    if (!/[!@#$%^&*]/.test(pass)) errors.push('At least one (1) special character (!, @, #, $, %, ^, &, *)');
    return errors;
  };

  const validateName = (name: string) => {
    if (name.length < 4) {
      return 'First name must be at least 4 characters';
    }
    return null;
  };

  const validateEmail = (email: string) => {
    if (email.length > 50) {
      return 'Email must be at most 50 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
    }
  };

  const isFormValid = () => {
    if (!firstName || !email || !password || !confirmPassword) {
      return false;
    }
    if (firstName.length < 4) {
      return false;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      return false;
    }
    const passwordErrors = getPasswordErrors(password, email);
    if (passwordErrors.length > 0) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    dispatch(clearError());
    
    const firstNameError = validateName(firstName);
    if (firstNameError) {
      setError(firstNameError);
      return;
    }
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    const passwordErrors = getPasswordErrors(password, email);
    if (passwordErrors.length > 0) {
      setError(`Password requirements not met:\n${passwordErrors.join('\n')}`);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await dispatch(signup({ email, password, name: firstName })).unwrap();
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Error creating account. Email might already exist.');
    }
  };

  const passwordChecks = validatePassword(password, email);
  const formValid = isFormValid();

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-100 p-5 md:p-4 md:min-h-[calc(100vh-70px)]">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-[500px] md:p-6 md:mx-2.5">
        <h2 className="text-center mb-8 text-gray-800 text-[28px] md:text-2xl md:mb-6">Sign Up</h2>
        {(error || reduxError) && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-5 text-center text-sm whitespace-pre-line md:p-2.5 md:text-xs">
            {error || reduxError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600 md:text-xs">
              First Name <span className="text-red-500 text-xs">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
              className={`w-full p-3 border rounded-md text-base outline-none transition-colors duration-300 focus:border-blue-400 md:p-2.5 md:text-sm ${
                firstName && firstName.length >= 4 ? 'border-green-500 border-2' : ''
              } ${firstName && firstName.length < 4 ? 'border-red-500 border-2' : 'border-gray-300'}`}
            />
            {firstName && firstName.length < 4 && (
              <div className="text-red-500 text-xs mt-1">
                First name must be at least 4 characters (current: {firstName.length})
              </div>
            )}
            {firstName && firstName.length >= 4 && (
              <div className="text-green-500 text-xs mt-1">✓ First name is valid</div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600 md:text-xs">
              Email <span className="text-red-500 text-xs">*</span>
            </label>
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
                className={`w-full p-3 border rounded-md text-base outline-none transition-colors duration-300 focus:border-blue-400 md:p-2.5 md:text-sm pr-14 ${
                  email && !validateEmail(email) ? 'border-green-500 border-2' : ''
                } ${email && validateEmail(email) ? 'border-red-500 border-2' : 'border-gray-300'}`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white pl-1">
                <span className={`text-xs text-gray-400 ${
                  email.length > 45 ? 'text-orange-500 font-bold' : ''
                } ${email.length >= 50 ? 'text-red-500 font-bold' : ''}`}>
                  {email.length}/50
                </span>
              </div>
            </div>
            {email && email.length > 0 && (
              <div className="text-xs mt-1">
                {!validateEmail(email) ? (
                  <span className="text-green-500">✓ Valid email format</span>
                ) : (
                  <span className="text-red-500">⚠ Invalid email format</span>
                )}
                {email.length <= 40 && !validateEmail(email) && (
                  <span className="text-green-500"> ✓ Good length</span>
                )}
                {email.length > 40 && email.length < 50 && !validateEmail(email) && (
                  <span className="text-orange-500"> ⚠ Getting long (max 50)</span>
                )}
                {email.length === 50 && !validateEmail(email) && (
                  <span className="text-red-500"> ⚠ Maximum characters reached</span>
                )}
              </div>
            )}
            <div className="text-xs text-gray-400 leading-tight">
              Email must be at most 50 characters and in valid format (e.g., name@example.com)
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600 md:text-xs">
              Password <span className="text-red-500 text-xs">*</span>
            </label>
            <div 
              className="relative w-full"
              onMouseEnter={() => setIsPasswordHovered(true)}
              onMouseLeave={() => setIsPasswordHovered(false)}
              onTouchStart={() => setIsPasswordHovered(true)}
              onTouchEnd={() => setTimeout(() => setIsPasswordHovered(false), 2000)}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className={`w-full p-3 border rounded-md text-base outline-none transition-colors duration-300 focus:border-blue-400 md:p-2.5 md:text-sm ${
                    password && getPasswordErrors(password, email).length === 0 ? 'border-green-500 border-2' : ''
                  } ${password && getPasswordErrors(password, email).length > 0 ? 'border-red-500 border-2' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none text-blue-400 cursor-pointer text-sm font-bold hover:text-blue-500 md:text-xs md:px-1.5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              {isPasswordHovered && (
                <div className="absolute top-full left-0 mt-2.5 w-72 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-[1000] animate-fadeIn md:w-[calc(100vw-40px)] md:max-w-[300px] md:left-1/2 md:-translate-x-1/2 md:fixed md:top-auto">
                  <div className="text-sm font-bold text-gray-800 mb-2.5 pb-2 border-b border-gray-200 md:text-xs">
                    Password Requirements:
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.length ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.length ? '✓' : '✗'} Minimum 8 characters
                    </div>
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.notInEmail ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.notInEmail ? '✓' : '✗'} Cannot be part of email
                    </div>
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.uppercase ? '✓' : '✗'} One uppercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.lowercase ? '✓' : '✗'} One lowercase letter
                    </div>
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.number ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.number ? '✓' : '✗'} One number
                    </div>
                    <div className={`text-xs flex items-center gap-2 leading-tight py-1 ${passwordChecks.special ? 'text-green-500' : 'text-red-500'} md:text-[11px]`}>
                      {passwordChecks.special ? '✓' : '✗'} One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>
            {password && getPasswordErrors(password, email).length === 0 && (
              <div className="text-green-500 text-xs mt-1">✓ Password meets all requirements</div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600 md:text-xs">
              Confirm Password <span className="text-red-500 text-xs">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`w-full p-3 border rounded-md text-base outline-none transition-colors duration-300 focus:border-blue-400 md:p-2.5 md:text-sm ${
                  confirmPassword && password === confirmPassword ? 'border-green-500 border-2' : ''
                } ${confirmPassword && password !== confirmPassword ? 'border-red-500 border-2' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none text-blue-400 cursor-pointer text-sm font-bold hover:text-blue-500 md:text-xs md:px-1.5"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div className="text-red-500 text-xs mt-1">Passwords do not match</div>
            )}
            {confirmPassword && password === confirmPassword && password && (
              <div className="text-green-500 text-xs mt-1">✓ Passwords match</div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={!formValid || loading}
            className={`bg-blue-400 text-white border-none py-3.5 rounded-md text-base font-bold cursor-pointer transition-all duration-300 mt-2.5 md:py-3 md:text-sm ${
              (!formValid || loading) ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'hover:bg-blue-500'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className="text-center mt-2.5">
            <Link to="/login" className="text-blue-400 no-underline text-sm hover:underline md:text-xs">
              Already have an account? Login
            </Link>
          </div>
        </form>
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

export default Signup;