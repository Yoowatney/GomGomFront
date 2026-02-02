import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Style from './style.module.scss';

interface RelatedPost {
  slug: string;
  title: string;
}

interface PostLayoutProps {
  title: string;
  date: string;
  readTime: string;
  children: ReactNode;
  relatedPosts?: RelatedPost[];
}

const PostLayout = ({
  title,
  date,
  readTime,
  children,
  relatedPosts = [],
}: PostLayoutProps) => {
  return (
    <div className={Style.Layout}>
      <Link to="/blog" className={Style.BackLink}>
        &larr; 블로그 목록으로
      </Link>

      <article className={Style.Article}>
        <header className={Style.ArticleHeader}>
          <h1 className={Style.ArticleTitle}>{title}</h1>
          <div className={Style.ArticleMeta}>
            {date} · 읽는 시간 {readTime}
          </div>
        </header>

        <div className={Style.ArticleContent}>{children}</div>

        <Link to="/" className={Style.CtaButton}>
          곰곰 다이어리 시작하기
        </Link>

        {relatedPosts.length > 0 && (
          <div className={Style.RelatedPosts}>
            <h3 className={Style.RelatedTitle}>관련 글</h3>
            <div className={Style.RelatedList}>
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className={Style.RelatedLink}
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <div className={Style.Navigation}>
        <Link to="/blog" className={Style.NavLink}>
          블로그 목록 보기
        </Link>
        <Link to="/" className={Style.NavLink}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default PostLayout;
