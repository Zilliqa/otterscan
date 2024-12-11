import { FC, memo, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TickerContextProvider } from "../components/AutoRefreshAge";
import ContentFrame from "../components/ContentFrame";
import InfoRow from "../components/InfoRow";
import StandardFrame from "../components/StandardFrame";
import StandardTBody from "../components/StandardTBody";
import StandardTHead from "../components/StandardTHead";
import StandardTable from "../components/StandardTable";
import Timestamp from "../components/Timestamp";
import StandardSelectionBoundary from "../selection/StandardSelectionBoundary";
import {
  useEpochTimestamp,
  useFinalizedSlotNumber,
  useReversedSlotsFromEpoch,
} from "../useConsensus";
import { usePageTitle } from "../useTitle";
import Finalized from "./components/Finalized";
import NotFinalized from "./components/NotFinalized";
import EpochSubtitle from "./epoch/EpochSubtitle";
import SlotItem from "./epoch/SlotItem";

const Epoch: FC = () => {
  const { epochNumber } = useParams();
  return ( <StandardFrame>
    Zilliqa is epochless
           </StandardFrame> );
};

type SlotListProps = {
  slots: number[];
};

const SlotList: FC<SlotListProps> = memo(({ slots }) => (
  <>
    {slots.map((s) => (
      <SlotItem key={s} slotNumber={s} />
    ))}
  </>
));

export default Epoch;
