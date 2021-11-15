import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const words = post.data.content.reduce((accumulator, contentItem) => {
    const text = contentItem.body.map(item => item.text.split(' ').length);
    text.map(word => {
      accumulator += word;
    });

    return accumulator;
  }, 0);

  const time = Math.ceil(words / 200);

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
          {post.data.content.map(content => {
            return (
              <>
                <h1>{content.heading}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </>
            );
          })}
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

  const post = {
    slug,
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

  return {
    props: { post },
  };
};
