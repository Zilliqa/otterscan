import { Zilliqa } from "@zilliqa-js/zilliqa";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { JsonRpcApiProvider } from "ethers";
import { getCodeQuery } from "./useErigonHooks";
import { toUtf8String } from "ethers";


export const createZilliqa = (erigonURL?: string): Zilliqa | undefined => {
  return new Zilliqa(erigonURL);
}

export const useIsScillaCode = (provider: JsonRpcApiProvider | undefined, checksummedAddress?: string) => {
  const { data : code } = useQuery(
    getCodeQuery(provider, checksummedAddress, "latest"));
  const scillaCode = useMemo(() => {
        try {
      if (code) {
        let s = toUtf8String(code);
        if (s.startsWith("scilla_version")) {
          return s;
        }
      }
        } catch (err) {
      // Silently ignore on purpose
      return undefined;
    }
  }, [code]);
  return scillaCode;
}
