import React, { useContext } from "react";
import NetworkMenuWithConfig from "./NetworkMenuWithConfig.tsx";
import { RuntimeContext } from "./useRuntime";
import { OtterscanConfig } from "./useConfig";

const NetworkMenu: React.FC = () => {
  let { config } = useContext(RuntimeContext);
  return <NetworkMenuWithConfig config={config} />;
};

export default React.memo(NetworkMenu);
