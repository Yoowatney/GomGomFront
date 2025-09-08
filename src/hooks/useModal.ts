import { type ReactNode, useCallback, useState } from 'react';
interface ModalContent {
  title: string;
  description?: string;
  onConfirmCallback: () => void;
  onCancelCallback?: () => void;
  children?: ReactNode;
}

interface IModalReturn {
  isOpen: boolean;
  modalContent: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
}

export const useModal = (): IModalReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const openModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  return {
    isOpen,
    modalContent,
    openModal,
    closeModal,
  };
};
