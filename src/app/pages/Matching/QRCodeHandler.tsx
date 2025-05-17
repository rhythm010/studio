import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';

const QRCodeHandler: React.FC = () => {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const generateQRCode = () => {
 setQrCodeData('Companion123');
  };

  const resetQRCode = () => {
    setQrCodeData('');
  };

  useEffect(() => {
    generateQRCode()
  }, []);

  return (
    <div className="flex items-center justify-center flex-col" onClick={generateQRCode}>
      <QRCodeCanvas value={qrCodeData} size={150} />
    </div>
  );
};

export default QRCodeHandler;
