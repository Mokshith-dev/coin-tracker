import Head from "next/head";
import AppBar from "../components/AppBar";
import CurrencyList from "../components/CurrencyList";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cryptocurrency Tracker</title>
        <meta
          name="description"
          content="Web app to track Cryptocurrency prices"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <AppBar />
        <CurrencyList />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
