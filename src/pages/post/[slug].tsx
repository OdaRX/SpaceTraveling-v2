import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-reactjs';

interface Post {
  first_publication_date: string | null;
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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  console.log(post);
  return (
    <>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="ColocarNomeDoPost" />
      </div>

      <div className={commonStyles.container}>
        <div className={styles.header}>
          <h1>{post.data.title}</h1>
          <div>
            <span>
              <FiUser />{' '}
              {new Date(post.first_publication_date).toLocaleDateString(
                'pt-BR',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }
              )}
            </span>
            <span>
              <FiCalendar /> {post.data.author}
            </span>
            <span>
              <FiClock /> 4 min
            </span>
          </div>
        </div>

        <div className={styles.content}>{post.data.content.heading}</div>
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

  const post = {
    slug,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: '',
        body: '',
      },
    },
  };

  console.log('oi', post.data.content);

  return {
    props: { post },
  };
};
