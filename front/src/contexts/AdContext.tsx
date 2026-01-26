import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface AdContextType {
  showAd: boolean;
  setShowAd: (show: boolean) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const [showAd, setShowAd] = useState(true);

  return (
    <AdContext.Provider value={{ showAd, setShowAd }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAd = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};
