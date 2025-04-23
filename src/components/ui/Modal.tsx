import { createContext, useContext, useState, ReactNode ,React } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface IModalContextProps {
  modalContent: ReactNode | null;
  closeModal: () => void;
  openModal: (content: ReactNode) => void;
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
  closeModal: () => {},
  openModal: () => {},
  setModalContent: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  onCloseCallback: undefined,
  setOnCloseCallback: () => {},
  title: undefined,
  setTitle: () => {},
});
export const useModal = () => {
  const context = useContext(IModalContext);
  if (context === undefined) throw new Error('useModal must be used within a ModalProvider');
  return context;
}

interface ModalProviderProps{
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [onCloseCallback, setOnCloseCallback] = useState<((data?: any) => void) | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  const openModal = (content: ReactNode) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);

  };

  return <IModalContext.Provider value={{ modalContent, setModalContent, isModalOpen, setIsModalOpen, onCloseCallback, setOnCloseCallback, title, setTitle, openModal }}>{children}</IModalContext.Provider>
};
 
export const Modal: React.FC = () => {
  const { modalContent, isModalOpen, title , onCloseCallback , closeModal} = useModal();
  
  return (
    <Dialog
      open={isModalOpen}      
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
          onCloseCallback && onCloseCallback();

        }
      }}
    >
      <DialogContent className={"w-[300px] min-h-[400px]"}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};