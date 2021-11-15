import styles from './cardPost.module.scss';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

interface CardPostProps {
  title: string;
  subTitle: string;
  createdAt: string;
  author: string;
  url: string;
}

export default function CardPost({
  title,
  subTitle,
  createdAt,
  author,
  url,
}: CardPostProps) {
  return (
    <div className={styles.container}>
      <Link href={`/post/${url}`}>
        <a>
          <h1>{title}</h1>
          <p>{subTitle}</p>
          <div>
            <span>
              <FiCalendar />
              {createdAt}
            </span>
            <span>
              <FiUser />
              {author}
            </span>
          </div>
        </a>
      </Link>
    </div>
  );
}
