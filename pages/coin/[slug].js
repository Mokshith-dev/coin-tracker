import { useEffect, useState } from "react";

import axios from "axios";

import millify from "millify";

import ReactHighcharts from "react-highcharts/ReactHighstock.src";

import { format } from "date-fns";

import cn from "classnames";

import Image from "next/image";
import { useRouter } from "next/router";

import utilStyles from "../../styles/utilities.module.scss";
import styles from "./CoinDetails.module.scss";
import LinksContainer from "../../components/LinksContainer";
import AppBar from "../../components/AppBar";
import Loading from "../../components/Loading";

export default function CoinInfo() {
  const router = useRouter();
  const [coinId, setCoinId] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [coinImageUrl, setCoinImageUrl] = useState("/public\favicon.ico");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setCoinId(router.query.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    async function getCoinDetails() {
      try {
        setIsLoading(true);
        const response = await Promise.all([
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
          ),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=max`
          ),
        ]);
        if (response[0].data.image.large === "missing_large.png") {
          setCoinImageUrl("/public\favicon.ico");
        } else {
          setCoinImageUrl(response[0].data.image.large);
        }
        setIsLoading(false);
        setCoinData(response[0].data);
        setPriceData(response[1].data.prices);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    getCoinDetails();
  }, [coinId]);

  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const chartConfig = {
    yAxis: [
      {
        offset: 20,

        labels: {
          formatter: function () {
            return numberFormat.format(this.value);
          },
          x: -15,
          style: {
            color: "#000",
            position: "absolute",
          },
          align: "left",
        },
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return (
          numberFormat.format(this.y, 0) +
          "</b><br/>" +
          format(this.x, "dd MMM yyyy, HH:mm")
        );
      },
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
      },
    },
    rangeSelector: {
      selected: 1,
    },
    chart: {
      height: 500,
    },

    credits: {
      enabled: false,
    },

    legend: {
      enabled: true,
    },
    xAxis: {
      type: "date",
    },
    rangeSelector: {
      buttons: [
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 4,
    },
    series: [
      {
        name: "Price",
        type: "spline",

        data: priceData,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <AppBar />

      {!isLoading ? (
        <>
          <div className={styles.coinNameContainer}>
            <Image
              src={coinImageUrl}
              width={32}
              height={32}
              alt={coinData?.name}
            />
            <div className={styles.coinName}>{coinData?.name}</div>
            <div className={styles.coinSymbolContainer}>
              <span className={styles.coinSymbol}>{coinData?.symbol}</span>
            </div>
          </div>
          <div className={styles.coinDetailsContainer}>
            <div className={styles.coinMarketDataContainer}>
              <div className={styles.coinMarketDataBox}>
                <span className={styles.coinMarketDataHead}>Price</span>
                <span className={styles.coinMarketData}>
                  {numberFormat.format(
                    coinData?.market_data?.current_price?.usd
                  )}
                </span>
              </div>
              <div className={styles.coinMarketDataBox}>
                <span className={styles.coinMarketDataHead}>24 hour</span>
                <span
                  className={cn({
                    [utilStyles.negativeNumber]:
                      coinData?.market_data?.price_change_percentage_24h < 0,
                    [utilStyles.positiveNumber]:
                      coinData?.market_data?.price_change_percentage_24h >= 0,
                    [styles.coinMarketData]: true,
                  })}
                >
                  {coinData?.market_data?.price_change_percentage_24h?.toFixed(
                    2
                  ) || 0}
                  %
                </span>
              </div>
              <div className={styles.coinMarketDataBox}>
                <span className={styles.coinMarketDataHead}>1 week</span>
                <span
                  className={cn({
                    [utilStyles.negativeNumber]:
                      coinData?.market_data?.price_change_percentage_7d < 0,
                    [utilStyles.positiveNumber]:
                      coinData?.market_data?.price_change_percentage_7d >= 0,
                    [styles.coinMarketData]: true,
                  })}
                >
                  {coinData?.market_data?.price_change_percentage_7d?.toFixed(
                    2
                  ) || 0}
                  %
                </span>
              </div>
              <div className={styles.coinMarketDataBox}>
                <span className={styles.coinMarketDataHead}>Market cap</span>
                <span className={styles.coinMarketData}>
                  {millify(coinData?.market_data?.market_cap?.usd || 0, {
                    precision: 2,
                  })}
                </span>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ReactHighcharts config={chartConfig}></ReactHighcharts>
            </div>
            <div className={styles.descriptionContainer}>
              <div className={styles.descriptionHead}>
                <span>About {coinData?.name}</span>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: coinData?.description?.en || "No description",
                }}
              />
            </div>
            <LinksContainer
              website={coinData?.links?.homepage[0]}
              forum={coinData?.links?.official_forum_url[0]}
              reddit={coinData?.links?.subreddit_url}
              code={coinData?.links?.repos_url?.github[0]}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
