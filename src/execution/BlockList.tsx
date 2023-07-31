import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import StandardFrame from "../components/StandardFrame";
import BlockTransactionResults from "./block/BlockTransactionResults";
import { PAGE_SIZE } from "../params";
import { useBlockTransactionsPageTitle } from "../useTitle";
import { RuntimeContext } from "../useRuntime";
import StandardSubtitle from "../components/StandardSubtitle";
import { useLatestBlockHeader } from "../useLatestBlock";
import { useRecentBlocks } from "../useErigonHooks";
import BlockItem from "../search/BlockItem";
import PendingBlockResults from "../search/PendingBlockResults";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import { useFeeToggler } from "../search/useFeeToggler";
import ContentFrame from "../components/ContentFrame";
import BlockResultHeader from "../search/BlockResultHeader";
import RecentNavBar from "../search/RecentNavBar";

const BlockTransactions: React.FC = () => {
  const { provider } = useContext(RuntimeContext);
  
  const latestBlock = useLatestBlockHeader(provider);

  const [feeDisplay, feeDisplayToggler] = useFeeToggler();
  const latestBlockNum = latestBlock?.number;
  

  const [searchParams] = useSearchParams();
  let pageNumber = 1;
  const p = searchParams.get("p");
  if (p) {
    try {
      pageNumber = parseInt(p);
    } catch (err) {}
  }

  const { data, isLoading } = useRecentBlocks(
    provider,
    latestBlockNum,
    PAGE_SIZE
  );

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex items-baseline space-x-1">Block List</div>
      </StandardSubtitle>
      <ContentFrame isLoading={isLoading}>
        <RecentNavBar isLoading={ data === undefined }/>
        <BlockResultHeader
            feeDisplay={feeDisplay}
            feeDisplayToggler={feeDisplayToggler}
        />
        {data ? (
            <StandardSelectionBoundary>
            {data.map((block) => (
                block ? <BlockItem key={block.number} block={block} feeDisplay={feeDisplay} /> : <></> 
            ))}
            </StandardSelectionBoundary>
        ) : (
            <PendingBlockResults />
        )}
    </ContentFrame>
    </StandardFrame>
  );
};

export default BlockTransactions;
