import { FC, useContext, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import ContentFrame from "../../components/ContentFrame";
import PendingResults from "../../search/PendingResults";
import ResultHeader from "../../search/ResultHeader";
import { useFeeToggler } from "../../search/useFeeToggler";
import { SelectionContext, useSelection } from "../../useSelection";
import { usePageNumber } from "../../usePageNumber";
import { useHasCode } from "../../useErigonHooks";
import { useAddressTransactions } from "./AddressTransactionResults";
import { findZRC2TransfersInEventLog } from "../../scilla/useZRC2Hooks";
import ZRC2Item from "./ZRC2Item";
import { RuntimeContext } from "../../useRuntime";
import { useQuirks } from "../../useQuirks";
import { type AddressOutletContext } from "../AddressMainPage";
import { usePageTitle } from "../../useTitle";

const PAGE_SIZE = 25;

const AddressZRC2Results: FC = () => {
  const { address } = useOutletContext<AddressOutletContext>();
  usePageTitle("ZRC2 Transfers");
  
  const { provider } = useContext(RuntimeContext);
  const quirks = useQuirks(provider);
  const hasCode = useHasCode(provider, address);
  const isContractAddress = hasCode === true;
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();

  // Fetch all transactions for the address
  const pageNumber = usePageNumber(1);
  const { results, total } = useAddressTransactions(provider, address, pageNumber - 1, PAGE_SIZE);

  // Extract ZRC2 transfers from the fetched transactions
  const zrc2Transfers = useMemo(() => {
    if (!results || !quirks?.isZilliqa1) return [];
    
    const transfers: Array<{
      transfer: ReturnType<typeof findZRC2TransfersInEventLog>[0];
      txHash: string;
      blockNumber: number;
    }> = [];

    results.forEach((result) => {
      if (result.receipt && result.receipt.logs) {
        const txTransfers = findZRC2TransfersInEventLog(result.receipt.logs);
        txTransfers.forEach((transfer) => {
          // Only include transfers where the address is involved (as from or to)
          if (transfer.from === address || transfer.to === address) {
            transfers.push({
              transfer,
              txHash: result.transaction.hash,
              blockNumber: result.transaction.blockNumber!,
            });
          }
        });
      }
    });

    return transfers;
  }, [results, address, quirks?.isZilliqa1]);

  const selection = useSelection();

  if (!quirks?.isZilliqa1) {
    return (
      <ContentFrame>
        <div className="py-4 text-sm text-gray-500">
          ZRC2 transfers are only available on Zilliqa networks
        </div>
      </ContentFrame>
    );
  }

  const page = useMemo(() => {
    const start = (pageNumber - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, zrc2Transfers.length);
    return zrc2Transfers.slice(start, end);
  }, [zrc2Transfers, pageNumber]);

  const totalZRC2Count = zrc2Transfers.length;

  return (
    <ContentFrame>
      <SelectionContext.Provider value={selection}>
        <div className="flex justify-between items-baseline py-3">
          <div className="text-sm text-gray-500">
            {totalZRC2Count > 0 && (
              <>
                Showing {page.length} ZRC2 transfer
                {page.length > 1 && "s"} from {totalZRC2Count} total
              </>
            )}
          </div>
        </div>
        {results === undefined ? (
          <PendingResults />
        ) : (
          <>
            <ResultHeader
              feeDisplay={feeDisplay}
              feeDisplayToggler={feeDisplayToggler}
            />
            {page.length === 0 ? (
              <div className="py-4 text-sm text-gray-500">
                No ZRC2 transfers found for this address
              </div>
            ) : (
              <div className="space-y-2">
                {page.map((item, i) => (
                  <ZRC2Item
                    key={`${item.txHash}-${i}`}
                    transfer={item.transfer}
                    txHash={item.txHash}
                    blockNumber={item.blockNumber}
                    address={address}
                    feeDisplay={feeDisplay}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </SelectionContext.Provider>
    </ContentFrame>
  );
};

export default AddressZRC2Results;