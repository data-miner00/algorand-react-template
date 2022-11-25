import React, { useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

import logoFull from "../assets/algorand_full.png";
import { getVariable, Variable } from "../utils/getVariable";

function Home(): JSX.Element {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [globalCount, setGlobalCount] = useState(0);
  const [walletbalance, setwalletbalance] = useState();
  const [connector, setConnector] = useState<WalletConnect>();
  const [connected, setConnected] = useState(false);

  const app_address = getVariable<number>(Variable.REACT_APP_ALGORAND_APPID);

  async function checkIfWalletIsConnected() {
    if (!connector) {
      return;
    }

    try {
      if (!connector.connected) {
        console.log("No connection");
        return;
      } else {
        console.log("We have connection", connector);
      }
      const { accounts } = connector;

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        setCurrentAccount("");
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try {
      const bridge = "https://bridge.walletconnect.org";
      const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
      setConnector(connector);
      console.log(connector);
      if (!connector.connected) {
        await connector.createSession();
        console.log("Creating new connector session");
      }

      if (connector.connected) {
        const { accounts } = connector;
        const account = accounts[0];
        setCurrentAccount(account);
        setConnected(true);
      }

      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        console.log("connected with account: ", accounts[0]);
        setConnector(connector);
        setConnected(true);
        setCurrentAccount(accounts[0]);
      });

      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        setCurrentAccount(accounts[0]);
      });

      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }

        setCurrentAccount("");
        setConnected(false);
        setConnector(undefined);
      });
    } catch (error) {
      console.error("Some error occurred", error);
    }
  }

  async function disconnectWallet() {
    connector?.killSession();
    console.log("Killing session for wallet with address: ", currentAccount);
    setCurrentAccount("");
    setConnector(undefined);
    setConnected(false);
  }

  function increment() {}
  function decrement() {}

  useEffect(() => {
    checkIfWalletIsConnected();
    console.log("Current account: ", currentAccount);
    console.log(app_address);
  }, [currentAccount]);

  const ConnectWalletButton = () => (
    <button
      className="rounded-xl px-6 py-4 text-lg bg-teal-500 hover:bg-teal-500/75 my-5 text-white"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const DisplayCount = () => (
    <>
      <button className="mathButton" onClick={increment}>
        Add
      </button>
      <button className="mathButton" onClick={decrement}>
        Deduct
      </button>
      <button className="mathButton" onClick={disconnectWallet}>
        Disconnect Wallet
      </button>
    </>
  );

  return (
    <div className="bg-gray-200 max-w-[1400px] mx-auto h-[500px] flex justify-center items-center flex-col">
      <img
        src={logoFull}
        alt="Algorand Full Logo"
        className="block mx-auto h-20"
      />
      <div className="">
        {currentAccount ? <DisplayCount /> : <ConnectWalletButton />}
      </div>
    </div>
  );
}

export default Home;
