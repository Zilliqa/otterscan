import {
  JsonRpcApiProvider,
  TransactionReceiptParams,
  TransactionResponse,
  isAddress,
  isHexString,
} from "ethers";
import {
  ChangeEventHandler,
  FormEventHandler,
  RefObject,
  useRef,
  useState,
} from "react";
import { NavigateFunction, useNavigate } from "react-router";
import useKeyboardShortcut from "use-keyboard-shortcut";
import {
  getOpFeeData,
  isOptimisticChain,
} from "../execution/op-tx-calculation";
import { PAGE_SIZE } from "../params";
import { queryClient } from "../queryClient";
import { ProcessedTransaction, TransactionChunk } from "../types";
import { formatter } from "../utils/formatter";
import { fromBech32Address } from "@zilliqa-js/crypto";



export const rawToProcessed = (provider: JsonRpcApiProvider, _rawRes: any) => {
  const _res: TransactionResponse[] = _rawRes.txs.map(
    (t: any) =>
      new TransactionResponse(formatter.transactionResponse(t), provider),
  );

  return {
    txs: _res.map((t, i): ProcessedTransaction => {
      const _rawReceipt = _rawRes.receipts[i];
      const _receipt: TransactionReceiptParams =
        formatter.transactionReceiptParams(_rawReceipt);

      let fee: bigint;
      let gasPrice: bigint;
      if (isOptimisticChain(provider._network.chainId)) {
        const l1Fee: bigint = formatter.bigInt(_rawReceipt.l1Fee ?? 0n);
        ({ fee, gasPrice } = getOpFeeData(
          t.type,
          t.gasPrice!,
          _receipt.gasUsed,
          l1Fee,
        ));
      } else {
        fee = _receipt.gasUsed * t.gasPrice!;
        gasPrice = t.gasPrice!;
      }

      return {
        blockNumber: t.blockNumber!,
        timestamp: formatter.number(_rawReceipt.timestamp),
        idx: _receipt.index,
        hash: t.hash,
        type: t.type,
        from: t.from,
        to: t.to ?? null,
        createdContractAddress: _receipt.contractAddress ?? undefined,
        value: t.value,
        fee,
        gasPrice,
        data: t.data,
        status: _receipt.status!,
      };
    }),
    firstPage: _rawRes.firstPage,
    lastPage: _rawRes.lastPage,
  };
};

export const getTransactionQuery = (
  provider: JsonRpcApiProvider,
  transactionHash: string,
) => ({
  queryKey: ["eth_getTransactionByHash", transactionHash],
  queryFn: () => {
    return provider.getTransaction(transactionHash);
  },
});

export const searchTransactionsQuery = (
  provider: JsonRpcApiProvider,
  address: string,
  baseBlock: number,
  direction: "before" | "after",
): {
  queryKey: [string, string, number];
  queryFn: () => Promise<TransactionChunk>;
} => {
  const method =
    direction === "before"
      ? "ots_searchTransactionsBefore"
      : "ots_searchTransactionsAfter";
  return {
    queryKey: [method, address, baseBlock],
    queryFn: async () => {
      const _rawRes = await provider.send(method, [
        address,
        baseBlock,
        PAGE_SIZE,
      ]);
      return rawToProcessed(provider, _rawRes);
    },
  };
};

export class SearchController {
  private txs: ProcessedTransaction[];

  private pageStart: number;

  private pageEnd: number;

  private constructor(
    readonly address: string,
    txs: ProcessedTransaction[],
    readonly isFirst: boolean,
    readonly isLast: boolean,
    boundToStart: boolean,
  ) {
    this.txs = txs;
    if (boundToStart) {
      this.pageStart = 0;
      this.pageEnd = Math.min(txs.length, PAGE_SIZE);
    } else {
      this.pageEnd = txs.length;
      this.pageStart = Math.max(0, txs.length - PAGE_SIZE);
    }
  }

  static async firstPage(
    provider: JsonRpcApiProvider,
    address: string,
  ): Promise<SearchController> {
    const newTxs: TransactionChunk = await queryClient.fetchQuery(
      searchTransactionsQuery(provider, address, 0, "before"),
    );
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      true,
    );
  }

  static async middlePage(
    provider: JsonRpcApiProvider,
    address: string,
    hash: string,
    next: boolean,
  ): Promise<SearchController> {
    const tx = await queryClient.fetchQuery(
      getTransactionQuery(provider, hash),
    );
    // TODO: Can we actually infer that this transaction is not null?
    const newTxs = await queryClient.fetchQuery(
      searchTransactionsQuery(
        provider,
        address,
        tx!.blockNumber!,
        next ? "before" : "after",
      ),
    );
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      next,
    );
  }

  static async lastPage(
    provider: JsonRpcApiProvider,
    address: string,
  ): Promise<SearchController> {
    const newTxs = await queryClient.fetchQuery(
      searchTransactionsQuery(provider, address, 0, "after"),
    );
    return new SearchController(
      address,
      newTxs.txs,
      newTxs.firstPage,
      newTxs.lastPage,
      false,
    );
  }

  getPage(): ProcessedTransaction[] {
    return this.txs.slice(this.pageStart, this.pageEnd);
  }

  async prevPage(
    provider: JsonRpcApiProvider,
    hash: string,
  ): Promise<SearchController> {
    if (this.txs[this.pageStart].hash === hash) {
      const overflowPage = this.txs.slice(0, this.pageStart);
      const baseBlock = this.txs[0].blockNumber;
      const prevPage = await queryClient.fetchQuery(
        searchTransactionsQuery(provider, this.address, baseBlock, "after"),
      );
      return new SearchController(
        this.address,
        prevPage.txs.concat(overflowPage),
        prevPage.firstPage,
        prevPage.lastPage,
        false,
      );
    }

    return this;
  }

  async nextPage(
    provider: JsonRpcApiProvider,
    hash: string,
  ): Promise<SearchController> {
    if (this.txs[this.pageEnd - 1].hash === hash) {
      const overflowPage = this.txs.slice(this.pageEnd);
      const baseBlock = this.txs[this.txs.length - 1].blockNumber;
      const nextPage = await queryClient.fetchQuery(
        searchTransactionsQuery(provider, this.address, baseBlock, "before"),
      );
      return new SearchController(
        this.address,
        overflowPage.concat(nextPage.txs),
        nextPage.firstPage,
        nextPage.lastPage,
        true,
      );
    }

    return this;
  }
}

const doSearch = async (q: string, navigate: NavigateFunction) => {
  const redir = parseSearch(q);
  if (redir !== undefined) {
    navigate(redir);
  }
};

export const parseSearch = (q: string): string | undefined => {
  // Cleanup
  q = q.trim();

  let maybeAddress = q;
  let maybeIndex = "";
  const sepIndex = q.lastIndexOf(":");
  if (sepIndex !== -1) {
    maybeAddress = q.substring(0, sepIndex);
    const afterAddress = q.substring(sepIndex + 1);
    maybeIndex = !isNaN(parseInt(afterAddress))
      ? parseInt(afterAddress).toString()
      : "";
  }

  // Parse URLs for other block explorers
  try {
    const url = new URL(q);
    const pathname = url.pathname.replace(/\/$/, "");

    const addressMatch = pathname.match(/^\/(?:address|token)\/(.*)$/);
    const txMatch = pathname.match(/^\/tx\/(.*)$/);
    const blockMatch = pathname.match(/^\/block\/(\d+)$/);
    const epochMatch = pathname.match(/^\/epoch\/(.*)$/);
    const slotMatch = pathname.match(/^\/slot\/(.*)$/);
    const validatorMatch = pathname.match(/^\/validator\/(.*)$/);
    if (addressMatch) {
      maybeAddress = addressMatch[1];
      // The URL might use a different port number
      maybeIndex = "";
    } else if (txMatch) {
      q = txMatch[1];
    } else if (blockMatch) {
      q = blockMatch[1];
    } else if (epochMatch) {
      q = "epoch:" + epochMatch[1];
    } else if (slotMatch) {
      q = "slot:" + slotMatch[1];
    } else if (validatorMatch) {
      q = "validator:" + validatorMatch[1];
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }

  // Tx hash?
  if (isHexString(q, 32)) {
    console.log(`search: this looks like a txn hash - ${q}`);
    navigate(`/tx/${q}`);
    return;
  } else if (isHexString(`0x${q}`, 32)) {
    navigate(`/tx/0x${q}`);
    return;
  }

  // Zilliqa address?
  try {
    maybeAddress = fromBech32Address(maybeAddress);
    console.log(`search: bech32 address to base16 - ${maybeAddress}`);
  } catch (e) {
    console.log(`search: Not a bech32 address`);
  }

  // The type checker is convinced that ethers:isAddress() will never say that a string > 40 characters
  // long is not an address. I'm not sure why...
  if (!isAddress(maybeAddress)) {
    let typeCheckerIsWrong = maybeAddress as string;
    if (typeCheckerIsWrong.length > 40) {
      try {
        maybeAddress =
          "0x" +
          typeCheckerIsWrong
            .substr(typeCheckerIsWrong.length - 40)
            .toLowerCase();
      } catch (e) {
        // Obviously not.
      }
    }
  }

  // Plain address?
  if (isAddress(maybeAddress)) {
    console.log(`search: maybeAddress ${maybeAddress} is an address ..`);
    return `/address/${maybeAddress}${maybeIndex !== "" ? `?nonce=${maybeIndex}` : ""}`;
  }

  // Block number?
  // If the number here is very large, parseInt() will return an fp number which
  // will cause errors, so ..
  try {
    let toParse = q;
    console.log(`search: try to parse ${toParse} as a block number`);
    const blockNumber = BigInt(toParse);
    console.log(`search: ${toParse} Parses as a block number ${blockNumber}`);
    navigate(`/block/${blockNumber.toString()}`);
    return;
  } catch (e) {
    // Obviously not!
  }

  // DS Block number?
  if (q.charAt(0) === "#") {
    const dsBlockNumber = parseInt(q.substring(1));
    if (!isNaN(dsBlockNumber)) {
      console.log(`search: # ${dsBlockNumber} - it's a ds block number`);
      navigate(`/dsblock/${dsBlockNumber}`);
      return;
    }
  }

  // Epoch?
  if (q.startsWith("epoch:")) {
    const mayBeEpoch = q.substring(6);
    const epoch = parseInt(mayBeEpoch);
    if (!isNaN(epoch)) {
      console.log(`search: epoch: ${epoch}`);
      return `/epoch/${epoch}`;
    }
  }

  // Slot?
  if (q.startsWith("slot:")) {
    const mayBeSlot = q.substring(5);
    const slot = parseInt(mayBeSlot);
    if (!isNaN(slot)) {
      console.log(`search: slot: ${slot}`);
      return `/slot/${slot}`;
    }
  }

  // Validator?
  if (q.startsWith("validator:")) {
    const mayBeValidator = q.substring(10);

    // Validator by index
    if (mayBeValidator.match(/^\d+$/)) {
      console.log(`search: validator: ${mayBeValidator}`);
      const validatorIndex = parseInt(mayBeValidator);
      return `/validator/${validatorIndex}`;
    }

    // Validator by public key
    if (mayBeValidator.length === 98 && isHexString(mayBeValidator, 48)) {
      return `/validator/${mayBeValidator}`;
    }
  }

  // Assume it is an ENS name
  console.log(`search: no match: assuming ${maybeAddress} is an ENS name`);
  return `/address/${maybeAddress}${maybeIndex !== "" ? `?nonce=${maybeIndex}` : ""}`;
};

export const useGenericSearch = (): [
  RefObject<HTMLInputElement>,
  ChangeEventHandler<HTMLInputElement>,
  FormEventHandler<HTMLFormElement>,
] => {
  const [searchString, setSearchString] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const searchTerm = e.target.value.trim();
    setCanSubmit(searchTerm.length > 0);
    setSearchString(searchTerm);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    if (searchRef.current) {
      searchRef.current.value = "";
    }
    doSearch(searchString, navigate);
  };

  const searchRef = useRef<HTMLInputElement>(null);
  useKeyboardShortcut(
    ["/"],
    () => {
      searchRef.current?.focus();
    },
    {
      overrideSystem: true,
    },
  );

  return [searchRef, handleChange, handleSubmit];
};
