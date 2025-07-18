import { ChecksummedAddress } from "../types";

/**
 * Component is intrinsically associated with an address
 */
export type AddressAwareComponentProps = {
  address: ChecksummedAddress;
  bech32Address?: string | undefined;
};

/**
 * Component is related to an entire contract ABI;
 * the abi prop is the abi element from metadata.json.
 */
export type ABIAwareComponentProps = {
  abi: any[];
  unknownSelectors?: string[];
};
