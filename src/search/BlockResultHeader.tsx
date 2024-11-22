import React from "react";
import { EmptyBlocksDisplay } from "./useEmptyBlocksToggler";
import { FeeDisplay } from "./useFeeToggler";
import { MultiColumnDisplay } from "./useMultiColumnDisplayToggler";

export type ResultHeaderProps = {
  feeDisplay: FeeDisplay;
  emptyBlocksDisplay: EmptyBlocksDisplay;
  feeDisplayToggler: () => void;
  emptyBlocksDisplayToggler: () => void;
  multiColumnDisplay: MultiColumnDisplay;
  multiColumnDisplayToggler: () => void;
};

const BlockResultHeader: React.FC<ResultHeaderProps> = ({
  feeDisplay,
  feeDisplayToggler,
  emptyBlocksDisplay,
  emptyBlocksDisplayToggler,
  multiColumnDisplay,
  multiColumnDisplayToggler,
}) => (
  <div className="grid grid-cols-10 gap-x-1 border-t border-b border-gray-200 bg-gray-100 px-2 py-2 text-sm font-bold text-gray-500">
    <div>Height</div>
    <div>
      <button
        className="text-link-blue hover:text-link-blue-hover"
        onClick={emptyBlocksDisplayToggler}
      >
        {emptyBlocksDisplay === EmptyBlocksDisplay.SHOW_EMPTY_BLOCKS &&
          "Txns [all-blks]"}
        {emptyBlocksDisplay === EmptyBlocksDisplay.HIDE_EMPTY_BLOCKS &&
          "Txns [non-empty-blks]"}
      </button>
    </div>
    <div className="col-span-3">Block Hash</div>
    <div className="col-span-2">
      <button
        className="text-link-blue hover:text-link-blue-hover"
        onClick={multiColumnDisplayToggler}
      >
        {multiColumnDisplay == MultiColumnDisplay.SHOW_PARENT && "Parent"}
        {multiColumnDisplay == MultiColumnDisplay.SHOW_PROPOSER && "Proposer"}
      </button>
    </div>
    <div>
      <button
        className="text-link-blue hover:text-link-blue-hover"
        onClick={feeDisplayToggler}
      >
        {feeDisplay === FeeDisplay.TX_FEE && "Txn Fee"}
        {feeDisplay === FeeDisplay.TX_FEE_USD && "Txn Fee (USD)"}
        {feeDisplay === FeeDisplay.GAS_PRICE && "Gas Price"}
      </button>
    </div>
    <div>Rewards</div>
    <div>Timestamp</div>
  </div>
);

export default React.memo(BlockResultHeader);
