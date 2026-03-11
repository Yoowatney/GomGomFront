import { Link } from 'react-router-dom';

import Style from './style.module.scss';

const Terms = () => {
  return (
    <div className={Style.Layout}>
      <div className={Style.Header}>
        <h1 className={Style.Title}>이용약관</h1>
      </div>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>서비스 소개</h2>
        <div>
          곰곰 다이어리는 익명으로 다이어리를 작성하고 공유할 수 있는 플랫폼입니다.
        </div>

        <h2 className={Style.SectionTitle}>이용자 책임</h2>
        <div>
          이용자가 작성한 모든 콘텐츠에 대한 책임은 전적으로 작성자 본인에게
          있습니다. 서비스 이용 시 관련 법령을 준수해 주세요.
        </div>

        <h2 className={Style.SectionTitle}>정보 제공 정책</h2>
        <ul className={Style.List}>
          <li>
            서비스는 개인의 요청으로 다른 이용자의 정보를 제공하지 않습니다.
          </li>
          <li>
            단, 수사기관(경찰 등)의 공식적인 협조 요청이 있을 경우 관련 법령에
            따라 정보를 제공할 수 있습니다.
          </li>
        </ul>

        <h2 className={Style.SectionTitle}>주의사항</h2>
        <div>
          타인에게 피해를 주거나 성희롱, 명예훼손 등의 내용을 작성할 경우
          관련 법령에 따라 처벌받을 수 있습니다. 네티켓을 지켜주세요.
        </div>

        <h2 className={Style.SectionTitle}>문의</h2>
        <div>gomgomdiary@gmail.com</div>
      </section>

      <div className={Style.Navigation}>
        <Link to="/privacy" className={Style.NavLink}>
          개인정보처리방침
        </Link>
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

export default Terms;
