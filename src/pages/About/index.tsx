import { Link } from 'react-router-dom';

import Style from './style.module.scss';

const About = () => {
  return (
    <div className={Style.Layout}>
      <div className={Style.Header}>
        <img
          src="/image/gomgom/logo.png"
          alt="곰곰 로고"
          className={Style.Logo}
          width={100}
          height={100}
        />
      </div>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>
          안녕하세요, 곰곰 다이어리 개발팀입니다.
        </h2>
        <div>
          상대에 대해 곰곰이 생각하고 답하는 소중한 시간을 위해 프로젝트를
          만들었습니다.
        </div>

        <h2 className={Style.SectionTitle}>곰곰 다이어리는...</h2>
        <ul className={Style.List}>
          <li>2023.12 첫 배포 및 서비스 시작</li>
          <li>2024.11 누적 트래픽 203만 돌파</li>
        </ul>

        <h2 className={Style.SectionTitle}>연락망</h2>
        <div className={Style.ContactItem}>
          <h3>Email</h3>
          <div>gomgomdiary@gmail.com</div>
        </div>

        <h2 className={Style.SectionTitle}>공식 계정</h2>
        <div className={Style.ContactItem}>
          <h3>Instagram</h3>
          <a
            href="https://www.instagram.com/gom._.gom._.diary/"
            target="_blank"
            rel="noopener noreferrer"
            className={Style.Link}
          >
            인스타그램 바로가기
          </a>
        </div>

        <h2 className={Style.SectionTitle}>문의하기</h2>
        <p>
          메일 및 인스타그램으로도 문의 가능하지만 빠른 답변을 원하신다면
          카카오톡 문의를 부탁드립니다.
        </p>
        <a
          href="https://open.kakao.com/o/sea7Ql3g"
          target="_blank"
          rel="noopener noreferrer"
          className={Style.Button}
        >
          카카오톡 문의하기
        </a>
      </section>

      <div className={Style.Navigation}>
        <Link to="/faq" className={Style.NavLink}>
          자주 묻는 질문 보기
        </Link>
        <Link to="/privacy" className={Style.NavLink}>
          개인정보처리방침
        </Link>
        <Link to="/" className={Style.NavLink}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default About;
