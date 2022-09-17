import millify from "millify";
import cn from "classnames";

import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./SingleCurrencyRow.module.scss";
import utilStyles from "../../styles/utilities.module.scss";

export default function SingleCurrencyRow(props) {
  const {
    currencyImageUrl = "",
    currencySymbol = "",
    currencyName = "",
    currencyCurrentPrice = 0,
    priceChange24H = 0,
    marketCap = 0,
    pageNumber = 1,
    index = 1,
    id = "",
  } = props;

  const router = useRouter();

  let imageUrl = currencyImageUrl;

  if (currencyImageUrl === "missing_large.png") {
    imageUrl = "/public\favicon.ico";
  }

  const handleCoinClick = (id) => {
    router.push(`/coin/${encodeURIComponent(id)}`);
  };

  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);

  return (
    <div className={styles.dataRowContainer}>
      <div className={`${styles.currencyRank} ${styles.dataRow}`}>
        {(pageNumber - 1) * 100 + index}
      </div>
      <div
        className={`${styles.currencyImageAndNameContainer} ${styles.dataRow}`}
        onClick={() => handleCoinClick(id)}
      >
        <div className={styles.currencyImageContainer}>
          <Image src={imageUrl} width={32} height={32} alt={currencyName} />
        </div>
        <div className={styles.currencyNameContainer}>
          <div className={styles.currencySymbol}>{currencySymbol}</div>
          <div className={styles.currencyName}>{currencyName}</div>
        </div>
      </div>
      <div className={`${styles.currencyPrice} ${styles.dataRow}`}>
        {numberFormat.format(currencyCurrentPrice || 0)}
      </div>
      <div
        className={cn({
          [utilStyles.negativeNumber]: priceChange24H < 0,
          [utilStyles.positiveNumber]: priceChange24H >= 0,

          [styles.currencyChange]: true,
          [styles.dataRow]: true,
        })}
      >
        {priceChange24H?.toFixed(2) || 0}%
      </div>
      <div className={`${styles.currencyMarketCap} ${styles.dataRow}`}>
        $
        {millify(marketCap || 0, {
          precision: 2,
        })}
      </div>
    </div>
  );
}
