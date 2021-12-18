import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { getMessage } from "./Web3Client";
import { setMessage } from "./Web3Client";

// Extend the global window interface to avoid a typescript error here
// where ethereum can't be found in the browser
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

let selectedAccount: any;

const Home: NextPage = () => {
  const [message, setStateMessage] = useState("");

  const fetchMessage = () => {
    getMessage()
      .then((message) => {
        setStateMessage(message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postMessage = () => {
    setMessage()
      .then(fetchMessage)
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>The Inbox</title>
        <meta name="description" content="The Inbox Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>The Inbox</h1>
        <h2>The current message is: {message}</h2>
        <button onClick={() => fetchMessage()}>Get the message</button>
        <button onClick={() => postMessage()}>Set the message</button>
      </main>
    </div>
  );
};

export default Home;
