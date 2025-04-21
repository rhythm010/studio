import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';

const QRCodeHandler: React.FC = () => {
  const [qrCodeData, setQrCodeData] = useState<string>('');

  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const generateQRCode = () => {
    setQrCodeData(generateRandomString());
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
