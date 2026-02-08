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
    slug: 'friendship-conversation',
    title: '친구 관계 개선하기: 더 가까워지는 대화의 기술',
    excerpt:
      '오랜 친구인데도 대화가 어색해진 적 있으신가요? 의도적인 노력과 진정성 있는 대화로 더 깊은 관계를 만드는 방법을 소개합니다.',
    date: '2025.01.20',
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
    slug: 'gomgom-complete-guide',
    title: '곰곰 다이어리 완벽 가이드: 시작부터 활용까지',
    excerpt:
      '곰곰 다이어리를 200% 활용하는 방법! 다이어리 만들기부터 답장 확인까지 모든 것을 알려드립니다.',
    date: '2025.01.08',
    readTime: '7분',
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
    slug: 'diary-mental-health',
    title: '일기 쓰기와 정신건강: 과학이 증명한 치유의 글쓰기',
    excerpt:
      '일기 쓰기가 스트레스 해소와 정신건강에 미치는 긍정적인 영향을 과학적 연구와 함께 살펴봅니다.',
    date: '2025.01.03',
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
