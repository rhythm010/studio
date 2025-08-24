"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCompanionStore } from '@/store/store'; // Import the store
import { checkIfSessionExistsAndMatch, updateCompanionSessionIdInClient, updateValueInClient, storePaths, updateInSelfFirebase, handleManualCompanionSessionIdSubmit, getClientChangePermission, getClientData } from '@/lib/utils'; // Import the utility method
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ui/Modal';
import CompanionActivityMode from '../CompanionActivityMode/CompanionActivityMode';
import { ACTIVITY_MODES, ACTIVITY_STATUS, COMPANION_MODE_STATUS_LINKER, MSG_STATUS, MESSAGE_TYPES_TO_COMPANION, COMPANION_STATUS_BUTTON_LABELS, COMPANION_MODE_BUTTON_LABELS, ACTIVITY_SUB_MODE_LINKER, MODE_DEFAULT_STATUS, COMPANION_SCREEN_MAPPER } from '@/lib/constants';
import StopWatch from '../../InService/StopWatch';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';
import { vocab } from '@/lib/vocab_constants';

const GuardMatchingPage: React.FC = () => {
  // Reusable classes for the mode selection buttons, similar to the 'Start Scan' button style
  const selectedButtonClasses = "border flex items-center justify-center bg-green-600 text-white text-sm rounded-md py-3 px-4 min-w-[72px] min-h-[32px] text-[1.2rem] py-[0.8rem] px-[1.6rem] m-[0.4rem]"; // Larger buttons for status container
  const disabledButtonClasses = "border flex items-center justify-center bg-gray-400 text-gray-700 text-sm rounded-md py-3 px-4"; // Larger buttons for status container
  const buttonClasses = "border flex items-center justify-center bg-gray-800 text-white text-sm rounded-md py-3 px-4 min-w-[72px] min-h-[32px] text-[1.2rem] py-[0.8rem] px-[1.6rem] m-[0.4rem]"; // Larger buttons for status container
  
  // Status container button classes (10% smaller than mode buttons)
  const statusSelectedButtonClasses = "border flex items-center justify-center bg-green-600 text-white text-sm rounded-md py-2.5 px-3.5"; // 10% larger than previous status buttons
  const statusDisabledButtonClasses = "border flex items-center justify-center bg-gray-400 text-gray-700 text-sm rounded-md py-2.5 px-3.5"; // 10% larger than previous status buttons
  const statusButtonClasses = "border flex items-center justify-center bg-gray-800 text-white text-sm rounded-md py-2.5 px-3.5"; // 10% larger than previous status buttons
  const qrCodeRef = useRef<string>('reader');
  const { getCompanionProfileDetails } = useCompanionStore();
  const html5Qrcode = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [serviceContinue, setserviceContinue] = useState(true);
  const { openModal, closeModal } = useModal();
  const [qrData, setQrData] = useState('');
  const setMatchingDone = useCompanionStore((state) => state.setMatchingDone); // Get the setter from the store
  const setClientSessionId = useCompanionStore((state) => state.setClientSessionId); // Get the setter for clientSessionId
  const {
    isDevMode,
  } = useCompanionStore();
  const [manualSessionId, setManualSessionId] = useState(''); // State for manual client session ID input
  const manualCompanionSessionIdRef = useRef<HTMLInputElement>(null); // Ref for manual companion session ID input
  const [isConnecting, setIsConnecting] = useState<boolean>(false); // State for loading during connection
  const router = useRouter();
  const companionRole = getCompanionProfileDetails().companionRole || 'Primary'; // Get the companion role
  const isPrimary = companionRole === 'Primary'; // Boolean for primary companion check
  const clientSessionId = useCompanionStore((state) => state.getClientSessionId()); // Reactive client session ID
  // Get the selected mode from the store for conditional styling
  // Get the selected mode and current status from the store for conditional styling
  const { selectedMode, companionCurrentStatus, recieveCompanionMsgQueue } = useCompanionStore((state) => state.CompanionAcvitiyMonitor);
  const [selectedModeForSecondary, setSelectedModeForSecondary] = useState<string>(''); // State for secondary companion to track client's current mode

  const companionActivityStatus = useCompanionStore.getState().CompanionAcvitiyMonitor.companionCurrentStatus;
  const setSelectedSubMode = useCompanionStore((state) => state.setSelectedSubMode);
  const selectedSubMode = useCompanionStore((state) => state.getSelectedSubMode());
  
  // Common overlay styles for disabled containers
  const overlayStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
    pointerEvents: 'auto' as const,
    borderRadius: '0.75rem'
  };

  useEffect(() => {
    // Create an instance of Html5Qrcode
    if (!html5Qrcode.current) {
      html5Qrcode.current = new Html5Qrcode(qrCodeRef.current);
    }

    return () => {
      // Cleanup function to stop the scanner when the component unmounts
      if (html5Qrcode.current && html5Qrcode.current.isScanning) {
        html5Qrcode.current.stop().catch(err => {
          console.error("Failed to stop the scanner on unmount:", err);
        });
      }
    };
  }, []);

  // Listen to client's currentMode for secondary companions
  useEffect(() => {
    console.log('reading client session id and companion role', clientSessionId, companionRole);
    if (!isPrimary && clientSessionId) {
      console.log('Listening to client\'s currentMode for secondary companions');
      const { data, unsubscribe } = getClientData(
        storePaths.ClientActivityMonitor.currentMode,
        (newMode: string) => {
          setSelectedModeForSecondary(newMode || '');
          // Update selectedMode in store for secondary companions
          modeSelectionConfirmationLocalUpdate(newMode);
        }
      );
      
      // Set initial value
      const initialMode = data || '';
      setSelectedModeForSecondary(initialMode);
      // Update selectedMode in store with initial value for secondary companions
      modeSelectionConfirmationLocalUpdate(initialMode);
      
      return unsubscribe;
    }
  }, [companionRole, clientSessionId]);

  // Add blinking animation style for urgent messages and urgent icon style
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes blink-urgent {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .blink-urgent {
        animation: blink-urgent 1s linear infinite;
      }
      .urgent-icon {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #fff;
        border-radius: 50%;
        border: 2px solid red;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: red;
        z-index: 2;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const scanSuccess = () => {
    console.log("QR code matched. Updating matching status in store and Firebase.");
    stopScanning();
  };

  const endCompanionService = () => {
    console.log("Ending companion service.");
    router.push('/guard-feedback');
    // sendMsgToClient({id:`msg_${Date.now()}`,data:'msg coming'});
  };

  const onceClientSessionIdFound = (ClientSessionId: any) => {
    const companionSessionId = useCompanionStore.getState().getSessionId();
    // console.log("Manual session ID found:", ClientSessionId); // Add logging for manual session ID
    setClientSessionId(ClientSessionId);
    updateCompanionSessionIdInClient(ClientSessionId, companionSessionId, companionRole);
    updateInSelfFirebase(storePaths.companionProfileDetails.clientSessionId, ClientSessionId);
    scanSuccess();
  }

  // Handler for manual companion session ID input
  const handleManualCompanionSessionIdSubmitLocal = async (inputValue: string) => {
    setIsConnecting(true);
    try {
      const success = await handleManualCompanionSessionIdSubmit(inputValue);
      if (success) {
        // Clear input after successful connection
        if (manualCompanionSessionIdRef.current) {
          manualCompanionSessionIdRef.current.value = '';
        }
        scanSuccess();
      }
    } catch (error) {
      console.error('Error connecting to companion session:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handler for companion session restore from localStorage
  const handleCompanionSessionRestore = async () => {
    const restoredCompanionSessionId = localStorage.getItem('companionSessionId');
    if (restoredCompanionSessionId) {
      await handleManualCompanionSessionIdSubmitLocal(restoredCompanionSessionId);
    }
  };

  const QRCodeAnalyze = async (decodedData: string) => {
    if (decodedData) {
      const ClientSessionId = await checkIfSessionExistsAndMatch(decodedData);
      if (ClientSessionId) {
        setClientSessionId(ClientSessionId); // Set the clientSessionId in the store
        onceClientSessionIdFound(ClientSessionId);
        scanSuccess();
      } else {
        // error handling
        // setErrorMessage('Matching session not found.'); // Set error message state
      }
    } else {
      console.log("QR code data did not match 'Companion123'.");
    }
  };

  const startScanning = () => {
    if (html5Qrcode.current && !html5Qrcode.current.isScanning) {
      setScanning(true);
      html5Qrcode.current.start(
        { facingMode: "environment" }, // Use rear camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          // Handle the decoded text
          console.log(`QR code detected: ${decodedText}`);
          setQrData(decodedText);
          QRCodeAnalyze(decodedText); // Call QRCodeAnalyze with decoded data
          stopScanning(); // Stop scanning after a successful scan
          // You can perform actions with the decodedText here, e.g., navigation
        },
        (errorMessage) => {
          // Handle the scan error or continuous streaming
          // console.log(`No QR code detected yet or error: ${errorMessage}`);
        }
      ).catch((err) => {
        console.error("Failed to start scanning:", err);
        setScanning(false);
      });
    } else {
      // If already scanning, stop it
      if (html5Qrcode.current && html5Qrcode.current.isScanning) {
        stopScanning(); // Simply stop the scanner
      }
    }
  };

  const stopScanning = () => {
    if (html5Qrcode.current && html5Qrcode.current.isScanning) {
      html5Qrcode.current.stop().then(() => {
        console.log("QR scanning stopped.");
        setScanning(false);
      }).catch(err => {
        console.error("Failed to stop the scanner:", err);
        setScanning(false);
      });
    }
    setserviceContinue(false);
  };

  const modeSelectionConfirmation = async (mode: string) => {
    console.log(`Mode selected: ${mode}`);
    const defaultStatus = MODE_DEFAULT_STATUS[mode];
    
    // Check permission before making client changes
    // const hasPermission = await getClientChangePermission(storePaths.ClientActivityMonitor.currentMode, mode);
    // if (!hasPermission) {
    //   console.warn('Permission denied for mode selection. Only primary companions can modify client values.');
    //   closeModal();
    //   return;
    // }

    // console.log('hasPermission', hasPermission);

    // useCompanionStore.getState().setCompanionAcvitiyMonitor({
    //   selectedMode: mode,
    //   companionCurrentStatus: defaultStatus,
    // });

    modeSelectionConfirmationLocalUpdate(mode);

    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentMode,
      val: mode,
    });
    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentStatus,
      val: defaultStatus,
    });
    // Update in self Firebase as well
    updateInSelfFirebase(storePaths.CompanionAcvitiyMonitor.selectedMode, mode);
    updateInSelfFirebase(storePaths.CompanionAcvitiyMonitor.companionCurrentStatus, defaultStatus);

    closeModal();
  }

  const modeSelectionConfirmationLocalUpdate = async (mode: string) => {
    const defaultStatus = MODE_DEFAULT_STATUS[mode];
    useCompanionStore.getState().setCompanionAcvitiyMonitor({
      selectedMode: mode,
      companionCurrentStatus: defaultStatus,
    });
  }

  // Common click handler for mode selection buttons
  const handleModeSelection = (mode: string) => {
    openModal(
      <ConfirmationModalContent
        text={vocab.GuardMatchingPage.modeChangeModal[mode.toUpperCase()]} // Customize the confirmation text
        onConfirm={() => {
          modeSelectionConfirmation(mode);
        }}
        onCancel={() => {
          console.log(`User cancelled mode selection for ${mode}`);
          closeModal(); // Close the modal on cancellation
        }}
      />
    );
  };

  // Handler for confirming status selection in the modal
  const handleStatusSelectionConfirm = (status: string) => {
    useCompanionStore.getState().setCompanionAcvitiyMonitor({
      companionCurrentStatus: status,
    });

    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentStatus,
      val: status,
    });
    // Update in self Firebase as well
    updateInSelfFirebase(storePaths.CompanionAcvitiyMonitor.companionCurrentStatus, status);

    closeModal();
  };

  const handleStatusSelection = (status: string) => {
    // If status matches MESSAGE_TYPES_TO_COMPANION[recieveCompanionMsgQueue.type], confirm directly
    if (
      typeof MESSAGE_TYPES_TO_COMPANION !== 'undefined' &&
      recieveCompanionMsgQueue?.type &&
      status === MESSAGE_TYPES_TO_COMPANION[String(recieveCompanionMsgQueue.type) as keyof typeof MESSAGE_TYPES_TO_COMPANION]
    ) {
      handleStatusSelectionConfirm(status);
      return;
    }
    openModal(
      <ConfirmationModalContent
        text={`You have not received instructions for ${status}, Are you sure you want to proceed?`} // Customize the confirmation text
        onConfirm={() => handleStatusSelectionConfirm(status)}
        onCancel={() => {
          console.log(`User cancelled status selection for ${status}`);
          closeModal(); // Close the modal on cancellation
        }}
      />
    );
  };

  // Helper function to determine button class based on selected mode/status
  const getStatusButtonClass = (status: string, currentStatus: string | null, selectedMode: string | null) => {
    const isDisabled = !COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(status);
    return isDisabled ? statusDisabledButtonClasses : (status === currentStatus ? statusSelectedButtonClasses : statusButtonClasses);
  };

  // Handler for clicking the client message container
  const handleClientMsgClick = () => {
    // Get the modal text based on current mode and instruction type
    const instructionData = COMPANION_SCREEN_MAPPER[selectedMode]?.instructions[recieveCompanionMsgQueue?.type];
    const modalTexts = instructionData?.modalTexts;
    
    // Determine which button to show based on current status
    if (recieveCompanionMsgQueue?.status === MSG_STATUS.ACTIONED) {
      openModal(
        <ConfirmationModalContent
          text={modalTexts?.[MSG_STATUS.ACTIONED] || "You have completed this instruction"}
          yesText={undefined}
          noText={"Close"}
          onConfirm={closeModal}
          onCancel={closeModal}
        />
      );
      return;
    }
    let yesText = 'START';
    let nextStatus = MSG_STATUS.OPENED;
    if (recieveCompanionMsgQueue?.status === MSG_STATUS.OPENED) {
      yesText = 'COMPLETED';
      nextStatus = MSG_STATUS.ACTIONED;
    }
    openModal(
      <ConfirmationModalContent
        text={
          yesText === 'START'
            ? modalTexts?.[MSG_STATUS.UNREAD] || 'Do you want to start this message?'
            : modalTexts?.[MSG_STATUS.OPENED] || 'Mark this message as completed?'
        }
        yesText={yesText}
        onConfirm={() => handleClientMsgConfirmAction(nextStatus)}
        onCancel={handleClientMsgCancel}
      />
    );
  };

  // Handler for confirming the client message action (START/COMPLETED)
  const handleClientMsgConfirmAction = (nextStatus: string) => {
    console.log('handleClientMsgConfirmAction called with nextStatus:', nextStatus);
    console.log('Current recieveCompanionMsgQueue:', recieveCompanionMsgQueue);

    // Update local store
    useCompanionStore.getState().setCompanionAcvitiyMonitor({
      recieveCompanionMsgQueue: {
        ...recieveCompanionMsgQueue,
        status: nextStatus,
      },
    });

    // Ensure type is present in the object sent to Firebase
    const instructionObj = {
      type: recieveCompanionMsgQueue?.type || '',
      ...(recieveCompanionMsgQueue || {}),
      status: nextStatus,
    };


    // Update client's Firebase sendClientMsgQueue with the new status and type
    updateValueInClient({
      path: storePaths.ClientActivityMonitor.sendClientMsgQueue,
      val: instructionObj,
    });

    // Update companion's own Firebase sendCompanionMsgQueue with the new status
    updateInSelfFirebase(
      storePaths.CompanionAcvitiyMonitor.recieveCompanionMsgQueue,
      instructionObj
    );
    closeModal();
  };

  // Handler for cancelling opening the client message
  const handleClientMsgCancel = () => {
    closeModal();
  };

  // Handler for sub-mode selection
  const handleSubModeSelection = (subMode: string) => {
    setSelectedSubMode(subMode);
    // Add more logic here if needed in the future
    updateValueInClient({
      path: storePaths.CompanionAcvitiyMonitor.selectedSubMode,
      val: subMode,
    });
    // Update in self Firebase as well
    updateInSelfFirebase(storePaths.CompanionAcvitiyMonitor.selectedSubMode, subMode);
  };

  return (
    // Main container with flex column layout
    <div id="guard-matching-main-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
      

      <style>{`
      .mode-large-btn {
        min-width: 72px !important;
        min-height: 32px !important;
        font-size: 1.2rem !important;
        padding: 0.8rem 1.6rem !important;
        margin: 0.4rem !important;
      }
    `}</style>

      {recieveCompanionMsgQueue?.status && !serviceContinue && (
        <div
          id="client_msg_container"
          className={
            recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD
              ? 'blink-urgent'
              : recieveCompanionMsgQueue.status === MSG_STATUS.OPENED
                ? 'blink-urgent'
                : ''
          }
          style={{
            position: 'absolute',
            top: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            transition: 'background-color 0.2s, border-color 0.2s',
            marginBottom: '0.25rem',
            width: '90%',
            maxWidth: '500px',
            backgroundColor:
              recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD
                ? '#ffe5e5' // light red
                : recieveCompanionMsgQueue.status === MSG_STATUS.OPENED
                  ? 'rgb(241 220 150)' // custom yellow
                  : recieveCompanionMsgQueue.status === MSG_STATUS.ACTIONED
                    ? '#e5ffe5' // light green
                    : '#f9fafb', // subtle background
            border: '2px solid',
            borderColor:
              recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD
                ? 'red'
                : recieveCompanionMsgQueue.status === MSG_STATUS.OPENED
                  ? 'rgb(177 151 12)' // custom yellow border
                  : recieveCompanionMsgQueue.status === MSG_STATUS.ACTIONED
                    ? '#228B22' // dark green
                    : '#d1d5db', // default gray
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD
                ? '#ffe5e5'
                : recieveCompanionMsgQueue.status === MSG_STATUS.OPENED
                  ? 'rgb(241 220 150)'
                : recieveCompanionMsgQueue.status === MSG_STATUS.ACTIONED
                  ? '#e5ffe5'
                : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD
                ? '#ffe5e5'
                : recieveCompanionMsgQueue.status === MSG_STATUS.OPENED
                  ? 'rgb(241 220 150)'
                : recieveCompanionMsgQueue.status === MSG_STATUS.ACTIONED
                  ? '#e5ffe5'
                : '#f9fafb';
          }}
          onClick={handleClientMsgClick}
        >
          {/* Urgent icon for UNREAD */}
          {recieveCompanionMsgQueue.status === MSG_STATUS.UNREAD && (
            <span className="urgent-icon" title="Urgent">&#9888;</span>
          )}
          {/* Display the message if it exists */}
          <p style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <span style={{ fontWeight: 'normal', color: '#666' }}>Instruction:&nbsp;&nbsp;</span>
            <span style={{ fontWeight: 'bold' }}>
              {COMPANION_SCREEN_MAPPER[selectedMode]?.instructions[recieveCompanionMsgQueue.type]?.textToDisplay?.replace('Instruction: ', '') || recieveCompanionMsgQueue.type}
            </span>
            {/* Green tick for ACTIONED status */}
            {recieveCompanionMsgQueue.status === MSG_STATUS.ACTIONED && (
              <span style={{
                position: 'absolute',
                right: '10px',
                color: '#228B22',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                ✓
              </span>
            )}
          </p>
        </div>
      )}

      {'isDevMode' && (
        <div id="companion_role_display" style={{ width: '90%', maxWidth: 500, margin: '0 auto 0.5rem auto', border: '1px solid #333', borderRadius: 8, background: '#f0f0f0', padding: '0.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 300, color: '#333', textAlign: 'center' }}>
            YOUR ROLE
          </div>
          <div style={{ fontSize: '1.44rem', fontWeight: 700, color: '#007bff', textAlign: 'center', marginTop: '0.25rem' }}>
            {companionRole.toUpperCase()}
          </div>
        </div>
      )}
      {/* Mode/Status display above companion_mode_selection_container */}
      {!serviceContinue && 
              <div id="mode_and_status_info_display" style={{ width: '90%', maxWidth: 500, margin: '0 auto 0.5rem auto', border: '1px solid #222', borderRadius: 10, background: '#f0f0f0', padding: '0.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 300, color: '#333', textAlign: 'center' }}>
            {isPrimary ? 'MODE SELECTED' : 'YOUR STATUS'}
          </div>
          <div style={{ fontSize: '1.44rem', fontWeight: 700, color: 'red', textAlign: 'center', marginTop: '0.25rem' }}>
            {isPrimary ? (COMPANION_SCREEN_MAPPER[selectedMode]?.modeText || selectedMode || '-') : (COMPANION_SCREEN_MAPPER[selectedMode]?.statuses[companionCurrentStatus]?.textToDisplay || companionCurrentStatus || '-')}
          </div>
        {isPrimary && (
          <>
            {/* <div style={{ fontSize: '1rem', fontWeight: 300, color: '#333', textAlign: 'center', marginTop: '0.5rem' }}>
              STATUS
            </div> */}
            {/* <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#007bff', textAlign: 'center', marginTop: '0.25rem' }}>
              {COMPANION_SCREEN_MAPPER[selectedMode]?.statuses[companionCurrentStatus]?.textToDisplay || companionCurrentStatus || '-'}
            </div> */}
          </>
        )}
      </div>}

      {/* The rest of the main content, including serviceContinue check, goes here */}
      {!serviceContinue && <div>
        <div id="companion_mode_selection_container"
          style={{ marginTop: '10px', padding: '5px', width: '100%' }}>
          {/* Modes Container - hidden for secondary companions in production */}
          {(isPrimary || isDevMode) && (
            <div id="modes_container" className="rounded-xl shadow-lg">
              <div className="border rounded-lg flex flex-wrap justify-center items-center p-2 mb-2">
                <button className={selectedMode === ACTIVITY_MODES.CAFE ? selectedButtonClasses : buttonClasses}
                  onClick={() => handleModeSelection(ACTIVITY_MODES.CAFE)}>
                  {COMPANION_MODE_BUTTON_LABELS[ACTIVITY_MODES.CAFE]}
                </button>
                <button className={selectedMode === ACTIVITY_MODES.STORE ? selectedButtonClasses : buttonClasses}
                  onClick={() => handleModeSelection(ACTIVITY_MODES.STORE)}>
                  {COMPANION_MODE_BUTTON_LABELS[ACTIVITY_MODES.STORE]}
                </button>
                <button className={selectedMode === ACTIVITY_MODES.WITH_YOU ? selectedButtonClasses : buttonClasses}
                  onClick={() => handleModeSelection(ACTIVITY_MODES.WITH_YOU)}
                >
                  {COMPANION_MODE_BUTTON_LABELS[ACTIVITY_MODES.WITH_YOU]}
                </button>
              </div>
            </div>
          )}
          {/* Status Container - hidden for primary companions in production */}
          {(!isPrimary || isDevMode) && (
            <div id="status_container" className="rounded-xl shadow-lg w-full" style={{ width: '100%' }}>
              <div className="border rounded-lg grid grid-cols-2 gap-3 p-3 w-full" style={{ width: '100%' }}>
                {/* Only render status buttons allowed for the selected mode */}
                {COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.map((status: string) => (
                  <button
                    key={status}
                    className={getStatusButtonClass(status, companionCurrentStatus, selectedMode)}
                    onClick={() => handleStatusSelection(status)}
                  >
                    {COMPANION_STATUS_BUTTON_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div id="mode_and_status_info" >
            {companionActivityStatus === ACTIVITY_STATUS.QUEUE && <CompanionActivityMode />}
          </div>

          {/* Sub Mode Selection Container - hidden for secondary companions in production */}
          {/* {selectedMode && ACTIVITY_SUB_MODE_LINKER[selectedMode as keyof typeof ACTIVITY_SUB_MODE_LINKER] && ACTIVITY_SUB_MODE_LINKER[selectedMode as keyof typeof ACTIVITY_SUB_MODE_LINKER].length > 0 && (isPrimary || isDevMode) && (
            <div id="companion_sub_mode_selection_container" className="rounded-xl shadow-lg mt-4">
              <div className="border rounded-lg flex flex-wrap justify-center items-center p-2 mb-2">
                {ACTIVITY_SUB_MODE_LINKER[selectedMode as keyof typeof ACTIVITY_SUB_MODE_LINKER].map((subMode: string) => (
                  <button
                    key={subMode}
                    className={selectedSubMode === subMode ? selectedButtonClasses : buttonClasses}
                    style={{ minWidth: '84px', padding: '0.35rem 1.05rem', fontSize: '0.7rem', margin: '0.175rem' }}
                    onClick={() => handleSubModeSelection(subMode)}
                  >
                    {subMode}
                  </button>
                ))}
              </div>
            </div>
          )} */}
          


        </div>

        <div id="stopwatch_section" className="h-[40%] flex flex-col items-center justify-center border-gray-700 mt-1 mb-1">
          <StopWatch
            isRunning={true}
          />
        </div>
      </div>}


      {/* Companion Session Connection Status Section */}
      <div className="flex flex-col items-center justify-center p-2 mt-4">
        <div className="text-center">
          {/* Display Companion Session ID in Dev Mode Only */}
          {isDevMode && useCompanionStore.getState().getSessionId() && (
            <div className="mb-2 text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
              {useCompanionStore.getState().getSessionId()}
            </div>
          )}
          
          {/* Display Client Session ID in Dev Mode Only */}
          {isDevMode && useCompanionStore.getState().getClientSessionId() && (
            <div className="mb-2 text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
              Client: {useCompanionStore.getState().getClientSessionId()}
            </div>
          )}
          
          {/* Display Client's Current Mode for Secondary Companions */}
          {isDevMode && (
            <div className="mb-2 text-xs text-gray-600 font-mono bg-blue-100 px-2 py-1 rounded">
              Client Mode: {selectedModeForSecondary}
            </div>
          )}
          
          {useCompanionStore.getState().getSessionId() ? (
            <button 
              onClick={handleCompanionSessionRestore}
              disabled={isConnecting}
              className={`mt-1 px-3 py-1.5 rounded-lg text-sm ${
                isConnecting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isConnecting ? 'Refreshing...' : 'Refresh'}
            </button>
          ) : (
            <button
              onClick={handleCompanionSessionRestore}
              disabled={isConnecting}
              className={`mt-1 px-3 py-1.5 rounded-lg text-sm ${
                isConnecting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {isDevMode && <div id="manual_clientsession_id_input_container" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter Client Session ID"
          value={manualSessionId}
          onChange={(e) => setManualSessionId(e.target.value)}
          style={{ marginRight: '10px', padding: '0.5rem' }}
        />
        <button
          onClick={() => onceClientSessionIdFound(manualSessionId)} // Call onceClientSessionIdFound with input value
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            padding: '0.5rem 1rem',
          }}
        >Submit Session ID</button>
      </div>}

      {/* Manual Companion Session ID Input Container (Dev Mode Only) */}
      {isDevMode && <div id="manual_companion_session_id_input_container" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input
          ref={manualCompanionSessionIdRef}
          type="text"
          placeholder="Enter Companion Session ID"
          style={{ marginRight: '10px', padding: '0.5rem' }}
        />
        <button
          onClick={() => handleManualCompanionSessionIdSubmitLocal(manualCompanionSessionIdRef.current?.value || '')}
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            padding: '0.5rem 1rem',
          }}
        >Connect Companion to Session</button>
      </div>}


      {/* <CompanionActivityMode /> */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
        <div id={qrCodeRef.current} style={{ width: '100%', maxWidth: '500px' }}></div>
        {qrData && <p>Scanned Data: {qrData}</p>}
      </div>


      {serviceContinue && <button onClick={scanning ? stopScanning : startScanning} style={{ position: 'fixed', bottom: '6rem', width: '70%', maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))', color: 'white', padding: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
      >{scanning ? 'Stop Scan' : 'Start Scan'}</button>}

      {!serviceContinue && <button id="end-service-button"
        style={
          {
            position: 'fixed',
            bottom: '3rem', // Reduced bottom to 3rem
            width: '40%', // Reduced width to 40%
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'red',
            color: 'white',
            padding: '0.5rem', // Reduced padding for smaller height
            borderRadius: '9999px', // Added rounded corners (full rounded)
            fontSize: '0.9rem', // Reduced font size
            marginLeft: 'auto',
            marginRight: 'auto',
            // Adjust height as needed, padding contributes to height
            height: 'auto', // Set height to auto or a specific smaller value if preferred
          }
        }
        onClick={endCompanionService}>End Service</button>}
    </div>
  );
};

export default GuardMatchingPage;