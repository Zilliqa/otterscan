import {
  faCheckCircle,
  faClock,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren } from "react";
import { ConnectionStatus } from "./types";
import { OtterscanConfig } from "./useConfig";

type ConnectionErrorPanelProps = {
  connStatus: ConnectionStatus;
  config?: OtterscanConfig;
};

const ConnectionErrorPanel: React.FC<ConnectionErrorPanelProps> = ({
  connStatus,
  config,
}) => {
  return (
    <div className="flex h-screen flex-col font-sans">
      <div className="min-w-lg m-auto h-60 max-w-lg">
        <Step type="wait" msg="Trying to connect to Zilliqa node..." />
        <div className="flex space-x-2">
          <span className="ml-7 text-base">{config?.erigonURL}</span>
        </div>
        {connStatus === ConnectionStatus.NOT_ETH_NODE && (
          <Step type="error" msg="This does not seem to be a Zilliqa node">
            <p>Make sure your browser can access the URL above.</p>
          </Step>
        )}
        {connStatus === ConnectionStatus.NOT_ERIGON && (
          <>
            <Step type="ok" msg="It is a Zilliqa node" />
            <Step type="error" msg="It does not seem to be an Zilliqa node">
              Make sure your Zilliqa node is running.
            </Step>
          </>
        )}
        {connStatus === ConnectionStatus.NOT_OTTERSCAN_PATCHED && (
          <>
            <Step type="ok" msg="It is a Zilliqa node" />
            <Step
              type="error"
              msg="It does not seem to contain up-to-date Otterscan patches"
            ></Step>
          </>
        )}
      </div>
    </div>
  );
};

type StepProps = {
  type: "wait" | "ok" | "error";
  msg: string;
};

const Step: React.FC<PropsWithChildren<StepProps>> = React.memo(
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
        <span>{msg}</span>
      </div>
      {children && <div className="ml-7 mt-4 text-sm">{children}</div>}
    </>
  ),
);

export default React.memo(ConnectionErrorPanel);
