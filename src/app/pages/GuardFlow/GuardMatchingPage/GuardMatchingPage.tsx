"use client";

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useCompanionStore } from '@/store/store'; // Import the store
import { updateStoreInFirebase } from '@/lib/utils'; // Import the utility method
import { useRouter } from 'next/navigation';

const GuardMatchingPage: React.FC = () => {
  const qrCodeRef = useRef<string>('reader');
  const html5Qrcode = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState('');
  const setMatchingDone = useCompanionStore((state) => state.setMatchingDone); // Get the setter from the store
  const router = useRouter();

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

  const QRCodeAnalyze = (decodedData: string) => {
    if (decodedData === 'Companion123') {
      console.log("QR code matched 'Companion123'. Updating matching status in store and Firebase.");
      setMatchingDone(true); // Update matchingDone in the store
      updateStoreInFirebase(); // Call the utility method to update Firebase
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={scanning ? stopScanning : startScanning}>{scanning ? 'Stop Scan' : 'Start Scan'}</button>
      <div id={qrCodeRef.current} style={{ width: '100%', maxWidth: '500px' }}></div>
      {qrData && <p>Scanned Data: {qrData}</p>}
    </div>
  );
};

export default GuardMatchingPage;