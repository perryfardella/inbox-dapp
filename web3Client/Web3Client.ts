import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

let selectedAccount: string;
let inboxContract: Contract;
let isConnected = false;

const inboxAbi: AbiItem[] = [
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

const connect = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err: any) => {
        console.log(err);
        return;
      });

    window.ethereum.on("accountsChanged", function (accounts: string[]) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }

  const web3 = new Web3(provider);

  inboxContract = new web3.eth.Contract(
    inboxAbi,
    // Inbox contract on Rinkeby
    "0x8d8671021Ea191Bf2523fEb915dd5fBC3f08b88a"
  );

  inboxContract.defaultChain = "rinkeby";

  isConnected = true;
};

export const getMessage = async () => {
  if (!isConnected) {
    await connect();
  }

  return inboxContract.methods
    .getMessage()
    .call()
    .then((message: string) => {
      return message;
    });
};

export const setMessage = async (message: string) => {
  if (!isConnected) {
    await connect();
  }

  return inboxContract.methods
    .setMessage(message)
    .send({ from: selectedAccount })
    .on("transactionHash", function (hash: string) {
      console.log(hash);
    })
    .on("confirmation", function (confirmationNumber: number, receipt: any) {
      console.log('confirmation number: ' + confirmationNumber);
      console.log(receipt);
    })
    .on("receipt", function (receipt: any) {
      console.log(receipt);
    })
    .on("error", function (error: any, receipt: any) {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log(error);
      console.log(receipt);
    });
};
