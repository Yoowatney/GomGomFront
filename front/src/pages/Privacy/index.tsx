import { Link } from 'react-router-dom';

import Style from './style.module.scss';

const Privacy = () => {
  return (
    <div className={Style.Layout}>
      <div className={Style.Header}>
        <h1 className={Style.Title}>개인정보처리방침</h1>
      </div>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>수집하는 정보</h2>
        <div>
          서비스 이용 시 쿠키, 기기 정보가 자동으로 수집됩니다. 필요시 IP 주소가
          수집될 수 있습니다.
        </div>

        <h2 className={Style.SectionTitle}>쿠키 및 광고</h2>
        <div>
          본 사이트는 Adfit과 Google AdSense를 통해 광고를 게재하며, 이 과정에서 쿠키가
          사용됩니다. Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className={Style.Link}
          >
            Google 광고 정책
          </a>
          에서 확인할 수 있습니다.
        </div>

        <h2 className={Style.SectionTitle}>문의</h2>
        <div>gomgomdiary@gmail.com</div>
      </section>

      <div className={Style.Navigation}>
        <Link to="/about" className={Style.NavLink}>
          서비스 소개 보기
        </Link>
        <Link to="/" className={Style.NavLink}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default Privacy;
