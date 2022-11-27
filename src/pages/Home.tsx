import React, { useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

import logoFull from "../assets/algorand_full.png";
import { getVariable, Variable } from "../utils/getVariable";
import Loading from "../components/Loading";

function Home(): JSX.Element {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [globalCount, setGlobalCount] = useState(0);
  const [connector, setConnector] = useState<WalletConnect>();
  const [loading, setLoading] = useState(false);

  const appAddress = Number(getVariable(Variable.REACT_APP_ALGORAND_APPID));
  const algodToken = getVariable(Variable.REACT_APP_ALGORAND_ALGOD_TOKEN);
  const algodServer = getVariable(Variable.REACT_APP_ALGORAND_ALGOD_SERVER);
  const algodPort = getVariable<number>(Variable.REACT_APP_ALGORAND_ALGOD_PORT);
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

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
      }

      connector.on("connect", (error, payload) => {
        if (error != null) {
          throw error;
        }

        const { accounts } = payload.params[0];
        console.log("connected with account: ", accounts[0]);
        setConnector(connector);
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
  }

  async function increment(): Promise<void> {
    setLoading(true);
    const sender = currentAccount;
    const appArgs = [new Uint8Array(Buffer.from("Add"))];
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appAddress,
      appArgs
    );
    const txId = txn.txID().toString();

    const txns = [txn];
    const txnsToSign = txns.map((txn) => {
      const encodedTxn = Buffer.from(
        algosdk.encodeUnsignedTransaction(txn)
      ).toString("base64");
      return {
        txn: encodedTxn,
      };
    });

    const requestParams = [txnsToSign];
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    const result = await connector?.sendCustomRequest(request);

    const decodedResult = result.map((element: any) => {
      return element !== null
        ? new Uint8Array(Buffer.from(element, "base64"))
        : null;
    });

    await algodClient.sendRawTransaction(decodedResult).do();
    await algosdk.waitForConfirmation(algodClient, txId, 2);
    const transactionResponse = await algodClient
      .pendingTransactionInformation(txId)
      .do();
    console.log("Called app-id: ", transactionResponse.txn.txn.apid);

    if (transactionResponse["global-state-delta"] !== undefined) {
      console.log(
        "Global state updated: ",
        transactionResponse["global-state-delta"]
      );
      setGlobalCount((previous) => ++previous);
    }

    setLoading(false);
  }

  async function decrement(): Promise<void> {
    setLoading(true);
    const sender = currentAccount;
    const appArgs = [new Uint8Array(Buffer.from("Deduct"))];
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appAddress,
      appArgs
    );
    const txId = txn.txID().toString();

    const txns = [txn];
    const txnsToSign = txns.map((txn) => {
      const encodedTxn = Buffer.from(
        algosdk.encodeUnsignedTransaction(txn)
      ).toString("base64");
      return {
        txn: encodedTxn,
      };
    });

    const requestParams = [txnsToSign];
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    const result = await connector?.sendCustomRequest(request);

    const decodedResult = result.map((element: any) => {
      return element !== null
        ? new Uint8Array(Buffer.from(element, "base64"))
        : null;
    });

    await algodClient.sendRawTransaction(decodedResult).do();
    await algosdk.waitForConfirmation(algodClient, txId, 2);
    const transactionResponse = await algodClient
      .pendingTransactionInformation(txId)
      .do();
    console.log("Called app-id: ", transactionResponse.txn.txn.apid);

    if (transactionResponse["global-state-delta"] !== undefined) {
      console.log(
        "Global state updated: ",
        transactionResponse["global-state-delta"]
      );
      setGlobalCount((previous) => --previous);
    }

    setLoading(false);
  }

  async function getCount(): Promise<void> {
    const applicationInfoResponse = await algodClient
      .getApplicationByID(appAddress)
      .do();
    const globalState = applicationInfoResponse.params["global-state"];
    console.log("count is: ", globalState[0].value.uint);
    setGlobalCount(globalState[0].value.uint);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    void getCount();
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
        href={`https://testnet.algoexplorer.io/application/${appAddress}`}
        target="_blank"
        className="block border-2 border-solid dark:hover:bg-white/5 border-violet-300 px-4 py-2 rounded hover:bg-violet-100"
        title="View state in Devex"
        rel="noreferrer"
      >
        {globalCount}
      </a>
      <div className="h-[30px] w-[1px] bg-gray-300 mx-2" />
      <button
        className="px-4 py-2 rounded dark:bg-white dark:hover:bg-gray-100 dark:text-black bg-gray-200 hover:bg-gray-200/70"
        onClick={() => {
          void increment();
        }}
      >
        Add
      </button>
      <button
        className="px-4 py-2 rounded dark:bg-white dark:hover:bg-gray-100 dark:text-black bg-gray-200 hover:bg-gray-200/70"
        onClick={() => {
          void decrement();
        }}
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
      {loading && <Loading />}
    </div>
  );
}

export default Home;
