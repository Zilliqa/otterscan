import React, { useContext } from "react";
import { RuntimeContext } from "./useRuntime";

const Footer: React.FC = () => {
  const { provider, config } = useContext(RuntimeContext);

  return (
    <>
      <div
        className={`w-full border-t border-t-gray-100 px-2 py-1 text-xs ${
          provider._network.chainId === 1n
            ? "bg-link-blue dark:bg-link-blue-light text-gray-200 dark:text-gray-800"
            : "bg-zq-lightblue text-white font-bold"
        } flex justify-between items-center`}
      >
        <div className="flex-grow text-center">
          {provider ? (
            <>Using Zilliqa node at {config?.erigonURL}</>
          ) : (
            <>Waiting for the provider...</>
          )}
        </div>
        <div className="flex-shrink-0 ml-2">zq otterscan {config?.version}</div>
      </div>
    </>
  );
};

export default React.memo(Footer);
