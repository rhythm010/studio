import { createContext, useContext, useState, ReactNode ,React } from "react";
import { Dialog, DialogContent ,DialogTitle} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface IModalContextProps {
  modalContent: ReactNode | null; // Added
  closeModal: () => void;
  openModal: (content: ReactNode) => void;
  setModalContent: (content: ReactNode | null) => void; // Added
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onCloseCallback: ((data?: any) => void) | undefined;
  setOnCloseCallback: (onClose?: ((data?: any) => void) | undefined) => void;
}

const IModalContext = createContext<IModalContextProps>({
  modalContent: null,
  closeModal: () => { },
  openModal: () => { },
  setModalContent: () => { },
  isModalOpen: false,
  setIsModalOpen: () => { },
  onCloseCallback: undefined,
  setOnCloseCallback: () => { },
});
export const useModal = () => {
  const context = useContext(IModalContext); // Updated
  if (context === undefined) throw new Error('useModal must be used within a ModalProvider');
  return context;
}

interface ModalProviderProps {
  title?: string; // This prop seems unnecessary if title is handled by ConfirmationModalContent
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, title = 'Modal Title' }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [onCloseCallback, setOnCloseCallback] = useState<((data?: any) => void) | undefined>(undefined);


  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);

  };

  return <IModalContext.Provider value={{ closeModal, openModal, modalContent, setModalContent, isModalOpen, setIsModalOpen, onCloseCallback, setOnCloseCallback }}>{children}<Modal /></IModalContext.Provider>; // Updated
};

interface IModalProps { }
export const Modal: React.FC<IModalProps> = ({ title }) => {
  const { modalContent, isModalOpen, closeModal } = useModal(); // Updated
  return (
    <Dialog open={isModalOpen}>
      <DialogContent className={"w-[280px] min-h-[500px] rounded-lg"}>
        <div className="flex justify-between items-center h-12 bg-gray-800 p-2 mb-2 rounded-t-lg">
          <div className="w-full flex justify-center">
          <DialogTitle className="text-lg font-bold text-white hidden">
            {title}
          </DialogTitle>
          </div>
           <div onClick={closeModal} className="p-1 rounded-md hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-white" />
           </div>
        </div>
        <div className="p-1">
          {modalContent}
          </div>
      </DialogContent>
    </Dialog>
  );
};