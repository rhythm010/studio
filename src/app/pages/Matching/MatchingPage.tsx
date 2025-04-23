import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCodeHandler from './QRCodeHandler';


const MatchingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isReset, setIsReset] = useState<boolean>(false);

    useEffect(() => {
        if (isReset) {
            setIsLoading(true);
        }
    }, [isReset]);

    useEffect(() => {
        if (isLoading) {
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [isLoading]);

    const handleReset = () => {
        setIsReset(true);
        setTimeout(() => {
            setIsReset(false);
        }, 1000);
    };
  return (
    <div>
      <div
        id="matching_page_container"
        key={isReset}
        className="w-full flex flex-col items-center justify-center"
      >
        {isLoading && (
          <Loader2 className="transition-all duration-1000 animate-spin h-24 w-24" />
        )}
        {!isLoading && (
          <div id="QR_code_container" className="mt-5">
            <QRCodeHandler />
          </div>
        )}
        {/* <Button className="mt-5" onClick={handleReset}>
          reset
        </Button> */}
      </div>
        </div>
    );
};

export default MatchingPage;
