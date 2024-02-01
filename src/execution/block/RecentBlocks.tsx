import { FC, memo, useContext } from "react";
import ContentFrame from "../../components/ContentFrame";
import { RECENT_SIZE } from "../../params";
import { PendingRecentBlockResults } from "../../search/PendingResults";
import RecentBlockItem from "../../search/RecentBlockItem";
import RecentBlockResultHeader from "../../search/RecentBlockResultHeader";
import RecentNavBar from "../../search/RecentNavBar";
import { useFeeToggler } from "../../search/useFeeToggler";
import StandardSelectionBoundary from "../../selection/StandardSelectionBoundary";
import { useRecentBlocks } from "../../useErigonHooks";
import { useLatestBlockNumber } from "../../useLatestBlock";
import { RuntimeContext } from "../../useRuntime";

const RecentBlocks: FC = () => {
  const { provider } = useContext(RuntimeContext);
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();

  const latestBlockNum = useLatestBlockNumber(provider);

  // Uses hook to get the most recent blocks
  const { data, isLoading } = useRecentBlocks(
    provider,
    latestBlockNum,
    0,
    RECENT_SIZE,
  );

  // Return a table with rows containing the basic information of the most recent RECENT_SIZE blocks
  return (
    <ContentFrame isLoading={isLoading}>
      <RecentNavBar isLoading={data === undefined} />
      <RecentBlockResultHeader
        feeDisplay={feeDisplay}
        feeDisplayToggler={feeDisplayToggler}
      />
      {data ? (
        <StandardSelectionBoundary>
          {data.map((block) =>
            block ? (
              <RecentBlockItem
                key={block.number}
                block={block}
                feeDisplay={feeDisplay}
              />
            ) : (
              <></>
            ),
          )}
        </StandardSelectionBoundary>
      ) : (
        <PendingRecentBlockResults />
      )}
    </ContentFrame>
  );
};

export default memo(RecentBlocks);
