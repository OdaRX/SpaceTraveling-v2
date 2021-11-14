import { GetStaticProps } from 'next';
import Head from 'next/head';
import CardPost from '../components/CardPost';

import { getPrismicClient } from '../services/prismic';

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

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.container}>
          <CardPost
            title="Como utilizar Hooks"
            subTitle="Pensando em sincronização em vez de ciclos de vida."
            createdAt="15 Mar 2021"
            author="Lucas Roberto"
          />

          <CardPost
            title="Como utilizar Hooks"
            subTitle="Pensando em sincronização em vez de ciclos de vida."
            createdAt="15 Mar 2021"
            author="Lucas Roberto"
          />

          <CardPost
            title="Como utilizar Hooks"
            subTitle="Pensando em sincronização em vez de ciclos de vida."
            createdAt="15 Mar 2021"
            author="Lucas Roberto"
          />

          <CardPost
            title="Como utilizar Hooks"
            subTitle="Pensando em sincronização em vez de ciclos de vida."
            createdAt="15 Mar 2021"
            author="Lucas Roberto"
          />

          <CardPost
            title="Como utilizar Hooks"
            subTitle="Pensando em sincronização em vez de ciclos de vida."
            createdAt="15 Mar 2021"
            author="Lucas Roberto"
          />
        </div>

        <button className={styles.moreButton}>Carregar mais posts</button>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);
//   // TODO
// };
