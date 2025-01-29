import { useQuery } from "@tanstack/react-query";
import {
  Contract,
  JsonRpcApiProvider,
  TransactionReceipt,
  TransactionResponse,
  ZeroAddress,
  getAddress,
  BigNumber
} from "ethers";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";
import erc20 from "../abi/erc20.json";

const DELEGATE_STORAGE_LOCATION = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
const BEACON_STORAGE_LOCATION = "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50";
const ADMIN_STORAGE_LOCATION = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";

export type ERC1967ProxyAttributes = {
  delegate: ChecksummedAddress,
  beacon: ChecksummedAddress,
  admin: ChecksummedAddress
};

export const GetStorageQuery = (
  provider: JsonRpcAPiProvider,
  address: ChecksummedAddress,
  slot: string,
) => {
  return {
    queryKey: [ "getStorageAt", address, slot ],
    queryFn: () => {
      return provider.getStorage(address, slot);
    },
  };
};


export const useERC1967ProxyAttributes = (provider: JsonRpcProvider, address: ChecksummedAddress): Fetcher<ERC1967ProxyAttributes> | undefined => {
  const { data: delegateData }= useQuery(GetStorageQuery(provider, address, DELEGATE_STORAGE_LOCATION) );
  const { data: beaconData }= useQuery(GetStorageQuery(provider, address, BEACON_STORAGE_LOCATION) );
  const { data: adminData }= useQuery(GetStorageQuery(provider, address, ADMIN_STORAGE_LOCATION) );

  function toAddress(s: string | undefined) : string | undefined {
    if (s===undefined || s === "0x") {
      return undefined;
    }
    const addr = getAddress("0x" + s.toLowerCase().slice(-40));
    return addr;
  }
  

  const delegate = toAddress(delegateData);
  const beacon = toAddress(beaconData);
  const admin = toAddress(adminData);

  if (delegate === undefined) {
    return undefined
  }
  return { delegate, beacon, admin }
};
