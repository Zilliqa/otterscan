import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ContentFrame from "../components/ContentFrame";
import StandardFrame from "../components/StandardFrame";
import StandardSubtitle from "../components/StandardSubtitle";
import { PAGE_SIZE } from "../params";
import DSBlockItem from "../search/DSBlockItem";
import DSBlockResultHeader from "../search/DSBlockResultHeader";
import { PendingRecentDSBlockResults } from "../search/PendingResults";
import SearchResultNavBar from "../search/SearchResultNavBar";
import { totalBlocksFormatter } from "../search/messages";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import { useLatestBlockChainInfo } from "../useLatestBlock";
import { RuntimeContext } from "../useRuntime";
import { useDSBlocksData } from "../useZilliqaHooks";

const DSBlockList: React.FC = () => {
  const { zilliqa } = useContext(RuntimeContext);

  const latestBlockChainInfo = useLatestBlockChainInfo(zilliqa);
  const latestBlockNum = latestBlockChainInfo?.CurrentDSEpoch;
  const latestBlockNumInt =
    latestBlockNum !== undefined ? parseInt(latestBlockNum, 10) : undefined;

  const [searchParams] = useSearchParams();
  let pageNumber = 1;
  const p = searchParams.get("p");
  if (p) {
    try {
      pageNumber = parseInt(p);
    } catch (err) {}
  }

  const { data, isLoading } = useDSBlocksData(
    zilliqa,
    latestBlockNumInt,
    pageNumber - 1,
    PAGE_SIZE,
  );

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex items-baseline space-x-1">DS Block List</div>
      </StandardSubtitle>
      <ContentFrame isLoading={isLoading}>
        <SearchResultNavBar
          pageNumber={pageNumber}
          pageSize={PAGE_SIZE}
          total={latestBlockNumInt}
          totalFormatter={totalBlocksFormatter}
        />
        <DSBlockResultHeader />
        {data ? (
          <StandardSelectionBoundary>
            {data.map((block) =>
              block ? (
                <DSBlockItem key={block.header.BlockNum} block={block} />
              ) : (
                <></>
              ),
            )}
          </StandardSelectionBoundary>
        ) : (
          <PendingRecentDSBlockResults />
        )}
      </ContentFrame>
    </StandardFrame>
  );
};

export default DSBlockList;

