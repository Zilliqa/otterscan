import { useQuery } from "@tanstack/react-query";
import { JsonRpcApiProvider } from "ethers";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";

export type Quirks = {
  // Zilliqa 1 has so many odd quirks that we just have to declare it ..
  isZilliqa1: boolean;
};

type ZilliqaVersion = {
  Commit: string;
  Version: string;
};

export const useQuirks = (provider: JsonRpcApiProvider | undefined): Quirks => {
  const { data: version } = useQuery(getVersionQuery(provider));
  const isZilliqa1 = version?.Version.match(/^v9.[0-9]+/);
  return {
    isZilliqa1: !!isZilliqa1,
  };
};

export const getVersionQuery = ( provider: JsonRpcApiProvider ) => ({
  queryKey: [ "GetVersion" ],
  queryFn: () => {
    return provider.send("GetVersion", []);
  },
});
