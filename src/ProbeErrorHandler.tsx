import { FC } from "react";
import { useAsyncError } from "react-router-dom";
import ConnectionErrorPanel from "./ConnectionErrorPanel";
import { ProbeError } from "./ProbeError";
import { OtterscanConfig } from "./useConfig";

type ProbeErrorHandlerProps = {
  config: OtterscanConfig;
};

const ProbeErrorHandler: FC<ProbeErrorHandlerProps> = ({
  config,
}: ProbeErrorHandlerProps) => {
  const err = useAsyncError();
  if (!(err instanceof ProbeError)) {
    throw err;
  }
  return (
    <ConnectionErrorPanel
      connStatus={err.status}
      nodeURL={err.nodeURL}
      config={config}
    />
  );
};

export default ProbeErrorHandler;
