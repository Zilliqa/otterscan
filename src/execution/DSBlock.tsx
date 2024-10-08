import { FC, useContext } from "react";
import { useParams } from "react-router-dom";
import BlockLink from "../components/BlockLink";
import BlockNotFound from "../components/BlockNotFound";
import ContentFrame from "../components/ContentFrame";
import InfoRow from "../components/InfoRow";
import NavBlock from "../components/NavBlock";
import StandardFrame from "../components/StandardFrame";
import StandardSubtitle from "../components/StandardSubtitle";
import Timestamp from "../components/Timestamp";
import { dsBlockURL } from "../url";
import { useLatestBlockChainInfo } from "../useLatestBlock";
import { RuntimeContext } from "../useRuntime";
import { useBlockPageTitle } from "../useTitle";
import { useDSBlockData } from "../useZilliqaHooks";
import {
  commify,
  pubKeyToAddr,
  zilliqaToOtterscanTimestamp,
} from "../utils/utils";
import DecoratedAddressLink from "./components/DecoratedAddressLink";

// TODO: Figure out what we want to do with the previous Hash field
const DSBlock: FC = () => {
  const { zilliqa } = useContext(RuntimeContext);
  const { dsBlockNumberOrHash } = useParams();
  if (dsBlockNumberOrHash === undefined) {
    throw new Error("dsBlockNumberOrHash couldn't be undefined here");
  }

  const { data: dsBlock, isLoading } = useDSBlockData(
    zilliqa,
    dsBlockNumberOrHash,
  );
  useBlockPageTitle(parseInt(dsBlockNumberOrHash));

  const latestBlockChainInfo = useLatestBlockChainInfo(zilliqa);
  const latestDSBlockNum = latestBlockChainInfo?.CurrentDSEpoch;

  return (
    <StandardFrame>
      <StandardSubtitle>
        <div className="flex items-baseline space-x-1">
          <span>DS Block</span>
          <span className="text-base text-gray-500">
            #{dsBlockNumberOrHash}
          </span>
          {dsBlock && (
            <NavBlock
              entityNum={parseInt(dsBlock.header.BlockNum)}
              latestEntityNum={
                latestDSBlockNum !== undefined
                  ? parseInt(latestDSBlockNum)
                  : undefined
              }
              urlBuilder={dsBlockURL}
            />
          )}
        </div>
      </StandardSubtitle>
      {dsBlock === null && (
        <BlockNotFound blockNumberOrHash={dsBlockNumberOrHash} />
      )}
      {dsBlock === undefined && (
        <ContentFrame>
          <InfoRow title="Block Height">Loading DS Block data...</InfoRow>
        </ContentFrame>
      )}
      {dsBlock && (
        <ContentFrame isLoading={isLoading}>
          <InfoRow title="Block Height">
            <span className="font-bold">
              {commify(dsBlock.header.BlockNum)}
            </span>
          </InfoRow>
          <InfoRow title="Timestamp">
            <Timestamp
              value={zilliqaToOtterscanTimestamp(dsBlock.header.Timestamp)}
            />
          </InfoRow>
          <InfoRow title="DS Leader">
            <DecoratedAddressLink
              address={pubKeyToAddr(dsBlock.header.LeaderPubKey)}
              miner
            />
          </InfoRow>
          <InfoRow title="Gas Used/Limit">
            {commify(dsBlock.header.GasPrice)}
          </InfoRow>
          <InfoRow title="Difficulty">
            {commify(dsBlock.header.Difficulty.toString())}
          </InfoRow>
          <InfoRow title="Total Difficulty">
            {commify(dsBlock.header.DifficultyDS.toString())}
          </InfoRow>
          <InfoRow title="Previous Hash">
            <BlockLink blockTag={dsBlock.header.PrevHash} />
          </InfoRow>
        </ContentFrame>
      )}
    </StandardFrame>
  );
};

export default DSBlock;
