"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCompanionStore } from '@/store/store'; // Import the store
import { checkIfSessionExistsAndMatch, updateStoreInFirebase, updateCompanionSessionIdInClient, updateValueInClient, storePaths, sendMsgToClient, listenToClientMessages } from '@/lib/utils'; // Import the utility method
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ui/Modal';
import CompanionActivityMode from '../CompanionActivityMode/CompanionActivityMode';
import ActivityStatusQueue from '../../InService/ActivityStatusQueue/ActivityStatusQueue';
import { ACTIVITY_MODES, ACTIVITY_STATUS, COMPANION_MODE_STATUS_LINKER } from '@/lib/constants';
import StopWatch from '../../InService/StopWatch';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';
import { vocab } from '@/lib/vocab_constants';

const GuardMatchingPage: React.FC = () => {
  // Reusable classes for the mode selection buttons, similar to the 'Start Scan' button style
  const selectedButtonClasses = "border w-20 h-10 m-1 flex items-center justify-center bg-green-600 text-white text-sm rounded-md"; // Dark green background for selected button
  const disabledButtonClasses = "w-20 h-10 m-1 flex items-center justify-center bg-gray-400 text-gray-700 text-sm rounded-md"; // Grey background for disabled buttons
  const buttonClasses = "w-20 h-10 m-1 flex items-center justify-center bg-gray-800 text-white text-sm rounded-md";
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
  const [manualSessionId, setManualSessionId] = useState(''); // State for manual session ID input
  const router = useRouter();
  const companionRole = getCompanionProfileDetails().companionRole || 'Primary'; // Get the companion role
  // Get the selected mode from the store for conditional styling
  // Get the selected mode and current status from the store for conditional styling
  const { selectedMode, companionCurrentStatus } = useCompanionStore((state) => state.CompanionAcvitiyMonitor);
  const companionActivityStatus = useCompanionStore.getState().CompanionAcvitiyMonitor.companionCurrentStatus;

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
    updateStoreInFirebase();
    scanSuccess();
    listenToClientMessages();
  }

  const QRCodeAnalyze = async (decodedData: string) => {
    if (decodedData) {
      const ClientSessionId = await checkIfSessionExistsAndMatch(decodedData);
      if (ClientSessionId) {
        setClientSessionId(ClientSessionId); // Set the clientSessionId in the store
        onceClientSessionIdFound(ClientSessionId);
        updateStoreInFirebase();
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
          // stopScanning(); // Stop scanning after a successful scan
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

  const modeSelectionConfirmation = (mode: string) => {
    console.log(`Mode selected: ${mode}`);
    // Update the selectedMode within clientActivityMonitor.companionFlow in the store
    useCompanionStore.getState().setCompanionAcvitiyMonitor({
      selectedMode: mode, // Assuming selectedMode is a direct property of CompanionAcvitiyMonitor
    });

    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentMode,
      val: mode,
    });

    closeModal();
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

  const statusSelectionConfirmation = (status: string) => {
    // Update the selectedMode within clientActivityMonitor.companionFlow in the store
    useCompanionStore.getState().setCompanionAcvitiyMonitor({
      companionCurrentStatus: status, // Assuming selectedMode is a direct property of CompanionAcvitiyMonitor
    });

    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentStatus,
      val: status,
    });

    closeModal();

  }

  const handleStatusSelection = (status: string) => {
    openModal(
      <ConfirmationModalContent
        text={vocab.GuardMatchingPage.statusChangeModal[status.toUpperCase()]} // Customize the confirmation text
        onConfirm={() => {
          statusSelectionConfirmation(status);
        }}
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
    return isDisabled ? disabledButtonClasses : (status === currentStatus ? selectedButtonClasses : buttonClasses);
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

      {!serviceContinue && selectedMode && (
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          Selected Mode: {selectedMode}
        </div>
      )}

      {!serviceContinue && companionCurrentStatus && (
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          Selected Status: {companionCurrentStatus}
        </div>
      )}

      {!serviceContinue && companionRole &&
        <p id="companion_role_title" style={
          {
            width: '10rem',
            textAlign: 'center',
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '2rem',
          }}
        >Your Role: {companionRole}
        </p>}

      {isDevMode && <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
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

      {!serviceContinue && <div>

        <div id="stopwatch_section" className="h-[40%] flex flex-col items-center justify-center border-gray-700 mt-4">
          <StopWatch
            isRunning={true}
            startStop={() => { }}
            elapsedTime={2}
            setElapsedTime={() => { }}
          />

        </div>
        <div id="action_buttons"
          style={{ marginTop: '20px', padding: '10px' }}>
          <div id="modes_container" className="rounded-xl shadow-lg">
            <div className="border rounded-lg flex flex-wrap p-2 mb-2">
              {/* Button for Queue mode, conditionally apply dark green background if selected */}
              <button className={selectedMode === ACTIVITY_MODES.QUEUE ? selectedButtonClasses : buttonClasses}
                onClick={() => handleModeSelection(ACTIVITY_MODES.QUEUE)}>
                Queue
              </button>
              <button className={selectedMode === ACTIVITY_MODES.CAFE ? selectedButtonClasses : buttonClasses}
                onClick={() => handleModeSelection(ACTIVITY_MODES.CAFE)}>
                Cafe
              </button>
              <button className={selectedMode === ACTIVITY_MODES.STORE ? selectedButtonClasses : buttonClasses}
                onClick={() => handleModeSelection(ACTIVITY_MODES.STORE)}>
                Store
              </button>
              <button className={selectedMode === ACTIVITY_MODES.WITH_YOU ? selectedButtonClasses : buttonClasses}
                onClick={() => handleModeSelection(ACTIVITY_MODES.WITH_YOU)}
              >
                With client
              </button>
            </div>

          </div>
          <div id="mode_and_status_info" >
            {companionActivityStatus === ACTIVITY_STATUS.QUEUE && <CompanionActivityMode />}
            {companionActivityStatus !== ACTIVITY_STATUS.QUEUE &&
              <div id="status_info_helper">

              </div>
            }
          </div>
          {/* Status container with relative positioning for the overlay */}
          <div id="status_container" className="rounded-xl shadow-lg" style={{ position: 'relative' }}> {/* Added relative positioning for the overlay */}

            <div className="border rounded-lg flex flex-wrap p-2">
              {/* Status buttons, conditionally apply dark green background if status matches companionCurrentStatus */}
              <button
                className={getStatusButtonClass(ACTIVITY_STATUS.QUEUE, companionCurrentStatus, selectedMode)}
                disabled={!COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(ACTIVITY_STATUS.QUEUE)}
                onClick={() => handleStatusSelection(ACTIVITY_STATUS.QUEUE)}
              >
                Queue
              </button>
              <button
                className={getStatusButtonClass(ACTIVITY_STATUS.PAYMENT_CALL, companionCurrentStatus, selectedMode)}
                disabled={!COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(ACTIVITY_STATUS.PAYMENT_CALL)} // Disable if not allowed in selected mode
                onClick={() => handleStatusSelection(ACTIVITY_STATUS.PAYMENT_CALL)}>
                Payment
              </button>
              <button
                className={getStatusButtonClass(ACTIVITY_STATUS.WAIT_ITEM, companionCurrentStatus, selectedMode)}
                disabled={!COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(ACTIVITY_STATUS.WAIT_ITEM)} // Disable if not allowed in selected mode
                onClick={() => handleStatusSelection(ACTIVITY_STATUS.WAIT_ITEM)}>
                waiting for item
              </button>
              <button
                className={getStatusButtonClass(ACTIVITY_STATUS.WAIT_OP, companionCurrentStatus, selectedMode)}
                disabled={!COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(ACTIVITY_STATUS.WAIT_OP)} // Disable if not allowed in selected mode
                onClick={() => handleStatusSelection(ACTIVITY_STATUS.WAIT_OP)}>
                waiting OP
              </button>
              <button
                className={getStatusButtonClass(ACTIVITY_STATUS.DEFAULT, companionCurrentStatus, selectedMode)}
                disabled={!COMPANION_MODE_STATUS_LINKER[selectedMode as keyof typeof COMPANION_MODE_STATUS_LINKER]?.includes(ACTIVITY_STATUS.DEFAULT)} // Disable if not allowed in selected mode
                onClick={() => handleStatusSelection(ACTIVITY_STATUS.DEFAULT)}>
                Default
              </button>
              {/* Add more status buttons here following the same pattern */}

            </div>

          </div>
        </div>
      </div>

      }

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