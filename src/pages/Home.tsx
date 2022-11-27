import React, { useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

import logoFull from "../assets/algorand_full.png";
import { getVariable, Variable } from "../utils/getVariable";

function Home(): JSX.Element {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [globalCount, setGlobalCount] = useState(0);
  const [walletbalance, setWalletbalance] = useState();
  const [connector, setConnector] = useState<WalletConnect>();
  const [connected, setConnected] = useState(false);

  const appAddress = getVariable<number>(Variable.REACT_APP_ALGORAND_APPID);

  console.log(
    algosdk,
    formatJsonRpcRequest,
    globalCount,
    setGlobalCount,
    walletbalance,
    setWalletbalance,
    connected
  );

  function checkIfWalletIsConnected(): void {
    if (connector == null) {
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

  async function connectWallet(): Promise<void> {
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
        if (error != null) {
          throw error;
        }

        const { accounts } = payload.params[0];
        console.log("connected with account: ", accounts[0]);
        setConnector(connector);
        setConnected(true);
        setCurrentAccount(accounts[0]);
      });

      connector.on("session_update", (error, payload) => {
        if (error != null) {
          throw error;
        }

        const { accounts } = payload.params[0];
        setCurrentAccount(accounts[0]);
      });

      connector.on("disconnect", (error, payload) => {
        if (error != null) {
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

  function disconnectWallet(): void {
    void connector?.killSession();
    console.log("Killing session for wallet with address: ", currentAccount);
    setCurrentAccount("");
    setConnector(undefined);
    setConnected(false);
  }

  function increment(): void {
    setGlobalCount((previous) => ++previous);
  }

  function decrement(): void {
    setGlobalCount((previous) => --previous);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    console.log("Current account: ", currentAccount);
    console.log(appAddress);
  }, [currentAccount]);

  const ConnectWalletButton = (): JSX.Element => (
    <button
      className="rounded-xl px-6 py-4 text-lg bg-teal-500 hover:bg-teal-500/75 my-5 text-white"
      onClick={() => {
        void connectWallet();
      }}
    >
      Connect Wallet
    </button>
  );

  const DisplayCount = (): JSX.Element => (
    <div className="flex justify-center items-center gap-4 my-4">
      <a
        href=""
        target="_blank"
        className="block border-2 border-solid border-gray-300 px-4 py-2 rounded hover:bg-slate-200"
        title="View state in Devex"
      >
        {globalCount}
      </a>
      <div className="h-[30px] w-[1px] bg-gray-300 mx-2" />
      <button
        className="px-4 py-2 rounded bg-teal-200 hover:bg-teal-200/70"
        onClick={increment}
      >
        Add
      </button>
      <button
        className="px-4 py-2 rounded bg-teal-200 hover:bg-teal-200/70"
        onClick={decrement}
      >
        Deduct
      </button>
      <div className="h-[30px] w-[1px] bg-gray-300 mx-2" />
      <button
        className="px-4 py-2 rounded bg-red-600 hover:bg-red-600/80 text-white"
        onClick={disconnectWallet}
      >
        Disconnect Wallet
      </button>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto h-[500px] flex justify-center items-center flex-col">
      <img
        src={logoFull}
        alt="Algorand Full Logo"
        className="block mx-auto h-20 dark:filter dark:invert"
      />
      <div className="">
        {currentAccount !== "" ? <DisplayCount /> : <ConnectWalletButton />}
      </div>
    </div>
  );
}

export default Home;
