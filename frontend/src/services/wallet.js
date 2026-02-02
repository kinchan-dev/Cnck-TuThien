import { ethers } from "ethers";

export function shortAddr(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error("Chưa cài MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork(); // chainId bigint

  return {
    provider,
    signer,
    address,
    chainId: network.chainId.toString(),
    networkName: network.name,
  };
}

export async function getWalletSnapshot() {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);
  if (!accounts?.length) return null;

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  return {
    address,
    chainId: network.chainId.toString(),
    networkName: network.name,
  };
}

export function watchWallet(onChange) {
  if (!window.ethereum) return () => {};
  const handler = () => onChange?.();
  window.ethereum.on("accountsChanged", handler);
  window.ethereum.on("chainChanged", handler);
  return () => {
    window.ethereum.removeListener("accountsChanged", handler);
    window.ethereum.removeListener("chainChanged", handler);
  };
}
