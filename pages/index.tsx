import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { getMessage, setMessage } from "../web3Client/Web3Client";

// Extend the global window interface to avoid a typescript error here
// where ethereum can't be found in the browser
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const Home: NextPage = () => {
  // React hooks to store data in state
  const [message, setStateMessage] = useState("");
  const [textInput, setTextInput] = useState("");

  // Function to handle the 
  const handleInputUpdate = (input: string) => {
    setTextInput(input);
  };

  // Function that calls the getMessage method from our client
  const fetchMessage = () => {
    getMessage()
      .then((message) => {
        setStateMessage(message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function that calls the setMessage method from our client
  const postMessage = (updatedMessage: string) => {
    setMessage(updatedMessage)
      .then(fetchMessage)
      .catch((err) => {
        console.log(err);
      });

    setTextInput("");
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
        <br/>
        <input
          type="text"
          value={textInput}
          onChange={(event) => handleInputUpdate(event.target.value)}
        ></input>
        <button onClick={() => postMessage(textInput)}>Set the message</button>
      </main>
    </div>
  );
};

export default Home;
