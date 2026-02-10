import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ADSENSE_CLIENT = 'ca-pub-2613738949589026';
const ADSENSE_SCRIPT_ID = 'adsense-script';

// 콘텐츠가 있는 페이지 경로 (AdSense 정책: 콘텐츠가 있는 페이지에서만 광고 게재)
const CONTENT_PATHS = [
  '/blog',
  '/about',
  '/faq',
  '/privacy',
  '/terms',
];

function isContentPage(pathname: string): boolean {
  return CONTENT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );
}

export function useAdSense() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldLoad = isContentPage(pathname);

    if (shouldLoad && !document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (!shouldLoad) {
      const existing = document.getElementById(ADSENSE_SCRIPT_ID);
      if (existing) {
        existing.remove();
      }
    }
  }, [pathname]);
}
