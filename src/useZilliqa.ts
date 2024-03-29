import { Zilliqa } from "@zilliqa-js/zilliqa";
import { useMemo } from "react";

export const useZilliqa = (erigonURL?: string): Zilliqa | undefined => {
  // Do I need to use useMemo here as string is a primitive type
  const zilliqa = useMemo((): Zilliqa | undefined => {
    if (erigonURL === undefined) {
      return undefined;
    }
    return new Zilliqa(erigonURL);
  }, [erigonURL]);

  return zilliqa;
};
