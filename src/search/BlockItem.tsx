import React from "react";
import { NavLink } from "react-router-dom";
import BlockLink from "../components/BlockLink";
import HexValue from "../components/HexValue";
import Timestamp from "../components/Timestamp";
import { formatValue } from "../components/formatter";
import BlockReward from "../execution/components/BlockReward";
import { MultiColumnDisplay } from "../search/useMultiColumnDisplayToggler";
import { blockTxsURL } from "../url";
import { ExtendedBlock } from "../useErigonHooks";
import TransactionItemFiatFee from "./TransactionItemFiatFee";
import { FeeDisplay } from "./useFeeToggler";

type BlockItemProps = {
  block: ExtendedBlock;
  feeDisplay: FeeDisplay;
  multiColumnDisplay: MultiColumnDisplay;
};

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  feeDisplay,
  multiColumnDisplay,
}) => {
  return (
    <div
      className="grid grid-cols-10 items-baseline gap-x-1 border-t border-gray-200 text-sm 
    hover:bg-skin-table-hover px-2 py-3"
    >
      <span>
        <BlockLink blockTag={block.number} />
      </span>
      <span>
        <NavLink
          className="rounded-lg bg-link-blue/10 px-2 py-1 text-xs text-link-blue hover:bg-link-blue/100 hover:text-white"
          to={blockTxsURL(block.number)}
        >
          {block.transactionCount} transactions
        </NavLink>
      </span>
      <span className="col-span-3">
        <HexValue value={block.hash ?? "null"} />
      </span>
      <span className="col-span-2">
        {multiColumnDisplay == MultiColumnDisplay.SHOW_PROPOSER && (
          <div>
            {" "}
            <HexValue value={block.miner ?? "none"} />
          </div>
        )}
        {multiColumnDisplay == MultiColumnDisplay.SHOW_PARENT && (
          <div>
            {" "}
            <HexValue value={block.parentHash ?? "none"} />
          </div>
        )}
      </span>
      <span className="truncate font-balance text-xs text-gray-500">
        {feeDisplay === FeeDisplay.TX_FEE && formatValue(block.feeReward, 18)}
        {feeDisplay === FeeDisplay.TX_FEE_USD && (
          <TransactionItemFiatFee
            blockTag={block.number}
            fee={block.feeReward}
          />
        )}
        {feeDisplay === FeeDisplay.GAS_PRICE && formatValue(block.gasUsed, 9)}
      </span>
      <span className="truncate">
        <BlockReward block={block} />
      </span>
      <Timestamp age={false} value={block.timestamp} />
    </div>
  );
};

export default BlockItem;
