import { useContext, FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { commify } from "@ethersproject/units";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurn } from "@fortawesome/free-solid-svg-icons";
import Timestamp from "./components/Timestamp";
import { RuntimeContext } from "./useRuntime";
import { useLatestBlockHeader } from "./useLatestBlock";
import { blockURL, slotURL } from "./url";
import { useFinalizedSlotNumber, useSlotTimestamp } from "./useConsensus";
import Header from "./Header";
import RecentBlocks from "./execution/block/RecentBlocks";
import RecentDSBlocks from "./execution/block/RecentDSBlocks";


const Home: FC = () => {
  const { provider } = useContext(RuntimeContext);

  const latestBlock = useLatestBlockHeader(provider);
  const finalizedSlotNumber = useFinalizedSlotNumber();
  const slotTime = useSlotTimestamp(finalizedSlotNumber);

  document.title = "Home | Otterscan";

  return (
    <>
      <Header sourcifyPresent= {false} />
      <div className="grid grid-cols-5 gap-x-1 mx-1">
        <span className="col-span-2">
          <RecentDSBlocks />
        </span>
        <span className="col-span-3">
            <RecentBlocks />
        </span>
      </div>
      <div className="flex grow flex-col items-center pb-5 text-lg font-bold text-link-blue hover:text-link-blue-hover">
        {provider?.network.chainId !== 11155111 && (
          <NavLink to="/special/london">
            <div className="flex items-baseline space-x-2 text-orange-500 hover:text-orange-700 hover:underline">
              <span>
                <FontAwesomeIcon icon={faBurn} />
              </span>
              <span>Check out the special dashboard for EIP-1559</span>
              <span>
                <FontAwesomeIcon icon={faBurn} />
              </span>
            </div>
          </NavLink>
        )}
      </div>
      {latestBlock && (
        <NavLink
          className="mt-5 flex flex-col items-center space-y-1 text-sm text-gray-500 hover:text-link-blue"
          to={blockURL(latestBlock.number)}
        >
          <div>Latest block: {commify(latestBlock.number)}</div>
          <Timestamp value={latestBlock.timestamp} />
        </NavLink>
      )}
      {finalizedSlotNumber !== undefined && (
        <NavLink
          className="mt-5 flex flex-col items-center space-y-1 text-sm text-gray-500 hover:text-link-blue"
          to={slotURL(finalizedSlotNumber)}
        >
          <div>Finalized slot: {commify(finalizedSlotNumber)}</div>
          {slotTime && <Timestamp value={slotTime} />}
        </NavLink>
      )}
    </>
  );
};

export default memo(Home);
