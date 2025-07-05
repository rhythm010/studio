"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCompanionStore } from '@/store/store'; // Import the store
import { checkIfSessionExistsAndMatch, updateStoreInFirebase, updateCompanionSessionIdInClient,updateValueInClient, storePaths } from '@/lib/utils'; // Import the utility method
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ui/Modal';

const GuardMatchingPage: React.FC = () => {
  const qrCodeRef = useRef<string>('reader');
  const { getCompanionProfileDetails } = useCompanionStore();
  const html5Qrcode = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const {
    companionQueueManage, // Get the companionQueueManage object
    setCompanionQueueManage, // Get the setter for companionQueueManage
  } = useCompanionStore(); // Ensure you are getting the setCompanionQueueManage setter
  const {
    companionRestaurantManage, // Get the companionRestaurantManage object
    setCompanionRestaurantManage, // Get the setter for companionRestaurantManage
  } = useCompanionStore(); // Ensure you are getting the setCompanionQueueManage setter
  const [currentPosition, setCurrentPosition] = useState(0); // State for queue position
  const { openModal, closeModal } = useModal();
  const setCompanionQueuePosition = useCompanionStore((state) => state.setCompanionQueuePosition);
  const [serviceContinue, setserviceContinue] = useState(true);
  const [qrData, setQrData] = useState('');
  const setMatchingDone = useCompanionStore((state) => state.setMatchingDone); // Get the setter from the store
  const setClientSessionId = useCompanionStore((state) => state.setClientSessionId); // Get the setter for clientSessionId
  const {
    setQueueActivated, // Get the setter for queueActivated
    isDevMode,
  } = useCompanionStore();
  const [manualSessionId, setManualSessionId] = useState(''); // State for manual session ID input
  const router = useRouter();
  const companionRole = getCompanionProfileDetails().companionRole; // Get the companion role

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
  };

  const onceClientSessionIdFound = (ClientSessionId: any) => {
    const companionSessionId = useCompanionStore.getState().getSessionId();
    // console.log("Manual session ID found:", ClientSessionId); // Add logging for manual session ID
    setClientSessionId(ClientSessionId);
    updateCompanionSessionIdInClient(ClientSessionId, companionSessionId, companionRole);
    updateStoreInFirebase();
    scanSuccess();
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

  const resetQueue = () => {
    setCurrentPosition(0);
    // Update the store
    setCompanionQueueManage({
      ...companionQueueManage,
      currentPosition: 0,
      queueActivated: false // Assuming you want to deactivate the queue on reset
    });

  }

  const EndQueueMode = () => {
    console.log("Ending Queue Mode.");
    setQueueActivated(false);
    resetQueue();
  };

  const updateQueueValue = (delta: number) => {
    setCurrentPosition(prevPosition => {
      const newPosition = prevPosition + delta;
      return Math.max(0, Math.min(15, newPosition)); // Ensure value stays between 0 and 10
    });
    // Update the store
    setCompanionQueueManage({
      ...companionQueueManage,
      currentPosition: Math.max(0, Math.min(10, currentPosition + delta))
    });
  };

  const activateQueueMode = () => {
    setQueueActivated(true);
  };

  const activateRestaurantMode = () => {
    setCompanionRestaurantManage({
      ...companionRestaurantManage,
      isActive: true,
    });
    console.log("Restaurant mode activated", companionRestaurantManage.isActive);
  };

  const activateCafeMode = () => {
    updateValueInClient({
      path: storePaths.ClientActivityMonitor.currentMode,
      val: 'CAFE'
    });
  }

  const showClientMsg = () => {
    console.log("Showing client messages...");
    openModal(<div>Restaurant Messages</div>);
    // You can add logic here to fetch or process client messages if needed
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {companionRole && <p style={{ width: '16rem', textAlign: 'center', backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))', color: 'white', padding: '0.5rem', fontSize: '1.2rem' }}>Role: {companionRole} Companion</p>}

      {/* Div for Activate Queue Mode button */}

      {/* Input for manual session ID */}
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

      {!serviceContinue && <div id="action_buttons" style={{ border: '1px solid black', marginTop: '20px', padding: '10px' }}>
        <button
          style={{
            backgroundColor: companionQueueManage.queueActivated ? 'lightgray' : 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem', // Slightly smaller font size
            cursor: companionQueueManage.queueActivated ? 'not-allowed' : 'pointer',
          }}
          onClick={companionQueueManage.queueActivated ? undefined : activateQueueMode}
          disabled={companionQueueManage.queueActivated}
        >
          Activate Queue mode
        </button>
        <button
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem', // Slightly smaller font size
            cursor: 'pointer',
            marginTop: '1rem',
          }}
          onClick={activateCafeMode}
        >Activate Cafe Mode
        </button>
      </div>}

      {companionQueueManage.queueActivated && (<div id="Queue_mode" style={{ border: '1px solid black', marginTop: '20px', width: '70%', maxWidth: '500px', textAlign: 'center', paddingBottom: '5px' }}>
        <div style={{ borderBottom: '1px solid black', paddingBottom: '5px', padding: '10px' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Queue Mode Active</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(-1)}>-</button>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{currentPosition}</div>
          <button style={{ fontSize: '2rem', padding: '10px 20px' }} onClick={() => updateQueueValue(1)}>+</button>
        </div>
        <button
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            padding: '0.5rem',
            marginTop: '10px',
            color: 'white',
          }}
          onClick={EndQueueMode} // Call EndQueueMode function
        >
          End Queue mode
        </button>
      </div>)}
      {/* {errorMessage && <ErrorBanner errorMessage={errorMessage} />} Display error banner */}

      {companionRestaurantManage.isActive && (<div id="Restaurant_mode" style={{ border: '1px solid black', marginTop: '20px', width: '70%', maxWidth: '500px', textAlign: 'center', paddingBottom: '5px' }}>
        <div style={{ borderBottom: '1px solid black', paddingBottom: '5px', padding: '10px' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Restaurant Mode Active</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
          <button onClick={() => {
            showClientMsg(); // Call the new method
          }} style={{
            fontSize: '1rem',
            padding: '1rem',
            border: '1px solid black',
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            color: 'white',
            marginLeft: 'auto',
            marginRight: 'auto' }}>Msgs</button>
        </div>
        <button
          style={{
            backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))',
            padding: '0.5rem',
            marginTop: '10px',
            color: 'white',
          }}
          onClick={() => setCompanionRestaurantManage({...companionRestaurantManage, isActive: false})} // Call EndQueueMode function
        >
          End Restaurant Mode
        </button>
      </div>)}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
        <div id={qrCodeRef.current} style={{ width: '100%', maxWidth: '500px' }}></div>
        {qrData && <p>Scanned Data: {qrData}</p>}
      </div>
      {serviceContinue && <button onClick={scanning ? stopScanning : startScanning} style={{ position: 'fixed', bottom: '6rem', width: '70%', maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))', color: 'white', padding: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
      >{scanning ? 'Stop Scan' : 'Start Scan'}</button>}
      {!serviceContinue && <button style={{ position: 'fixed', bottom: '6rem', width: '70%', maxWidth: '500px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
        onClick={endCompanionService}>End Service</button>}
    </div>
  );
};

export default GuardMatchingPage;