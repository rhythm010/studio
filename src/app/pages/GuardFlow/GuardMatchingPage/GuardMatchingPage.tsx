"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCompanionStore } from '@/store/store'; // Import the store
import { checkIfSessionExistsAndMatch, updateStoreInFirebase } from '@/lib/utils'; // Import the utility method
import ErrorBanner from '@/components/ErrorBanner';
import { useRouter } from 'next/navigation';

const GuardMatchingPage: React.FC = () => {
  const qrCodeRef = useRef<string>('reader');
  const { getCompanionProfileDetails } = useCompanionStore(); // Get the getter from the store
  const html5Qrcode = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null); // State for error message
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const [serviceContinue, setserviceContinue] = useState(true);
  const [qrData, setQrData] = useState('');
  const setMatchingDone = useCompanionStore((state) => state.setMatchingDone); // Get the setter from the store
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

  const QRCodeAnalyze = async (decodedData: string) => {
    if (decodedData) {
      const success = await checkIfSessionExistsAndMatch(decodedData);
      if (success) {
        scanSuccess();
      } else {
        // error handling
        setErrorMessage('Matching session not found.'); // Set error message state
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {companionRole && <p style={{ width: '16rem', textAlign: 'center', backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity, 1))', color: 'white', padding: '0.5rem', fontSize: '1.2rem' }}>Role: {companionRole} Companion</p>}
      {errorMessage && <ErrorBanner errorMessage={errorMessage} />} {/* Display error banner */}
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