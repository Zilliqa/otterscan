import { FC, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TransactionLink from "../../components/TransactionLink";
import BlockLink from "../../components/BlockLink";
import DecoratedAddressLink from "../../components/DecoratedAddressLink";
import { TransactionAddressWithCopy } from "../../components/TransactionAddressWithCopy";
import { ChecksummedAddress } from "../../types";
import { FeeDisplay } from "../../search/useFeeToggler";
import { fromBech32Address, toBech32Address } from "@zilliqa-js/zilliqa";
import { useZRC2Metadata } from "../../scilla/useZRC2Hooks";
import { RuntimeContext } from "../../useRuntime";
import { commify } from "ethers";

type ZRC2Transfer = {
  tokenAddress: string;
  from: string;
  to: string;
  value: bigint;
  contractAddress: string;
  transitionName: string;
};

type ZRC2ItemProps = {
  transfer: ZRC2Transfer;
  txHash: string;
  blockNumber: number;
  address: ChecksummedAddress;
  feeDisplay: FeeDisplay;
};

const ZRC2Item: FC<ZRC2ItemProps> = ({
  transfer,
  txHash,
  blockNumber,
  address,
  feeDisplay,
}) => {
  const { provider } = useContext(RuntimeContext);
  const metadata = useZRC2Metadata(provider, transfer.tokenAddress as ChecksummedAddress);

  const isIncoming = transfer.to.toLowerCase() === address.toLowerCase();
  const otherAddress = isIncoming ? transfer.from : transfer.to;

  const formatValue = (value: bigint): string => {
    if (!metadata) return value.toString();
    
    const divisor = BigInt(10) ** BigInt(metadata.decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return commify(integerPart.toString());
    }
    
    const fractionalStr = fractionalPart.toString().padStart(Number(metadata.decimals), '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    return trimmedFractional 
      ? `${commify(integerPart.toString())}.${trimmedFractional}`
      : commify(integerPart.toString());
  };

  return (
    <div className="flex items-baseline space-x-2 px-2 py-1 hover:bg-skin-table-hover">
      <span className="w-24 shrink-0">
        <TransactionLink txHash={txHash} />
      </span>
      
      <span className="w-16 shrink-0 text-xs">
        <BlockLink blockTag={blockNumber} />
      </span>
      
      <span className="flex items-baseline space-x-1">
        {isIncoming ? (
          <>
            <span className="text-green-500">IN</span>
            <DecoratedAddressLink
              address={otherAddress as ChecksummedAddress}
              selfAddress={address}
              txFrom={otherAddress as ChecksummedAddress}
              txTo={address}
            />
          </>
        ) : (
          <>
            <span className="text-red-500">OUT</span>
            <DecoratedAddressLink
              address={otherAddress as ChecksummedAddress}
              selfAddress={address}
              txFrom={address}
              txTo={otherAddress as ChecksummedAddress}
            />
          </>
        )}
      </span>
      
      <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
      
      <span className="flex items-baseline space-x-1">
        <span className="font-bold">
          {formatValue(transfer.value)}
        </span>
        {metadata && (
          <span className="text-gray-500">
            {metadata.symbol}
          </span>
        )}
      </span>
      
      <span className="flex items-baseline space-x-1 text-xs">
        <span className="bg-purple-100 text-purple-800 px-1 rounded">ZRC2</span>
        <TransactionAddressWithCopy
          address={transfer.tokenAddress as ChecksummedAddress}
          showCodeIndicator={false}
        />
      </span>
    </div>
  );
};

export default ZRC2Item;