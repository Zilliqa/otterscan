import { FC, useContext, memo } from "react";
import ContentFrame from "../../components/ContentFrame";
import StandardSelectionBoundary from "../../selection/StandardSelectionBoundary";
import { RuntimeContext } from "../../useRuntime";
import { useDSBlockData } from "../../useErigonHooks";
import { RECENT_SIZE } from "../../params";
import RecentDSBlockItem from "../../search/RecentDSBlockItem";
import { PendingRecentDSBlockResults } from "../../search/PendingResults";
import RecentDSNavBar from "../../search/RecentDSNavBar";
import RecentDSBlockResultHeader from "../../search/RecentDSBlockResultHeader";


const RecentDSBlocks: FC = () => {
  const { zilliqa } = useContext(RuntimeContext);

  const latestBlockNum = 59265;

  // Uses hook to get the most recent blocks
  const { data, isLoading } = useDSBlockData(
    zilliqa,
    latestBlockNum,
    0,
    RECENT_SIZE
  );

  // Return a table with rows containing the basic information of the most recent RECENT_SIZE blocks
  return (
    <ContentFrame isLoading={isLoading}>
      <RecentDSNavBar isLoading={ data === undefined }/>
      <RecentDSBlockResultHeader/>
      {data ? (
        <StandardSelectionBoundary>
          {data.map((block) => (
            block ? <RecentDSBlockItem key={block.header.BlockNum} block={block} /> : <></> 
          ))}
        </StandardSelectionBoundary>
      ) : (
        <PendingRecentDSBlockResults />
      )}
    </ContentFrame>
  );
};

export default memo(RecentDSBlocks);
