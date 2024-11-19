import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ContentFrame from "../components/ContentFrame";
import StandardFrame from "../components/StandardFrame";
import StandardSubtitle from "../components/StandardSubtitle";
import { PAGE_SIZE } from "../params";
import BlockItem from "../search/BlockItem";
import BlockResultHeader from "../search/BlockResultHeader";
import { PendingBlockResults } from "../search/PendingResults";
import SearchResultNavBar from "../search/SearchResultNavBar";
import { totalBlocksFormatter } from "../search/messages";
import {
  EmptyBlocksDisplay,
  useEmptyBlocksToggler,
} from "../search/useEmptyBlocksToggler";
import { useFeeToggler } from "../search/useFeeToggler";
import { useMultiColumnDisplayToggler } from "../search/useMultiColumnDisplayToggler";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import { useRecentBlocks } from "../useErigonHooks";
import { useLatestBlockNumber } from "../useLatestBlock";
import { RuntimeContext } from "../useRuntime";

const BlockList: React.FC = () => {
  const { provider } = useContext(RuntimeContext);

  const latestBlockNum = useLatestBlockNumber(provider);
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();
  const [emptyBlocksDisplay, emptyBlocksDisplayToggler] =
    useEmptyBlocksToggler();
  const [multiColumnDisplay, multiColumnDisplayToggler] =
    useMultiColumnDisplayToggler();

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
    pageNumber - 1,
    PAGE_SIZE,
  );

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex items-baseline space-x-1">Tx Block List</div>
      </StandardSubtitle>
      <ContentFrame isLoading={isLoading}>
        <SearchResultNavBar
          pageNumber={pageNumber}
          pageSize={PAGE_SIZE}
          total={latestBlockNum}
          totalFormatter={totalBlocksFormatter}
        />
        <BlockResultHeader
          feeDisplay={feeDisplay}
          feeDisplayToggler={feeDisplayToggler}
          emptyBlocksDisplay={emptyBlocksDisplay}
          emptyBlocksDisplayToggler={emptyBlocksDisplayToggler}
          multiColumnDisplay={multiColumnDisplay}
          multiColumnDisplayToggler={multiColumnDisplayToggler}
        />
        {data ? (
          <StandardSelectionBoundary>
            {data
              .map((block) =>
                block &&
                (emptyBlocksDisplay === EmptyBlocksDisplay.SHOW_EMPTY_BLOCKS ||
                  block.transactionCount != 0) ? (
                  <BlockItem
                    key={block.number}
                    block={block}
                    feeDisplay={feeDisplay}
                    multiColumnDisplay={multiColumnDisplay}
                  />
                ) : undefined,
              )
              .filter((blk) => blk !== undefined)}
          </StandardSelectionBoundary>
        ) : (
          <PendingBlockResults />
        )}
      </ContentFrame>
    </StandardFrame>
  );
};

export default BlockList;
