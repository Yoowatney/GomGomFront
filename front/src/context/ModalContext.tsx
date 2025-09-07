import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ModalContextType {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = useCallback((id: string) => {
    setModals((prev) => ({ ...prev, [id]: true }));
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => ({ ...prev, [id]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({});
  }, []);

  return (
    <ModalContext.Provider
      value={{ modals, openModal, closeModal, closeAllModals }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useGlobalModal = (id: string) => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within ModalProvider');
  }

  return {
    isOpen: context.modals[id] || false,
    openModal: () => context.openModal(id),
    closeModal: () => context.closeModal(id),
  };
};
