import Link from "next/link";

import styles from "./AppBar.module.scss";

export default function AppBar() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <a>CoinPriceTracker</a>
        </Link>
      </div>
    </div>
  );
}
