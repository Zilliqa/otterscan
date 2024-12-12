import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggler from "./components/ThemeToggler";
import { SourcifySource } from "./sourcify/useSourcify";
import { useAppConfigContext } from "./useAppConfig";
import { FC, lazy, memo, useContext, useState } from "react";
import { RuntimeContext } from "./useRuntime";
import { chooseConnection } from "./useConfig";
import NetworkMenuWithConfig from "./NetworkMenuWithConfig.tsx";

type NetworkMenuWithConfigProps = {
  config: OtterscanConfig;
}

const NetworkMenu: React.FC = () => {
  let { config } = useContext(RuntimeContext);
  return (<NetworkMenuWithConfig config={config} />)
}

export default React.memo(NetworkMenu)
