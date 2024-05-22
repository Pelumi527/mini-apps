"use client";
import { CountDown } from "@/src/components/CountDown";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/src/config/constants";
import { fetcher } from "@/src/lib/utils";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import useSWR from "swr";

// <!-- smart contract

import { DAPP_ADDRESS, APTOS_NODE_URL } from "../../../config/constants";
import { Provider, Types, Network } from "aptos";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// --!>

type MintType = "cool-list" | "public-mint";
export interface MintCardProps {
  mintName: string;
  eligible?: boolean;
  mintTime: number;
  mintPrice?: string;
  minted?: string;
  mintable?: string;
  maxMinted?: boolean;
}
export interface MintInProgressCardProps extends MintCardProps {
  mintFinishHandler: () => void;
}
const CardLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-20">
      <span className="loading loading-spinner loading-md" />
    </div>
  );
};

const CardLoadingError = () => {
  return (
    <div
      className="</div> flex h-20 w-full items-center
justify-center"
    >
      <span> Failed to load</span>
    </div>
  );
};
export const MintCard: React.FC<{
  mintCardType: MintType;
  mintFinishHandler: () => void;
  eligible: boolean;
  minted: number; // Add eligible to the props
}> = ({ mintCardType, mintFinishHandler, eligible, minted }) => {
  if (mintCardType === "cool-list") {
    const mintInfoUrl = `${API_URL}?app_name=mint_app&key=cool_mint_time`;
    const { data, error, isLoading } = useSWR(mintInfoUrl, fetcher);
    if (isLoading) {
      return <CardLoading />;
    }
    if (error) {
      <CardLoadingError />;
    }
    console.log(data);
    const propsData = {
      eligible, // Use the eligible passed from props
      mintName: "Cool List",
      mintPrice: "4.2",
      mintable: "-",
      minted,
      mintTime: Number(data.value),
      mintFinishHandler,
    };

    return <MintInprogressCard {...propsData} />;

    // return <MintCompletedCard {...propsData} />;
  } else if (mintCardType === "public-mint") {
    const mintInfoUrl = `${API_URL}?app_name=mint_app&key=public_mint_time`;
    const { data, error, isLoading } = useSWR(mintInfoUrl, fetcher);
    if (isLoading) {
      return <CardLoading />;
    }
    if (error) {
      <CardLoadingError />;
    }
    console.log(data);
    const propsData = {
      mintName: "Public Mint",
      mintTime: Number(data.value),
    };
    return <MintStartCard {...propsData} />;
  } else {
    return <CardLoadingError />;
  }
};

const MintInprogressCard: React.FC<MintInProgressCardProps> = ({
  mintName,
  eligible,
  mintTime,
  mintPrice,
  mintable,
  minted,
  maxMinted,
  mintFinishHandler,
}) => {
  const isStartMint = mintTime - Date.now() < 0;
  const mintActionHandler = (mintAmount: number) => {
    console.log(mintAmount);
    mintFinishHandler();
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center px-4 py-2 border-2 border-b-0 border-black rounded-t-xl bg-bgpink">
        <div className="flex items-center justify-between w-full">
          <span className="font-bold text-white">{mintName}</span>
          <span
            className={
              `rounded-full border-2 px-4 text-sm font-medium` +
              ` ${
                eligible
                  ? maxMinted
                    ? "border-bggreen bg-bggreen text-white"
                    : "border-bggreen text-bggreen"
                  : "border-orange-500 text-orange-500"
              }`
            }
          >
            {eligible
              ? maxMinted
                ? "Max Minted"
                : "You're eligible"
              : "Not eligible!"}
          </span>
        </div>
        {isStartMint ? (
          eligible ? (
            maxMinted ? (
              <>
                <span className="mt-8 text-2xl font-semibold text-white">
                  WELL DONE!
                </span>
                <p className="px-5 mt-3 mb-5 text-base font-light text-center text-white">
                  You've successfully minted all available Slothsballs. Prepare
                  for the upcoming evolution phase.You'll be notified when it's
                  time to proceed.
                </p>
              </>
            ) : (
              <MintButtonCard
                onMintHandle={(mintAmount) => mintActionHandler(mintAmount)}
              />
            )
          ) : (
            <span className="mb-5 text-2xl font-semibold text-white mt-7">
              Minting is LIVE
            </span>
          )
        ) : (
          <CountDownCard cardName="Mint date" startTime={mintTime} />
        )}
      </div>
      <div className="px-4 py-5 bg-white border-2 border-t-0 border-b-4 border-black rounded-b-xl text-slate-600">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Mint price</span>
          <span className="font-black">{mintPrice || "-"} APT</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">You can mint</span>
          <span className="font-black">{mintable || "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">You minted</span>
          <span className="font-black">{minted || "-"}</span>
        </div>
      </div>
    </div>
  );
};

const MintStartCard: React.FC<MintCardProps> = ({ mintName, mintTime }) => {
  const mintTimeFormat = getStartTime(mintTime);

  return (
    <div className="flex items-center justify-between h-20 px-4 py-2 mt-3 border-2 border-b-4 border-black rounded-xl bg-bgpink text-fgpink">
      <span className="text-lg font-bold">{mintName}</span>
      <span>{mintTimeFormat}</span>
    </div>
  );
};

const MintCompletedCard: React.FC<MintCardProps> = ({ mintName }) => {
  return (
    <div className="flex items-center justify-between h-20 px-4 py-2 mt-3 text-white border-2 border-b-4 border-black rounded-xl bg-bgpink">
      <span className="text-lg font-bold">{mintName}</span>
      <span>MINTING IS OVER</span>
    </div>
  );
};
export const CountDownCard: React.FC<{
  startTime: number;
  cardName: string;
  bgcolor?: string;
}> = ({ bgcolor = "bg-black", startTime, cardName }) => {
  const startTimeFormat = getStartTime(startTime);
  return (
    <div className="flex flex-col items-center justify-center w-full mb-5">
      <h1 className="text-lg font-bold text-white">{cardName}</h1>
      <span className="text-lg font-light text-white mb-7">
        {startTimeFormat}
      </span>
      <CountDown deadlineTime={startTime} bgcolor={bgcolor} />
    </div>
  );
};

const MintButtonCard: React.FC<{
  onMintHandle: (mintAmount: number) => void;
}> = ({ onMintHandle }) => {
  const [mintAmount, setMintAmount] = useState(0);

  // <!-- smart contract
  const { signAndSubmitTransaction, account } = useWallet();

  async function mintNFT(amount: string) {
    const transaction:InputTransactionData = {
      sender: "",
      data: {
        function: `0x541dee79b366288d5c2313377941d3bb6f58f6436b0f943bb7fb0689ca60d641::pre_mint::mint_sloth_ball`,
        typeArguments: [
          "0x541dee79b366288d5c2313377941d3bb6f58f6436b0f943bb7fb0689ca60d641::pre_mint::CoolListInfo",
        ],
        functionArguments: [amount],
      },
    };

    const response = await signAndSubmitTransaction(transaction);
    console.log(response);
  }

  return (
    <>
      <div className="flex items-center justify-center w-full mt-3">
        <Button
          onClick={() => {
            setMintAmount(mintAmount - 1);
          }}
          disabled={mintAmount <= 0}
          variant="primary"
          className="text-black"
        >
          <MinusOutlined />
        </Button>
        <span className="inline-block mx-8 font-bold text-white">
          {mintAmount}
        </span>
        <Button
          onClick={() => {
            setMintAmount(mintAmount + 1);
          }}
          variant="primary"
          className="text-black"
        >
          <PlusOutlined />
        </Button>
      </div>
      <Button
        onClick={() => mintNFT(String(mintAmount))}
        className="w-full my-8"
        variant="secondary"
      >
        Mint
      </Button>
    </>
  );
};
export const getStartTime = (startTime: number) => {
  // Convert seconds to milliseconds if the timestamp is not in the correct time range
  const date = new Date(startTime * 1000);
  const utcString = date.toUTCString();
  const parts = utcString.split(" ");
  const timeParts = parts[4].split(":");
  return `${parts[1]} ${parts[2]}⋅${timeParts[0]}:${timeParts[1]} GMT`;
};
