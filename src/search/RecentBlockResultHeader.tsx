import React from "react";
import { FeeDisplay } from "./useFeeToggler";

export type ResultHeaderProps = {
  feeDisplay: FeeDisplay;
  feeDisplayToggler: () => void;
};

const RecentBlockResultHeader: React.FC<ResultHeaderProps> = ({
  feeDisplay,
  feeDisplayToggler,
}) => (
  <div className="grid grid-cols-5 gap-x-1 border-t border-b border-gray-200 bg-gray-100 px-2 py-2 text-sm font-bold text-gray-500">
    <div>Height</div>
    <div>Txns</div>
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

export default React.memo(RecentBlockResultHeader);
iff --git a/src/search/RecentDSBlockItem.tsx b/src/search/RecentDSBlockItem.tsx
ew file mode 100644
ndex 0000000..724af95
-- /dev/null
++ b/src/search/RecentDSBlockItem.tsx
@ -0,0 +1,28 @@
import { DsBlockObj } from "@zilliqa-js/core/dist/types/src/types";
import DSBlockLink from "../components/DSBlockLink";
import TimestampAge from "../components/TimestampAge";
import { commify, zilliqaToOtterscanTimestamp } from "../utils/utils";

type DSBlockItemProps = {
  block: DsBlockObj;
};

const RecentDSBlockItem: React.FC<DSBlockItemProps> = ({ block }) => {
  return (
    <div
      className="grid grid-cols-4 items-baseline gap-x-1 border-t border-gray-200 text-sm 
    hover:bg-skin-table-hover px-2 py-3"
    >
      <span>
        <DSBlockLink blockTag={block.header.BlockNum} />
      </span>
      <span>{commify(block.header.Difficulty)}</span>
      <span>{commify(block.header.DifficultyDS)}</span>
      <TimestampAge
        timestamp={zilliqaToOtterscanTimestamp(block.header.Timestamp)}
      />
    </div>
  );
};

export default RecentDSBlockItem;
