import { useEffect, useRef } from 'react';

interface AdProps {
  unit: string;
  width: number;
  height: number;
}

const Ad = ({ unit, width, height }: AdProps) => {
  const ins = useRef<HTMLModElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    if (ins.current) {
      ins.current.appendChild(script);
    }

    return () => {
      if (ins.current) {
        ins.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <ins
      ref={ins}
      className="kakao_ad_area"
      style={{ display: 'none' }}
      data-ad-unit={unit}
      data-ad-width={width}
      data-ad-height={height}
    />
  );
};

export default Ad;