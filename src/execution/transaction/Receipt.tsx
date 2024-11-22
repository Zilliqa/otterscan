import { FC, memo, useContext } from "react";
import ContentFrame from "../../components/ContentFrame";
import { TransactionData } from "../../types";
import { useGetRawReceipt } from "../../useErigonHooks";
import { RuntimeContext } from "../../useRuntime";

type ReceiptProps = {
  txData: TransactionData;
};

const Receipt: FC<ReceiptProps> = ({ txData }) => {
  let txHash = txData.transactionHash;
  const { provider } = useContext(RuntimeContext);
  const rawReceipt = useGetRawReceipt(provider, txHash);
  const receiptString = JSON.stringify(rawReceipt, null, 2);

  return (
    <ContentFrame tabs>
      <div>
        <pre>{receiptString}</pre>
      </div>
    </ContentFrame>
  );
};

export default memo(Receipt);
