"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useModal } from '@/components/ui/Modal';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';
import { database } from '@/lib/firebase';
import { useCompanionStore } from '@/store/store';
import { ref, set } from 'firebase/database';
import { extractDataFromStore } from '@/lib/utils'; // Import the utility function

const GuardInfoForm: React.FC = () => {
  const [yourRole, setYourRole] = useState('Primary');
  const [yourName, setYourName] = useState('');
  const [partnerRole, setPartnerRole] = useState('Secondary');
  const [partnerName, setPartnerName] = useState('');
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);

  const { setCompanionProfileDetails, setSessionId } = useCompanionStore();
  const primaryOptions = ['Buchi', 'Benjamin'];
  const secondaryOptions = ['Benjamin', 'Buchi'];

  const { openModal, closeModal } = useModal();
  const router = useRouter(); 

  const handleContinue = () => {
    // Add any necessary logic before routing
    if (yourRole === 'primary') {
      setCompanionProfileDetails({
        primaryCompanionName: yourName,
        secondaryCompanionName: partnerName,
        companionRole: yourRole,
      });
    } else {
      setCompanionProfileDetails({
        primaryCompanionName: partnerName,
        secondaryCompanionName: yourName,
        companionRole: yourRole,
      });
    }

    router.push('/guard-matching');
  };

  const createFirebaseSession = () => {
    const now = new Date();
    const sessionId = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-Companion-${yourRole}`;
    
    if (!sessionId) {
      console.error("Session ID is null or undefined. Cannot create Firebase session.");
      return;
    }
    
    setSessionId(sessionId);

    // Get the entire store object
    const storeState = useCompanionStore.getState();

    // Extract only data properties, excluding methods
    const dataOnlyObject = extractDataFromStore(storeState);
    
    if (!dataOnlyObject || Object.keys(dataOnlyObject).length === 0) {
      console.error("No data to write to Firebase. Cannot create session.");
      return;
    }

    // Write the entire store object to Firebase
    try {
      const storeRef = ref(database, `storeObjects/${sessionId}`); // Reference using session ID
      set(storeRef, dataOnlyObject); // Use set() to overwrite the data with data-only object
      console.log("Session created for guard - success!");
    } catch (error) {
      console.error("Session created for client - failure!", error);
    }
  };

  const onSubmit = () => {
    const handleYes = () => {
      handleContinue();
      createFirebaseSession();
      closeModal();
    };
    openModal(<ConfirmationModalContent text="Kindly provide your consent to proceed ahead" yesText="I Agree" onConfirm={handleYes} onCancel={closeModal} />);
  }

  useEffect(() => {
    setIsContinueDisabled(!(yourName && partnerName && yourRole && partnerRole && (yourRole !== partnerRole) && (yourName !== partnerName )));
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
      <button disabled={isContinueDisabled || yourRole === partnerRole} onClick={onSubmit} className={`mt-6 w-full max-w-md px-4 py-2 text-white rounded-md ${(isContinueDisabled || yourRole === partnerRole) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800'}`}>
        Continue
      </button>
    </div>
  );
};

export default GuardInfoForm;