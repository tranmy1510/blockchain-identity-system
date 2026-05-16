import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { ethers } from "ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {

  const [walletAddress, setWalletAddress] =
    useState("");

  const [provider, setProvider] =
    useState(null);

  const [signer, setSigner] =
    useState(null);

  const [network, setNetwork] =
    useState("");

  // AUTO CHECK WALLET

  useEffect(() => {

    checkWalletConnection();

  }, []);

  // CHECK EXISTING CONNECTION

  const checkWalletConnection = async () => {

    try {

      if (!window.ethereum) {

        return;
      }

      const browserProvider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const accounts =
        await window.ethereum.request({
          method: "eth_accounts",
        });

      if (accounts.length > 0) {

        const walletSigner =
          await browserProvider.getSigner();

        const currentNetwork =
          await browserProvider.getNetwork();

        setWalletAddress(accounts[0]);

        setProvider(browserProvider);

        setSigner(walletSigner);

        setNetwork(currentNetwork.name);
      }

    } catch (error) {

      console.log(error);
    }
  };

  // CONNECT WALLET

  const connectWallet = async () => {

    try {

      if (!window.ethereum) {

        alert("MetaMask not installed");

        return;
      }

      const browserProvider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletSigner =
        await browserProvider.getSigner();

      const address =
        await walletSigner.getAddress();

      const currentNetwork =
        await browserProvider.getNetwork();

      setWalletAddress(address);

      setProvider(browserProvider);

      setSigner(walletSigner);

      setNetwork(currentNetwork.name);

      console.log(
        "Wallet connected:",
        address
      );

    } catch (error) {

      console.log(error);
    }
  };

  // DISCONNECT WALLET

  const disconnectWallet = () => {

    setWalletAddress("");

    setProvider(null);

    setSigner(null);

    setNetwork("");
  };

  return (

    <WalletContext.Provider
      value={{
        walletAddress,
        provider,
        signer,
        network,
        connectWallet,
        disconnectWallet,
      }}
    >

      {children}

    </WalletContext.Provider>
  );
}

export function useWallet() {

  return useContext(WalletContext);
}