import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { useCompanionStore} from '@/store/store';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ui/Modal';

const QRCodeHandler: React.FC = () => {
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const { sessionId } = useCompanionStore();
  const router = useRouter();
  const { closeModal } = useModal();
  const generateQRCode = () => {
    if (sessionId) {
      setQrCodeData(sessionId);
    }
  };

  const resetQRCode = () => {
    setQrCodeData('');
  };

  const startService = () => {
    router.push('/in-service');
    closeModal();
  };

  useEffect(() => {
    generateQRCode()
  }, []);

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <QRCodeCanvas value={qrCodeData} size={150} />
      <Button onClick={startService}>
        Start Service
      </Button>
    </div>
  );
};
export default QRCodeHandler;
