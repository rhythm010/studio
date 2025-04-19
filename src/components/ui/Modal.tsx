import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ModalContextProps {
  openModal: (content: ReactNode, size?: "sm" | "md" | "lg" | "xl", onClose?: (data?: any) => void) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextProps>({
  openModal: () => {},
  closeModal: () => {},
  isOpen: false,
});

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [onCloseCallback, setOnCloseCallback] = useState<(data?: any) => void | undefined>(undefined);

  const openModal = useCallback((content: ReactNode, size: "sm" | "md" | "lg" | "xl" = "md", onClose?: (data?: any) => void) => {
    setContent(content);
    setSize(size);
    setOnCloseCallback(()=>onClose);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if(onCloseCallback) {
        onCloseCallback()
    }
  }, [onCloseCallback]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if(!open) {
          closeModal();
        }
      }}>
        <DialogContent
          className={`px-4 sm:px-6 sm:max-w-[${
            size === "sm" ? "425px" : size === "md" ? "525px" : size === "lg" ? "725px" : "925px"
          }]`}
        >
          {content}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};