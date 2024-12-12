import { FC, memo } from "react";
import { useParams } from "react-router-dom";
import StandardFrame from "../components/StandardFrame";
import SlotItem from "./epoch/SlotItem";

const Epoch: FC = () => {
  const { epochNumber } = useParams();
  return <StandardFrame>Zilliqa is epochless</StandardFrame>;
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
