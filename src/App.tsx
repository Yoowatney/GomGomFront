import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Outlet } from 'react-router-dom';

import Ad from './Ad';
import Style from './App.module.scss';
import FallingLeaves from './components/FallingLeaves';
import Header from './components/Header';

function App() {
  useEffect(() => {
    ReactGA.initialize(
      `${import.meta.env.VITE_APP_GOOGLE_ANALYTICS_TRACKING_ID}`,
    );
  }, []);

  return (
    <div className={Style.AppContent}>
      <FallingLeaves />
      <Header />
      <main className={Style.MainContent}>
        <Outlet />
      </main>
      <div className={Style.Ad}>
        <Ad unit={'DAN-ZGJjaUD6AoC29nFb'} width={320} height={50} />
      </div>
    </div>
  );
}

export default App;
