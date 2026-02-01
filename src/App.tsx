// import FallingLeaves from './components/FallingLeaves';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Outlet } from 'react-router-dom';

import Ad from './Ad';
import Style from './App.module.scss';
import Header from './components/Header';
import { AdProvider, useAd } from './contexts/AdContext';

function AppContent({ showAdProp = true }: { showAdProp?: boolean }) {
  const { showAd: showAdContext } = useAd();

  useEffect(() => {
    ReactGA.initialize(
      `${import.meta.env.VITE_APP_GOOGLE_ANALYTICS_TRACKING_ID}`,
    );
  }, []);

  // prop과 context 모두 true일 때만 광고 표시
  const shouldShowAd = showAdProp && showAdContext;

  return (
    <div className={Style.AppContent}>
      {/* <FallingLeaves /> */}
      <Header />
      <main className={Style.MainContent}>
        <Outlet />
      </main>
      {shouldShowAd && (
        <div className={Style.Ad}>
          <Ad unit={'DAN-ZGJjaUD6AoC29nFb'} width={320} height={50} />
        </div>
      )}
      <Analytics />
    </div>
  );
}

function App({ showAd = true }: { showAd?: boolean }) {
  return (
    <AdProvider>
      <AppContent showAdProp={showAd} />
    </AdProvider>
  );
}

export default App;
