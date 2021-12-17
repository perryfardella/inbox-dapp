import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

// Extend the global window interface to avoid a typescript error here
// where ethereum can't be found in the browser 
declare global {
  interface Window {
      ethereum:any;
      web3:any;
  }
}

const Home: NextPage = () => {
  // If MetaMask is installed, ethereum is available as a property
  // of the window object
  // if (typeof window.ethereum !== 'undefined') {
  //   console.log('MetaMask is installed!');
  // };

  const [provider, setProvider] = useState({})

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
       setProvider(new ethers.providers.Web3Provider(window.ethereum))
    }
  }, []);

  const connectWallet = () => {
    // window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(provider);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>The Inbox</title>
        <meta name="description" content="The Inbox Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>The Inbox</h1>
        <h2>The current message is: ...</h2>

        <button onClick={connectWallet}>Connect MetaMask wallet</button>
        
      </main>


    </div>
  )
}

export default Home
