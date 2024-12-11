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

const NetworkMenu: React.FC = () => {
  const { provider, config } = useContext(RuntimeContext);
  let connections = config.connections;
  async function goToNetwork(name:string) {
    console.log(name);
    const result = await chooseConnection(config, name);
    if (result) {
      console.log("Connection changed. Reloading .. ");
      window.location.reload();
    }
  };
  const connectionItems = connections.map(conn => <div key={conn.menuName}><NetworkMenuItem onClick={() => goToNetwork(conn.menuName)}
                                          checked={conn.url===config.erigonURL} name={conn.menuName} url={conn.url}></NetworkMenuItem></div>);
  return (
    <Menu>
      <div className="relative self-stretch h-full">
      <MenuButton className="flex h-full w-full items-center justify-center space-x-2 rounded border px-2 py-1 text-sm">
      Networks
      </MenuButton>
      <MenuItems className="absolute left-0 mt-1 flex min-w-max flex-col rounded-b border bg-white p-1 text-sm">
      {connectionItems}
      </MenuItems>
      </div>
      </Menu>
  )
}

type NetworkMenuItemProps = {
  checked?: boolean;
  name: string;
  url: string;
  onClick:  (event?:any) => void;

  
};

export const NetworkMenuItem: React.FC<
  PropsWithChildren<NetworkMenuItemProps>> = ({ checked, name, url, onClick }) => (
    <MenuItem>
    {({ focus }) => (
      <button
        className={`px-2 py-1 text-left text-sm ${
          focus ? "border-zq-lightblue text-gray-500" : "text-gray-400"
        } transition-colors transition-transform duration-75 ${
            checked ? "text-gray-900" : ""
}`}
      onClick={onClick}
      >
        {name} / {url}
      </button>
    )}
  </MenuItem>
);

export default React.memo(NetworkMenu);

