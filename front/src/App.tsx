// import FallingLeaves from './components/FallingLeaves';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Outlet } from 'react-router-dom';

import Style from './App.module.scss';
import Header from './components/Header';

function App() {
  useEffect(() => {
    ReactGA.initialize(
      `${import.meta.env.VITE_APP_GOOGLE_ANALYTICS_TRACKING_ID}`,
    );
  }, []);

  return (
    <div className={Style.AppContent}>
      {/* <FallingLeaves /> */}
      <Header />
      <main className={Style.MainContent}>
        <Outlet />
      </main>
      <Analytics />
    </div>
  );
}

export default App;
