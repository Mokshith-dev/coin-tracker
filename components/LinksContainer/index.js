import Image from "next/image";
import Link from "next/link";

import Website from "../../public/images/website.svg";
import Forum from "../../public/images/forum.svg";
import Reddit from "../../public/images/reddit.svg";
import Code from "../../public/images/github.svg";
import styles from "./LinksContainer.module.scss";

export default function LinksContainer(props) {
  const { website = "#", forum = "#", reddit = "#", code = "#" } = props;
  return (
    <div className={styles.linksContainer}>
      <div className={styles.button}>
        <div className={styles.linkIcon}>
          <Image src={Website} width={18} height={18} alt="website" />
        </div>
        <div className={styles.link}>
          <Link href={website || "#"}>
            <a>Website</a>
          </Link>
        </div>
      </div>
      <div className={styles.button}>
        <div className={styles.linkIcon}>
          <Image src={Forum} width={18} height={18} alt="Forum" />
        </div>
        <div className={styles.link}>
          <Link href={forum || "#"}>
            <a>Forum</a>
          </Link>
        </div>
      </div>
      <div className={styles.button}>
        <div className={styles.linkIcon}>
          <Image src={Reddit} width={18} height={18} alt="Reddit" />
        </div>
        <div className={styles.link}>
          <Link href={reddit || "#"}>
            <a>Reddit</a>
          </Link>
        </div>
      </div>
      <div className={styles.button}>
        <div className={styles.linkIcon}>
          <Image src={Code} width={18} height={18} alt="Code" />
        </div>
        <div className={styles.link}>
          <Link href={code || "#"}>
            <a>Code</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
