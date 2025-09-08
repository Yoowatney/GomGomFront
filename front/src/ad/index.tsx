import { useEffect,useRef } from 'react';

interface IAd {
  unit: string;
  width: number;
  height: number;
}

const Ad = (props: IAd) => {
  const scriptElement = useRef<HTMLDivElement | null>(null);
  const { unit, width, height } = props;

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://t1.daumcdn.net/kas/static/ba.min.js');
    script.setAttribute('charset', 'utf-8');
    if (scriptElement.current) {
      scriptElement.current.appendChild(script);
    }

    return () => {
      const globalAdfit = window.adfit;
      if (globalAdfit) globalAdfit.destroy(unit);
    };
  }, []);

  return (
    <div ref={scriptElement}>
      <ins className='kakao_ad_area'
        style={{ display: 'none '}}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  );
};

export default Ad;