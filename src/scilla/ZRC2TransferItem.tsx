import { faCaretRight, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, memo, useContext } from "react";
import FormattedBalanceHighlighter from "../selection/FormattedBalanceHighlighter";
import { AddressContext } from "../types";
import { RuntimeContext } from "../useRuntime";
import TransactionAddress from "../execution/components/TransactionAddress";
import { ZRC2Transfer } from "../types";
import { useZRC2Metadata } from "./useZRC2Hooks";

type ZRC2TransferItemProps = {
  transfer: ZRC2Transfer;
};

const ZRC2TransferItem: FC<ZRC2TransferItemProps> = ({ transfer }) => {
  const { zilliqa } = useContext(RuntimeContext);
  const tokenMeta = useZRC2Metadata(zilliqa, transfer.token);

  return (
    <div className="flex items-baseline space-x-2 truncate px-2 py-1 hover:bg-gray-100">
      <div className="grid w-full items-baseline gap-x-1" style={{ gridTemplateColumns: "auto 1fr 1fr 1fr" }}>
        {/* ZRC2 Transfer Label */}
        <div className="flex items-baseline space-x-1">
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
            ZRC2
          </span>
        </div>
        
        {/* From Address */}
        <div className="flex items-baseline space-x-1">
          <TransactionAddress
            address={transfer.from}
            addressCtx={AddressContext.FROM}
            showCodeIndicator
            displayAsBech32={true}
          />
        </div>
        
        {/* To Address */}
        <div className="flex items-baseline space-x-1">
          <span className="text-gray-500">
            <FontAwesomeIcon icon={faCaretRight} size="1x" />
          </span>
          <TransactionAddress
            address={transfer.to}
            addressCtx={AddressContext.TO}
            showCodeIndicator
            displayAsBech32={true}
          />
        </div>
        
        {/* Amount and Token */}
        <div className="col-span-1 flex items-baseline space-x-1">
          <span className="text-gray-500">
            <FontAwesomeIcon icon={faSackDollar} size="1x" />
          </span>
          <span>
            <FormattedBalanceHighlighter
              value={transfer.value}
              decimals={tokenMeta?.decimals ?? 0}
            />
          </span>
          <span className="text-sm text-gray-600">
            {tokenMeta?.symbol || "Unknown"}
          </span>
          <TransactionAddress address={transfer.token} displayAsBech32={true} />
        </div>
      </div>
    </div>
  );
};

export default memo(ZRC2TransferItem);
