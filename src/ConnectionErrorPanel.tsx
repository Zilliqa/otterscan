import {
  faCheckCircle,
  faClock,
  faTimesCircle,
  faBarsProgress
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, PropsWithChildren, memo } from "react";
import { ConnectionStatus } from "./types";
import NetworkMenuWithConfig  from "./NetworkMenuWithConfig";
import { OtterscanConfig } from "./useConfig";

type ConnectionErrorPanelProps = {
  connStatus: ConnectionStatus;
  nodeURL: string;
  config: OtterscanConfig
};

const ConnectionErrorPanel: FC<ConnectionErrorPanelProps> = ({
  connStatus,
  nodeURL,
  config
}) => {
  return (
    <div className="flex h-screen flex-col font-sans">
      <div className="min-w-lg m-auto h-60 max-w-lg text-lg">
        <Step type="wait" msg="Trying to connect to Zilliqa node..." />
        <div className="flex space-x-2">
          <span className="ml-7 text-base">{nodeURL}</span>
        </div>
        {connStatus === ConnectionStatus.NOT_ETH_NODE && (
          <Step type="error" msg="It does not seem to be a Zilliqa node">
            <p>Make sure your browser can access the URL above.</p>
            <p>
              If you want to customize the Zilliqa rpc endpoint, please follow
              the instructions in the <code>README.md</code>.
            </p>
          </Step>
        )}
        {connStatus === ConnectionStatus.NOT_ERIGON && (
          <>
            <Step type="ok" msg="It is a Zilliqa node" />
            <Step type="error" msg="It does not seem to be a Zilliqa node">
              Make sure your Zilliqa node is up and running.
            </Step>
          </>
        )}
        {connStatus === ConnectionStatus.NOT_OTTERSCAN_PATCHED && (
          <>
            <Step type="ok" msg="It is a Zilliqa node" />
            <Step
              type="error"
              msg="It does not seem to contain up-to-date Otterscan patches"
            >
              Check your Zilliqa node version.
            </Step>
          </>
        )}
      <div className="flex space-x-2 mt-2"> 
      <span className="text-blue-600">
      <FontAwesomeIcon icon={faBarsProgress} size="1x" />
      </span>
      <NetworkMenuWithConfig config={config} />
      </div>
      </div>
    </div>
  );

};

type StepProps = {
  type: "wait" | "ok" | "error";
  msg: string;
};

const Step: FC<PropsWithChildren<StepProps>> = memo(
  ({ type, msg, children }) => (
    <>
      <div className="flex space-x-2">
        {type === "wait" && (
          <span className="text-gray-600">
            <FontAwesomeIcon icon={faClock} size="1x" />
          </span>
        )}
        {type === "ok" && (
          <span className="text-emerald-600">
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
          </span>
        )}
        {type === "error" && (
          <span className="text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} size="1x" />
          </span>
        )}
    { type === "change" && (
      <span className="text-blue-600">
        <FontAwesomeIcon icon={faBarsProgress} size="1x" />
        </span>
    )}
        <span>{msg}</span>
      </div>
      {children && <div className="ml-7 mt-4 text-sm">{children}</div>}
    </>
  ),
);

export default memo(ConnectionErrorPanel);
