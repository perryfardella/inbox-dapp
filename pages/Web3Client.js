import Web3 from "web3";

let selectedAccount;

let inboxContract;

let isInitialized = false;

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }

  const web3 = new Web3(provider);

  const inboxAbi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "initialMessage",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "getMessage",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "newMessage",
          type: "string",
        },
      ],
      name: "setMessage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  inboxContract = new web3.eth.Contract(
    inboxAbi,
    // Inbox contract on Rinkeby
    "0x8d8671021Ea191Bf2523fEb915dd5fBC3f08b88a"
  );

  inboxContract.defaultChain = "rinkeby";

  isInitialized = true;
};

export const getMessage = async () => {
  if (!isInitialized) {
    await init();
  }

  return inboxContract.methods
    .getMessage()
    .call()
    .then((message) => {
      return message;
    });
};

export const setMessage = async () => {
  if (!isInitialized) {
    await init();
  }

  return inboxContract.methods
    .setMessage("Perry Fardella changed this message, again!")
    .send({ from: selectedAccount })
    .on("transactionHash", function (hash) {
      console.log(hash);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      console.log(receipt);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
    })
    .on("error", function (error, receipt) {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log(error);
      console.log(receipt);
    });
};
