import { FC, memo, useContext } from "react";
import ContentFrame from "../../components/ContentFrame";
import { RECENT_SIZE } from "../../params";
import { PendingRecentDSBlockResults } from "../../search/PendingResults";
import RecentDSBlockItem from "../../search/RecentDSBlockItem";
import RecentDSBlockResultHeader from "../../search/RecentDSBlockResultHeader";
import RecentDSNavBar from "../../search/RecentDSNavBar";
import StandardSelectionBoundary from "../../selection/StandardSelectionBoundary";
import { useLatestBlockChainInfo } from "../../useLatestBlock";
import { RuntimeContext } from "../../useRuntime";
import { useDSBlocksData } from "../../useZilliqaHooks";

const RecentDSBlocks: FC = () => {
  const { zilliqa } = useContext(RuntimeContext);

  const latestBlockChainInfo = useLatestBlockChainInfo(zilliqa);
  const latestBlockNum = latestBlockChainInfo?.CurrentDSEpoch;

  // Uses hook to get the most recent blocks
  const { data, isLoading } = useDSBlocksData(
    zilliqa,
    latestBlockNum !== undefined ? parseInt(latestBlockNum, 10) : undefined,
    0,
    RECENT_SIZE,
  );

  // Return a table with rows containing the basic information of the most recent RECENT_SIZE blocks
  return (
    <ContentFrame isLoading={isLoading}>
      <RecentDSNavBar isLoading={data === undefined} />
      <RecentDSBlockResultHeader />
      {data ? (
        <StandardSelectionBoundary>
          {data.map((block) =>
            block ? (
              <RecentDSBlockItem key={block.header.BlockNum} block={block} />
            ) : (
              <></>
            ),
          )}
        </StandardSelectionBoundary>
      ) : (
        <PendingRecentDSBlockResults />
      )}
    </ContentFrame>
  );
};

export default memo(RecentDSBlocks);
