import { Link } from 'react-router-dom';

import Style from './style.module.scss';

const FAQ = () => {
  return (
    <div className={Style.Layout}>
      <div className={Style.Header}>
        <h1 className={Style.Title}>자주 묻는 질문</h1>
      </div>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>제가 주인인데 답장을 못 봐요 😭</h2>
        <div className={Style.Content}>
          <p>먼저 확인해주세요!</p>
          <ul className={Style.List}>
            <li>
              다이어리를 만든 기기와 확인하려는 기기가 같은가요?
              <br />
              <span className={Style.Example}>
                (스마트폰으로 만들고 아이패드로 확인 {'>'} ❌
                <br />
                스마트폰으로 만들고 스마트폰으로 확인 {'>'} ✅)
              </span>
            </li>
            <li>
              다이어리를 만든 경로와 확인하려는 경로가 같은가요?
              <br />
              <span className={Style.Example}>
                (카톡에서 만들고 인스타 스토리에서 확인 {'>'} ❌
                <br />
                카톡에서 만들고 카톡에서 확인 {'>'} ✅)
              </span>
            </li>
          </ul>
          <p>
            다이어리를 만들었을 때 쓴 기기와 경로로 확인해야 답장을 볼 수
            있어요!
          </p>
        </div>
      </section>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>다 같은데도 안 돼요! 😢</h2>
        <div className={Style.Content}>
          <p>아래 정보를 갖고 문의하셔야 빠르게 도와드릴 수 있어요!</p>
          <span></span>
          <ol className={Style.List}>
            <li>
              <span>다이어리 주소</span>
              <br />
              <span className={Style.Example}>
                (예: gomgomdiary.site/diary/1234567890)
              </span>
            </li>
            <li>
              <span>다이어리를 만들 때 쓴 이름, 암호, 암호에 대한 답</span>
              <br />
              <span className={Style.Example}>(예: 곰곰이, 1234, 1234)</span>
            </li>
          </ol>
          <a
            href="https://open.kakao.com/o/sea7Ql3g"
            target="_blank"
            rel="noopener noreferrer"
            className={Style.Button}
          >
            카카오톡으로 문의하기
          </a>
        </div>
      </section>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>익명성이 보장되나요?</h2>
        <div className={Style.Content}>
          <p>곰곰 다이어리는 기본적으로 익명성을 보장합니다.</p>
          <p>
            하지만 성희롱이나 타인에게 불쾌감을 주는 답장을 작성한 경우 처벌될
            수 있으므로 네티켓을 지켜주세요.
          </p>
          <ul className={Style.List}>
            <li>
              특정 작성자에 대한 정보를 임의로 제공하지 않습니다.
              <br />
              <span className={Style.SubText}>
                (단, 수사기관의 협조 요청이 있을 경우 적극 협조합니다.)
              </span>
            </li>
            <li>다이어리 관련 IP와 데이터를 기록하고 있습니다.</li>
          </ul>
        </div>
      </section>

      <section className={Style.Section}>
        <h2 className={Style.SectionTitle}>
          불쾌한 답장을 받았어요. 어떻게 하나요?
        </h2>
        <div className={Style.Content}>
          <p>곰곰 다이어리는 2가지 방안을 제안드립니다:</p>

          <div className={Style.OptionBox}>
            <div>1. 수사기관에 신고하기</div>
            <ul className={Style.List}>
              <li>
                성적으로 불쾌감을 줄 수 있는 표현은 성폭력범죄의 처벌 등에 관한
                특례법에 의거해 법적으로 대응할 수 있어요.
              </li>
              <li>
                단순 욕설의 경우, 모욕죄는 공연성과 특정성이 충족되어야 합니다.
              </li>
            </ul>
            <a
              href="https://ecrm.police.go.kr/minwon/main"
              target="_blank"
              rel="noopener noreferrer"
              className={Style.LinkButton}
            >
              사이버범죄 신고시스템 바로가기
            </a>
          </div>

          <div className={Style.OptionBox}>
            <div>2. [삭제된 답변입니다.]로 변경 요청하기</div>
            <p>아래 정보를 준비해서 문의해주세요:</p>
            <ol className={Style.List}>
              <li>다이어리 주소</li>
              <li>다이어리를 만들 때 쓴 이름, 암호, 암호에 대한 답</li>
              <li>삭제를 원하는 답장 작성자 이름</li>
            </ol>
            <a
              href="https://open.kakao.com/o/sea7Ql3g"
              target="_blank"
              rel="noopener noreferrer"
              className={Style.Button}
            >
              삭제 요청하기
            </a>
          </div>

          <p className={Style.Notice}>
            1~2영업일 이내로 확인 후 빠르게 도와드리겠습니다.
          </p>
        </div>
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

export default FAQ;
