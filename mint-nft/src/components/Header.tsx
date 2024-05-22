"use client";
import { WalletSelector } from "./WalletSelector";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import MobileDetect from "mobile-detect";
export default function Header() {
  const checkIsMobile = () => {
    const md = new MobileDetect(navigator.userAgent);
    if (md.mobile()) {
      console.log("Mobile device detected");
    } else {
      console.log("Desktop device detected")
    }
  };
  return (
    <div className="fixed top-0 z-20 flex items-center justify-between w-full h-20 px-5 bg-white">
      <h1>Minter</h1>
      <button onClick={() => {
        checkIsMobile()
      }}>getUser</button>
      <WalletSelector />
    </div>
  );
}
