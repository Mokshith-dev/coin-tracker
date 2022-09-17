import { useState, useEffect } from "react";

import axios from "axios";

import Image from "next/image";

import { Typography } from "@mui/material/";

import SingleCurrencyRow from "../SingleCurrencyRow";
import styles from "./CurrencyList.module.scss";
import upArrow from "../../public/images/uparrow.svg";
import downArrow from "../../public/images/downarrow.svg";
import Loading from "../Loading";

export default function CurrencyList() {
  const [currencyData, setCurrencyData] = useState([]); // state for storing currency data
  const [pageNumber, setPageNumber] = useState(1); // to set page number
  const [orderByMarketCap, setOrderbyMarketCap] = useState(true); // boolean to decide in which order list should be displayed, by market cap or symbol
  const [marketCapOrderBooleanDesc, setMarketCapOrderBooleanDesc] =
    useState(true); // market cap is in descending order by default
  const [symbolOrderBooleanAsc, setSymbolOrderBooleanAsc] = useState(false); // symbol is in ascending order by default
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCurrencyList(url) {
      // function to fetch currency list
      try {
        setIsLoading(true);
        const results = await axios.get(url);
        setCurrencyData(results.data); // setting currency data
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
    let url = ``;
    if (orderByMarketCap) {
      // Order by market cap
      let marketCapOrder = "desc";
      if (!marketCapOrderBooleanDesc) {
        marketCapOrder = "asc";
      }
      url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_${marketCapOrder}&per_page=100&page=${pageNumber}&sparkline=false&price_change_percentage=24h`;
    } else {
      // order by symbol
      let SymbolOrder = "asc";
      if (!symbolOrderBooleanAsc) {
        SymbolOrder = "desc";
      }
      url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=id_${SymbolOrder}&per_page=100&page=${pageNumber}&sparkline=false&price_change_percentage=24h`;
    }
    fetchCurrencyList(url); // call the function to fetch currency list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, marketCapOrderBooleanDesc, symbolOrderBooleanAsc]);

  const previousPage = () => {
    // go to previous page
    setPageNumber(pageNumber - 1);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const nextPage = () => {
    // got to next page
    setPageNumber(pageNumber + 1);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const changeOrderOfMarketCap = () => {
    // toggle the order by market cap
    setOrderbyMarketCap(true);
    setMarketCapOrderBooleanDesc(!marketCapOrderBooleanDesc);
    setPageNumber(1);
  };

  const changeOrderBySymbol = () => {
    // toggle the order by symbol
    setOrderbyMarketCap(false);
    setSymbolOrderBooleanAsc(!symbolOrderBooleanAsc);
    setPageNumber(1);
  };

  return (
    <div className={styles.currencyListContainer}>
      <div className={styles.dataHeadContainer}>
        <div className={`${styles.dataHead} ${styles.dataHeadRank}`}></div>
        <div
          className={`${styles.dataHead} ${styles.dataHeadCoin}`}
          onClick={changeOrderBySymbol}
        >
          Coin
          {orderByMarketCap ? (
            ""
          ) : symbolOrderBooleanAsc ? (
            <Image src={downArrow} alt="downarrow" />
          ) : (
            <Image src={upArrow} alt="uparrow" />
          )}
        </div>
        <div className={`${styles.dataHead} ${styles.dataHeadPrice}`}>
          Price
        </div>
        <div className={`${styles.dataHead} ${styles.dataHeadChange}`}>
          24h Change
        </div>
        <div
          className={`${styles.dataHead} ${styles.dataHeadMarketCap}`}
          onClick={changeOrderOfMarketCap}
        >
          Market Cap
          {orderByMarketCap ? (
            marketCapOrderBooleanDesc ? (
              <Image src={upArrow} alt="uparrow" />
            ) : (
              <Image src={downArrow} alt="downarrow" />
            )
          ) : (
            ""
          )}
        </div>
      </div>
      {!isLoading && currencyData.length > 0 ? (
        currencyData.map((currency, index) => (
          <SingleCurrencyRow
            key={index}
            currencyImageUrl={currency?.image}
            currencySymbol={currency?.symbol}
            currencyName={currency?.name}
            currencyCurrentPrice={currency?.current_price}
            priceChange24H={currency?.price_change_percentage_24h}
            marketCap={currency?.market_cap}
            pageNumber={pageNumber}
            index={index + 1}
            id={currency?.id}
          />
        ))
      ) : !isLoading ? (
        <Typography
          sx={{
            height: "350px",
            fontSize: "24px",
            fontWeight: "medium",
            display: "flex",
            alignItems: "center",
          }}
        >
          {"Sorry!! Server is down:-("}
        </Typography>
      ) : (
        <Loading />
      )}
      <div className={styles.buttonContainer}>
        {pageNumber === 1 ? (
          ""
        ) : (
          <button
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={previousPage}
          >
            <span>Previous 100</span>
          </button>
        )}
        <button
          className={`${styles.navButton} ${styles.navButtonNext}`}
          onClick={nextPage}
        >
          <span>Next 100</span>
        </button>
      </div>
    </div>
  );
}
