import {
  JsonRpcApiProvider
} from "ethers";
import { useEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";

export type Quirks = {
  // Zilliqa 1 has so many odd quirks that we just have to declare it ..
  isZilliqa1: boolean;
}

type ZilliqaVersion = {
  Commit: string;
  Version: string;
}

export const quirksFetcher = (provider : JsonRpcApiProvider | undefined ):  Fetcher<any,Quirks> => async (key) =>{
  const version = await provider?.send("GetVersion", []);
  const isZilliqa1 = version?.Version.match(/^v9.[0-9]+/);
  console.log(`version ${JSON.stringify(version)} is Zilliqa 1? {isZilliqa1}`);
  return {
    isZilliqa1
  }
}

export const useQuirks = (provider: JsonRpcApiProvider | undefined) : Quirks => {
  const { data : quirks } = useSWRImmutable("getVersion", quirksFetcher(provider));
  return quirks;
}
