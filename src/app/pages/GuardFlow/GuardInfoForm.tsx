"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GuardInfoForm: React.FC = () => {
  const [yourRole, setYourRole] = useState('');
  const [yourName, setYourName] = useState('');
  const [partnerRole, setPartnerRole] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);

  const primaryOptions = ['Roger', 'Jamie', 'Shawn'];
  const secondaryOptions = ['Marie', 'David', 'Peter'];

  const router = useRouter();

  const handleContinue = () => {
    // Add any necessary logic before routing
    router.push('/guard-matching');
  };

  useEffect(() => {
    // setIsContinueDisabled(!(yourName && yourRole && partnerName && partnerRole && yourRole !== partnerRole));
  }, [yourRole, partnerRole, yourName, partnerName]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Companion Form</h1>
      {/* Add your form elements and logic here */}
      <div className="border border-black p-6 rounded-md w-full max-w-md">
        <div className="mb-4">
          {/* Placeholder Dropdown 1 */}
          <label htmlFor="name-dropdown" className="block text-sm font-medium text-gray-700">Your Name</label>
          <select className="w-full p-2 border rounded" id="name-dropdown" value={yourName} onChange={(e) => setYourName(e.target.value)}>
 <option value="">Select your name</option>
 {primaryOptions.map((option, index) => (
 <option key={index} value={option}>{option}</option>
 ))}
          </select>
          {/* New Dropdown for Role */}
          <div className="mt-4">
            <label htmlFor="role-dropdown" className="block text-sm font-medium text-gray-700">Your Role</label>
            <select id="your-role-dropdown" className="w-full p-2 border rounded" value={yourRole} onChange={(e) => setYourRole(e.target.value)}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
        </div>
        {/* Placeholder Dropdown 2 */}
        <label htmlFor="secondary-dropdown" className="block text-sm font-medium text-gray-700">Partner Name</label>
        <select className="w-full p-2 border rounded" id="secondary-dropdown" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}>
 <option value="">Select partner name</option>
 {secondaryOptions.map((option, index) => (
 <option key={index} value={option}>{option}</option>
 ))}
        </select>
        <div className="mt-4">
            <label htmlFor="role-dropdown" className="block text-sm font-medium text-gray-700">Partner Role</label>
            <select id="partner-role-dropdown" className="w-full p-2 border rounded" value={partnerRole} onChange={(e) => setPartnerRole(e.target.value)}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
      </div>
 <button onClick={handleContinue} className={`mt-6 w-full max-w-md px-4 py-2 text-white rounded-md ${isContinueDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800'}`}>
        Continue
      </button>
    </div>
  );
};

export default GuardInfoForm;