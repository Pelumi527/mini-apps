"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
interface BattleEvilContextState {
  evilBlood: number;
  battleClickHandler: () => void;
}
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export const BattleEvilContext = createContext<BattleEvilContextState | null>(
  null,
);
export const useBattleEvil = () => {
  const battleEvilContext = useContext(BattleEvilContext);
  if (!battleEvilContext)
    throw new Error("useBattleEvil must be used within an BattleEvilProvider");
  return battleEvilContext;
};
export const BattleEvilProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [battleBlood, setBattleBlood] = useState(0);
  const [evilBlood, setEvilBlood] = useState(10000);
  const [battleRoundStart, setBattleRoundStart] = useState(false);
  const [checkHitTimer, setCheckHitTimer] = useState<number | undefined>(
    undefined,
  );

  const { data, error, isLoading } = useSWR(
    "https://mini-apps.deno.dev/?app_name=battle_game&key=blood",
    fetcher,
    { refreshInterval: 5000, refreshWhenHidden: true },
  );
  const { trigger } = useSWRMutation(
    `https://mini-apps.deno.dev/blood_reduce?count=${battleBlood}`,
    fetcher,
  );

  useEffect(() => {
    console.log(data);
    if (data) {
      setEvilBlood(data.value);
    }
  }, [data]);
  
  const setEvilBloodRemote = () => {
    trigger();
    // clear battle blood
    setBattleBlood(0);
  };
  const checkHit = () => {
    if (battleRoundStart) {
      return;
    }
    setBattleRoundStart(true);
    if (checkHitTimer) {
      clearTimeout(checkHitTimer);
      setCheckHitTimer(undefined);
    }

    const timer = window.setTimeout(() => {
      if (battleBlood > 0) {
        setEvilBloodRemote();
      }
      setBattleRoundStart(false);
    }, 5000);

    setCheckHitTimer(timer);
  };
  useEffect(() => {
    setEvilBlood((prev) => prev - battleBlood);

    if (battleBlood > 0) {
      if (battleBlood > 50) {
        // clear timer
        if (checkHitTimer) {
          clearTimeout(checkHitTimer);
          setCheckHitTimer(undefined);
        }
        setEvilBloodRemote();
        setBattleRoundStart(false);
      } else {
        checkHit();
      }
    }
  }, [battleBlood]);

  const battleClickHandler = () => {
    setBattleBlood((prev) => prev + 10);
  };
  return (
    <BattleEvilContext.Provider value={{ evilBlood, battleClickHandler }}>
      {children}
    </BattleEvilContext.Provider>
  );
};
