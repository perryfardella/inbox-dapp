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

  const networkId = await web3.eth.net.getId();

  const inboxAbi = [
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "getMessage",
      outputs: [
        {
          name: "message",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  inboxContract = new web3.eth.Contract(
    inboxAbi,
    // Inbox contract on Rinkeby
    "0x8d8671021Ea191Bf2523fEb915dd5fBC3f08b88a"
  );

  isInitialized = true;
};

export const getMessage = async () => {
  if (!isInitialized) {
    await init();
  }

  return inboxContract.methods
    .getMessage(selectedAccount)
    .call()
    .then((message) => {
      console.log(message);
    });
};
