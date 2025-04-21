import { createContext, useContext, useState, ReactNode ,React } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface IModalContextProps {
  modalContent: ReactNode | null;
  setModalContent: (content: ReactNode | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onCloseCallback: ((data?: any) => void) | undefined;
  setOnCloseCallback: (onClose?: ((data?: any) => void) | undefined) => void;
  title: string | undefined;
  setTitle: (title: string | undefined) => void;
}

const IModalContext = createContext<IModalContextProps>({
  modalContent: null,
  setModalContent: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  onCloseCallback: undefined,
  setOnCloseCallback: () => {},
  title: undefined,
  setTitle: () => {},
});

export const useModal = () => useContext(IModalContext);

interface ModalProviderProps{
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [onCloseCallback, setOnCloseCallback] = useState<((data?: any) => void) | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  return <IModalContext.Provider value={{ modalContent, setModalContent, isModalOpen, setIsModalOpen, onCloseCallback, setOnCloseCallback, title, setTitle }}>{children}</IModalContext.Provider>
};
 
export const Modal: React.FC = () => {
  const { modalContent, isModalOpen, setIsModalOpen, title , onCloseCallback , setModalContent} = useModal();
  
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          
          setIsModalOpen(false);
          setModalContent(null);
          if (onCloseCallback) {
            onCloseCallback();
          }
        }
      }}
    >
      <DialogContent className={"min-w-[400px]"}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};