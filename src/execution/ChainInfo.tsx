import { FC, memo, useContext } from "react";
import BCInfoToolTip from "../components/BCInfoToolTip";
import BlockLink from "../components/BlockLink";
import ChainInfoHeader from "../components/ChainInfoHeader";
import ChainInfoItem from "../components/ChainInfoItem";
import ContentFrame from "../components/ContentFrame";
import { PendingChainInfoResults } from "../search/PendingResults";
import { useBCInfoStateInfo, useLatestBlockChainInfo } from "../useLatestBlock";
import { RuntimeContext } from "../useRuntime";
import { useQuirks } from "../useQuirks";

const ChainInfo: FC = () => {
  const { zilliqa, provider } = useContext(RuntimeContext);
  const quirks = useQuirks(provider);

  const latestBlockChainInfo = useLatestBlockChainInfo(zilliqa);

  const BCInfo = useBCInfoStateInfo(latestBlockChainInfo);

  let gridValues = "grid-rows-2 grid-cols-4"
  if (quirks?.isZilliqa1) {
    gridValues = "grid-rows-3 grid-cols-4"
  }
  gridValues = "grid items-baseline gap-x-1 border-t border-b border-gray-200 bg-gray-100 text-sm " + gridValues;
  // Return a table with rows containing the basic information of the most recent RECENT_SIZE blocks
  return (
    <ContentFrame isLoading={latestBlockChainInfo === undefined}>
      <div className="pb-3">
        <ChainInfoHeader isLoading={latestBlockChainInfo === undefined} />
        {latestBlockChainInfo ? (
          <div
          className={ gridValues }
          >
            <span>
              <ChainInfoItem
                title="Current Tx Epoch:"
                data={latestBlockChainInfo.NumTxBlocks}
              />
            </span>
            <span>
              <ChainInfoItem
                title="Number of Transactions:"
                data={latestBlockChainInfo.NumTransactions}
              />
            </span>
            { quirks?.isZilliqa1 && (<span>
              <ChainInfoItem
                title="Peers:"
                data={latestBlockChainInfo.NumPeers}
              />
              </span>) }
            { quirks?.isZilliqa1 && (<span>
              <ChainInfoItem
                title="Sharding Structure:"
                data={`[${latestBlockChainInfo.ShardingStructure.NumPeers.toString()}]`}
              />
              </span>)
            }
            { quirks?.isZilliqa1 && (
              <span>
                <ChainInfoItem
                title="Current DS Epoch:"
                data={latestBlockChainInfo.CurrentDSEpoch}
                />
                </span>
            )}
          { quirks?.isZilliqa1 && (
            <span>
              <ChainInfoItem
                title="DS Block Rate:"
                data={latestBlockChainInfo.DSBlockRate.toFixed(5)}
                />
              </span>)
              }
            <span>
              <ChainInfoItem
                title="Tx Block Rate:"
                data={latestBlockChainInfo.TxBlockRate.toFixed(5)}
              />
            </span>
            <span>
              <ChainInfoItem
                title="TPS:"
                data={latestBlockChainInfo.TransactionRate.toFixed(5)}
              />
            </span>
            { quirks?.isZilliqa1 && (
              <span>
                <ChainInfoItem
              title="Number of Txns in DS Epoch:"
              data={latestBlockChainInfo.NumTxnsDSEpoch}
                />
                </span>
            )}
          {quirks?.isZilliqa1 && (
            <span>
              <ChainInfoItem
            title="Number of Txns in Txn Epoch:"
                data={latestBlockChainInfo.NumTxnsTxEpoch}
              />
              </span>
          )}
            <span>
              <ChainInfoItem
                title={
                  <span>
                    <BCInfoToolTip
                      child={`This statistic is accurate from TxBlock ${BCInfo?.startTxBlock}. Requires user to stay on the Home Page`}
                    />{" "}
                    Recent Max Observed TPS:
                  </span>
                }
                data={
                  <span>
                    {BCInfo?.maxTPS.toFixed(5)}{" "}
                    {BCInfo?.startTxBlock && (
                      <span className="text-xs">
                        <span className="text-gray-500">
                          (on TxBlock{" "}
                          <BlockLink blockTag={BCInfo?.startTxBlock} />)
                        </span>
                      </span>
                    )}
                  </span>
                }
              />
            </span>
            <span>
              <ChainInfoItem
                title={
                  <span>
                    <BCInfoToolTip
                      child={`This statistic is accurate from TxBlock ${BCInfo?.startTxBlock}. Requires user to stay on the Home Page`}
                    />{" "}
                    Recent Max Observed Txn Count:
                  </span>
                }
                data={
                  <span>
                    {BCInfo?.maxTxnCount}{" "}
                    {BCInfo?.startTxBlock && (
                      <span className="text-xs">
                        <span className="text-gray-500">
                          (on TxBlock{" "}
                          <BlockLink blockTag={BCInfo?.startTxBlock} />)
                        </span>
                      </span>
                    )}
                  </span>
                }
              />
            </span>
          </div>
        ) : (
          <PendingChainInfoResults />
        )}
      </div>
    </ContentFrame>
  );
};

export default memo(ChainInfo);
