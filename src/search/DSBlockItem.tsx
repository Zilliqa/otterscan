import { DsBlockObj } from "@zilliqa-js/core/dist/types/src/types";
import React from "react";
import DSBlockLink from "../components/DSBlockLink";
import HexValue from "../components/HexValue";
import Timestamp from "../components/Timestamp";
import TransactionAddress from "../execution/components/TransactionAddress";
import {
  addHexPrefix,
  commify,
  pubKeyToAddr,
  zilliqaToOtterscanTimestamp,
} from "../utils/utils";

type DSBlockItemProps = {
  block: DsBlockObj;
  selectedAddress?: string;
};

const DSBlockItem: React.FC<DSBlockItemProps> = ({
  block,
  selectedAddress,
}) => {
  return (
    <div
      className="grid grid-cols-12 items-baseline gap-x-1 border-t border-gray-200 text-sm 
    hover:bg-skin-table-hover px-2 py-3"
    >
      <span>
        <DSBlockLink blockTag={block.header.BlockNum} />
      </span>
      <span>{commify(block.header.Difficulty)}</span>
      <span>{commify(block.header.DifficultyDS)}</span>
      <span className="col-span-2 truncate"><Timestamp
         age={false} value={zilliqaToOtterscanTimestamp(block.header.Timestamp)}
        /></span>
      <span className="col-span-2 truncate">
        <TransactionAddress
          address={pubKeyToAddr(block.header.LeaderPubKey)}
          selectedAddress={selectedAddress}
          miner={true}
        />
      </span>
      <span className="col-span-2 truncate">
        <HexValue value={addHexPrefix(block.header.PrevHash)} />
      </span>
    </div>
  );
};

export default DSBlockItem;
