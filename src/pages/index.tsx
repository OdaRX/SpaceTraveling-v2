import { GetStaticProps } from 'next';
import Head from 'next/head';
import CardPost from '../components/CardPost';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostsProps {
  posts: Post[];
}
interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.container}>
          {posts.map(post => (
            <CardPost
              key={post.uid}
              title={post.data.title}
              subTitle={post.data.subtitle}
              createdAt={new Date(
                post.first_publication_date
              ).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              author={post.data.author}
              url={post.uid}
            />
          ))}
        </div>

        <button className={styles.moreButton}>Carregar mais posts</button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const posts = response.results;

  return {
    props: { posts },
  };
};
