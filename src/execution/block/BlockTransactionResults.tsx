import { FC, memo } from "react";
import ContentFrame from "../../components/ContentFrame";
import { PAGE_SIZE } from "../../params";
import { PendingTransactionResults } from "../../search/PendingResults";
import SearchResultNavBar from "../../search/SearchResultNavBar";
import TransactionItem from "../../search/TransactionItem";
import TransactionResultHeader from "../../search/TransactionResultHeader";
import { totalTransactionsFormatter } from "../../search/messages";
import { useFeeToggler } from "../../search/useFeeToggler";
import StandardSelectionBoundary from "../../selection/StandardSelectionBoundary";
import { ProcessedTransaction } from "../../types";

type BlockTransactionResultsProps = {
  page?: ProcessedTransaction[];
  total: number;
  pageNumber: number;
  isLoading: boolean;
};

const BlockTransactionResults: FC<BlockTransactionResultsProps> = ({
  page,
  total,
  pageNumber,
  isLoading,
}) => {
  const [feeDisplay, feeDisplayToggler] = useFeeToggler();

  return (
    <ContentFrame isLoading={isLoading}>
      <SearchResultNavBar
        pageNumber={pageNumber}
        pageSize={PAGE_SIZE}
        total={total}
        totalFormatter={totalTransactionsFormatter}
      />
      <TransactionResultHeader
        feeDisplay={feeDisplay}
        feeDisplayToggler={feeDisplayToggler}
      />
      {page ? (
        <StandardSelectionBoundary>
          {page.map((tx) => (
            <TransactionItem key={tx.hash} tx={tx} feeDisplay={feeDisplay} />
          ))}
          <SearchResultNavBar
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            total={total}
            totalFormatter={totalTransactionsFormatter}
          />
        </StandardSelectionBoundary>
      ) : (
        <PendingTransactionResults />
      )}
    </ContentFrame>
  );
};

export default memo(BlockTransactionResults);
