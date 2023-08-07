import React from "react";
import { FeeDisplay } from "./useFeeToggler";

export type ResultHeaderProps = {
    feeDisplay: FeeDisplay,
    feeDisplayToggler: () => void
};

const BlockResultHeader: React.FC<ResultHeaderProps> = ({
    feeDisplay,
    feeDisplayToggler
}) => (
  <div className="grid grid-cols-9 gap-x-1 border-t border-b border-gray-200 bg-gray-100 px-2 py-2 text-sm font-bold text-gray-500">
    <div>Height</div>
    <div>Txns</div>
    <div className="col-span-4">Block Hash</div>
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
    <div>Age</div>
  </div>
);

export default React.memo(BlockResultHeader);
