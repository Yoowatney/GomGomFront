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
    slug: 'how-to-write-diary',
    title: '효과적인 다이어리 작성법: 일기 쓰기의 기술',
    excerpt:
      '매일 꾸준히 일기를 쓰고 싶지만 무엇을 써야 할지 막막하신가요? 효과적인 다이어리 작성법을 알려드립니다.',
    date: '2025.01.15',
    readTime: '5분',
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
