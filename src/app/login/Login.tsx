'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanionStore } from '@/store/store';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [headerText, setHeaderText] = useState('Enter Details');
  const [mobile, setMobile] = useState('');
  const [hasBlurredEmail, setHasBlurredEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { setProfileDetails, setSessionId, ...storeState } = useCompanionStore();

  const router = useRouter();
  const validateEmail = (value: string) => {
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validateMobile = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      if (value.length < 5) {
      }
      setMobileError('Mobile number must be numeric');
    } else {
      if (value.length !== 10) {
      }

      setMobileError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileDetails({
      name,
      email,
      mobile,
    });
    const sessionId = `${Date.now()}-${Math.random()}`;
    setSessionId(sessionId);
    console.log('Current store state:', storeState);
    router.push('/introduction');
  };

  const handleKeyDownName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      emailInputRef.current?.focus();
    }
  };

  const handleKeyDownEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      mobileInputRef.current?.focus();
    }
  };

  const handleKeyDownMobile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitButtonRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 id="form-header" className="text-2xl font-bold mb-6 text-center fade-transition">
          {headerText}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDownName}
              onBlur={() => {
                if (name) {
                  setHeaderText(`Hi, ${name}`);
                }
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (hasBlurredEmail) {
                  validateEmail(e.target.value);
                }
              }}
              onBlur={() => { validateEmail(email); setHasBlurredEmail(true); }}
              onKeyDown={handleKeyDownEmail}
            />
            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${mobileError ? 'border-red-500' : ''}`}
              ref={mobileInputRef}
              id="mobile"
              type="number"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onKeyDown={handleKeyDownMobile}
              onBlur={() => validateMobile(mobile)}
            />
            {mobileError && <p className="text-red-500 text-xs italic">{mobileError}</p>}
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`
                
                bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                ${!name || !email || !mobile || !!emailError || !!mobileError ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}
              `}

              type="submit"
              disabled={!name || !email || !mobile || !!emailError || !!mobileError}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const fadeTransition = `
  .fade-transition {
    transition: opacity 0.5s ease-in-out;
  }
`;

export default Login;