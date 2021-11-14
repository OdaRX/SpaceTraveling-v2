import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <div className={`${commonStyles.container} ${styles.content}`}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="spacetraveling" />
          </a>
        </Link>
      </div>
    </>
  );
}
