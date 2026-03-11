import { Link } from 'react-router-dom';

import Style from './style.module.scss';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const posts: Post[] = [
  {
    slug: 'stress-relief',
    title: '일기로 스트레스 해소하기: 마음의 짐을 내려놓는 방법',
    excerpt:
      '펜과 종이만 있으면 언제 어디서든 마음의 짐을 내려놓을 수 있습니다. 일기로 스트레스를 해소하는 방법을 알아봅니다.',
    date: '2025.01.22',
    readTime: '5분',
  },
  {
    slug: 'making-memories',
    title: '친구와의 추억 만들기: 평생 간직할 순간들',
    excerpt:
      '몇 년이 지나도 생생하게 기억나는 순간들. 친구와 의미 있는 추억을 만드는 7가지 방법을 소개합니다.',
    date: '2025.01.21',
    readTime: '6분',
  },
  {
    slug: 'friendship-conversation',
    title: '친구 관계 개선하기: 더 가까워지는 대화의 기술',
    excerpt:
      '오랜 친구인데도 대화가 어색해진 적 있으신가요? 의도적인 노력과 진정성 있는 대화로 더 깊은 관계를 만드는 방법을 소개합니다.',
    date: '2025.01.20',
    readTime: '6분',
  },
  {
    slug: 'self-esteem',
    title: '자존감 높이는 글쓰기: 나를 사랑하는 연습',
    excerpt:
      '자존감은 타고나는 것이 아니라 연습으로 키울 수 있습니다. 글쓰기로 자존감을 높이는 방법을 알아봅니다.',
    date: '2025.01.19',
    readTime: '6분',
  },
  {
    slug: 'self-reflection',
    title: '자기 성찰의 힘: 나를 알아가는 여정',
    excerpt:
      '바쁜 일상 속에서 자신을 돌아볼 시간을 갖기란 쉽지 않습니다. 자기 성찰이 주는 선물과 시작하는 방법을 알아봅니다.',
    date: '2025.01.18',
    readTime: '7분',
  },
  {
    slug: 'emotion-diary',
    title: '감정 일기 작성법: 내 마음을 이해하는 첫걸음',
    excerpt:
      '감정 일기는 자신의 감정을 인식하고 이해하는 연습입니다. 감정에 이름을 붙이고 탐구하는 방법을 알아봅니다.',
    date: '2025.01.17',
    readTime: '5분',
  },
  {
    slug: 'digital-connection',
    title: '디지털 시대의 소통: 온라인에서 진정성 있게 연결하기',
    excerpt:
      '수백 명의 SNS 친구가 있지만 외로움을 느끼시나요? 디지털 시대에 진정성 있는 관계를 맺는 방법을 소개합니다.',
    date: '2025.01.16',
    readTime: '5분',
  },
  {
    slug: 'how-to-write-diary',
    title: '효과적인 다이어리 작성법: 일기 쓰기의 기술',
    excerpt:
      '매일 꾸준히 일기를 쓰고 싶지만 무엇을 써야 할지 막막하신가요? 효과적인 다이어리 작성법을 알려드립니다.',
    date: '2025.01.15',
    readTime: '5분',
  },
  {
    slug: 'capturing-memories',
    title: '추억을 기록하는 방법: 소중한 순간을 간직하기',
    excerpt:
      '시간은 빠르게 흘러가고 소중했던 순간들은 희미해집니다. 추억을 효과적으로 기록하고 간직하는 방법을 알아봅니다.',
    date: '2025.01.14',
    readTime: '6분',
  },
  {
    slug: 'what-is-good-friend',
    title: '좋은 친구란 무엇인가: 진정한 우정의 조건',
    excerpt:
      'SNS 친구는 많지만 진짜 친구는 없다고 느끼시나요? 진정한 우정의 7가지 조건을 알아봅니다.',
    date: '2025.01.13',
    readTime: '6분',
  },
  {
    slug: 'emotional-writing-benefits',
    title: '감정 글쓰기의 놀라운 효과: 왜 감정을 글로 표현해야 할까?',
    excerpt:
      '심리학 연구로 증명된 감정 글쓰기의 효과와 일상에서 실천하는 방법을 소개합니다.',
    date: '2025.01.12',
    readTime: '6분',
  },
  {
    slug: 'asking-good-questions',
    title: '친구에게 좋은 질문하는 법: 더 깊은 대화를 위한 가이드',
    excerpt:
      '의미 있는 대화를 나누고 싶다면 좋은 질문에서 시작하세요. 친구의 마음을 여는 질문법을 알려드립니다.',
    date: '2025.01.10',
    readTime: '5분',
  },
  {
    slug: 'gratitude-journal',
    title: '감사 일기의 효과: 긍정적인 마음 만들기',
    excerpt:
      '하루 감사한 일 세 가지 적기. 단순해 보이는 이 습관이 삶을 바꿀 수 있습니다. 과학이 증명한 감사 일기의 효과를 알아봅니다.',
    date: '2025.01.11',
    readTime: '5분',
  },
  {
    slug: 'alone-time',
    title: '혼자만의 시간의 가치: 나와 마주하는 시간',
    excerpt:
      '혼자 있는 것과 외로운 것은 다릅니다. 혼자만의 시간이 주는 선물과 그 가치를 알아봅니다.',
    date: '2025.01.09',
    readTime: '5분',
  },
  {
    slug: 'gomgom-complete-guide',
    title: '곰곰 다이어리 완벽 가이드: 시작부터 활용까지',
    excerpt:
      '곰곰 다이어리를 200% 활용하는 방법! 다이어리 만들기부터 답장 확인까지 모든 것을 알려드립니다.',
    date: '2025.01.08',
    readTime: '7분',
  },
  {
    slug: 'everyday-happiness',
    title: '일상에서 행복 찾기: 작은 것에서 기쁨을 발견하는 법',
    excerpt:
      '특별한 일이 없어서 행복하지 않다고요? 일상의 작은 순간에서 행복을 발견하는 방법을 알아봅니다.',
    date: '2025.01.07',
    readTime: '5분',
  },
  {
    slug: 'conversation-skills',
    title: '대화의 기술: 더 깊이 연결되는 소통법',
    excerpt:
      '대화의 양이 아니라 질이 관계의 깊이를 결정합니다. 더 의미 있는 대화를 나누는 기술을 알아봅니다.',
    date: '2025.01.06',
    readTime: '6분',
  },
  {
    slug: 'anonymous-diary-benefits',
    title: '익명 다이어리의 장점: 솔직해질 수 있는 공간',
    excerpt:
      '익명이기 때문에 더 솔직해질 수 있습니다. 익명 다이어리가 주는 심리적 안정감에 대해 이야기합니다.',
    date: '2025.01.05',
    readTime: '4분',
  },
  {
    slug: 'mindfulness-writing',
    title: '마음 챙김과 일기: 현재에 집중하는 글쓰기',
    excerpt:
      '마음 챙김 글쓰기는 글을 통해 현재에 집중하는 연습입니다. 명상이 어려운 분들에게 좋은 대안이 됩니다.',
    date: '2025.01.04',
    readTime: '5분',
  },
  {
    slug: 'diary-mental-health',
    title: '일기 쓰기와 정신건강: 과학이 증명한 치유의 글쓰기',
    excerpt:
      '일기 쓰기가 스트레스 해소와 정신건강에 미치는 긍정적인 영향을 과학적 연구와 함께 살펴봅니다.',
    date: '2025.01.03',
    readTime: '6분',
  },
  {
    slug: 'goal-setting',
    title: '목표 설정과 기록: 꿈을 현실로 만드는 방법',
    excerpt:
      '글로 쓴 목표는 머릿속에만 있는 목표보다 달성 확률이 훨씬 높습니다. 효과적인 목표 설정법을 알아봅니다.',
    date: '2025.01.02',
    readTime: '6분',
  },
  {
    slug: 'positive-thinking',
    title: '긍정적 사고 기르기: 마음의 습관 바꾸기',
    excerpt:
      '긍정적 사고는 성격이 아니라 기술입니다. 연습을 통해 뇌의 습관을 바꾸는 방법을 알아봅니다.',
    date: '2025.01.01',
    readTime: '5분',
  },
  {
    slug: 'relationship-repair',
    title: '관계 회복의 기술: 어긋난 마음 다시 잇기',
    excerpt:
      '소중한 사람과 멀어졌나요? 관계 회복은 어렵지만 불가능하지 않습니다. 진심과 올바른 방법이 필요합니다.',
    date: '2024.12.30',
    readTime: '6분',
  },
  {
    slug: 'self-care',
    title: '자기 돌봄의 중요성: 나를 먼저 채우기',
    excerpt:
      '나를 먼저 돌봐야 다른 사람도 돌볼 수 있습니다. 신체적, 정신적, 감정적 자기 돌봄 방법을 알아봅니다.',
    date: '2024.12.28',
    readTime: '5분',
  },
  {
    slug: 'expressing-emotions',
    title: '감정 표현의 방법: 마음을 전하는 기술',
    excerpt:
      '마음을 표현하지 않으면 상대방은 모릅니다. 감정을 적절하게 표현하는 것은 관계의 핵심 기술입니다.',
    date: '2024.12.26',
    readTime: '5분',
  },
  {
    slug: 'meaningful-life',
    title: '의미 있는 삶 살기: 나만의 가치 찾기',
    excerpt:
      '의미 있는 삶의 정의는 사람마다 다릅니다. 남의 기준이 아닌 자신의 기준으로 의미를 찾는 방법을 알아봅니다.',
    date: '2024.12.24',
    readTime: '6분',
  },
  {
    slug: 'tracking-change',
    title: '변화를 기록하는 법: 성장의 증거 남기기',
    excerpt:
      '변화를 기록하지 않으면 성장을 인식하기 어렵습니다. 기록은 성장의 증거이자 앞으로 나아갈 동력이 됩니다.',
    date: '2024.12.22',
    readTime: '5분',
  },
  {
    slug: 'maintaining-friendship',
    title: '우정을 유지하는 방법: 멀어지지 않는 관계 만들기',
    excerpt:
      '바쁜 일상 속에서 우정은 자연스럽게 시들어갑니다. 소중한 관계를 지키는 의도적인 노력을 알아봅니다.',
    date: '2024.12.20',
    readTime: '5분',
  },
  {
    slug: 'daily-routine',
    title: '나만의 루틴 만들기: 하루를 디자인하는 방법',
    excerpt:
      '루틴은 의지력을 아끼고, 좋은 습관을 자동화합니다. 자신에게 맞는 루틴을 만드는 방법을 알아봅니다.',
    date: '2024.12.18',
    readTime: '5분',
  },
  {
    slug: 'authentic-communication',
    title: '진정한 소통이란: 마음과 마음이 만나는 대화',
    excerpt:
      '진정한 소통은 단순한 정보 교환이 아닙니다. 마음과 마음이 만나는 대화의 조건을 알아봅니다.',
    date: '2024.12.16',
    readTime: '6분',
  },
];

const Blog = () => {
  return (
    <div className={Style.Layout}>
      <div className={Style.Header}>
        <h1 className={Style.Title}>곰곰 블로그</h1>
        <p className={Style.Subtitle}>
          다이어리 작성 팁부터 감정 글쓰기까지, 곰곰이 생각하며 쓰는 이야기
        </p>
      </div>

      <div className={Style.PostList}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={Style.PostCard}
          >
            <h2 className={Style.PostTitle}>{post.title}</h2>
            <p className={Style.PostExcerpt}>{post.excerpt}</p>
            <div className={Style.PostMeta}>
              <span>{post.date}</span>
              <span>읽는 시간 {post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>

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

export default Blog;
