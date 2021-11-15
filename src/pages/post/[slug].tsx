import { GetStaticPaths, GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Prismic from '@prismicio/client';
import Link from 'next/link';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface NavigatePostsProps {
  previousPost: {
    slug: string | null;
    title: string | null;
  };
  nextPost: {
    slug: string | null;
    title: string | null;
  };
}

interface PostProps {
  post: Post;
  navigatePosts: NavigatePostsProps;
}

export default function Post({ post, navigatePosts }: PostProps) {
  const words = post.data.content.reduce((accumulator, contentItem) => {
    const text = contentItem.body.map(item => item.text.split(' ').length);
    text.map(word => {
      accumulator += word;
    });

    return accumulator;
  }, 0);

  const time = Math.ceil(words / 200);
  // console.log(navigatePosts);
  return (
    <>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>

      <div className={commonStyles.container}>
        <div className={styles.header}>
          <h1>{post.data.title}</h1>
          <div>
            <span>
              <FiCalendar />{' '}
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </span>
            <span>
              <FiUser />
              {post.data.author}
            </span>
            <span>
              <FiClock /> {time} min
            </span>
          </div>
          <strong>
            * editado em{' '}
            {format(new Date(post.last_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}{' '}
            às{' '}
            {format(new Date(post.last_publication_date), 'HH:mm', {
              locale: ptBR,
            })}
          </strong>
        </div>

        <div className={styles.content}>
          {post.data.content.map((content, index) => {
            return (
              <div key={index}>
                <h1>{content.heading}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.nav}>
          <div>
            {navigatePosts.previousPost.slug && (
              <>
                <h1>{navigatePosts.previousPost.title}</h1>
                <Link href={navigatePosts.previousPost.slug}>
                  <a>Post anterios</a>
                </Link>
              </>
            )}
          </div>
          <div>
            {navigatePosts.nextPost.slug && (
              <>
                <h1>{navigatePosts.nextPost.title}</h1>
                <Link href={navigatePosts.nextPost.slug}>
                  <a>Próximo post</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const content = response.data.content.map(content => {
    return {
      heading: content.heading,
      body: [...content.body],
    };
  });
  // console.log(response);
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: content,
    },
  };

  const { id } = response;

  const previousPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'posts'), {
      pageSize: 1,
      after: `${id}`,
      orderings: '[document.last_publication_date desc]',
    })
  ).results[0];

  const nextPost = (
    await prismic.query(Prismic.Predicates.at('document.type', 'posts'), {
      pageSize: 1,
      after: `${id}`,
      orderings: '[document.last_publication_date]',
    })
  ).results[0];

  const navigatePosts = {
    previousPost: {
      slug: previousPost?.uid ?? null,
      title: previousPost?.data.title ?? null,
    },
    nextPost: {
      slug: nextPost?.uid ?? null,
      title: nextPost?.data.title ?? null,
    },
  };

  return {
    props: { post, navigatePosts },
  };
};
