import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { FC, PropsWithChildren, useState } from "react";
import InlineCode from "./components/InlineCode";
import {
  OtterscanConfig,
  chooseConnection,
  deleteParametersFromLocation,
  newConnection,
  forgetLocalStorage
} from "./useConfig";

type NetworkMenuWithConfigProps = {
  config: OtterscanConfig;
};

// className="flex h-full w-full items-center justify-center space-x-2 rounded border px-2 py-1 text-sm">
const NetworkMenuWithConfig: FC<NetworkMenuWithConfigProps> = ({ config }) => {
  const [goToOpen, setGoToOpen] = useState<boolean>(false);
  const [connectUrl, setConnectUrl] = useState<string>("");
  const [connectName, setConnectName] = useState<string>("");
  let connections = config.connections;
  if (connections === undefined) {
    return (
      <Menu>
        <div className="relative self-stretch h-full">
          <MenuButton className="flex items-center justify-center space-x-2 rounded border px-2 py-1 text-sm">
            No Networks
          </MenuButton>
          <MenuItems> </MenuItems>
        </div>
      </Menu>
    );
  }

  async function newNetwork(name: string, url: string) {
    let result = await newConnection(config, connectName, connectUrl);
    goToNetwork(name);
  }

  async function goToNetwork(name: string) {
    console.log("Switch to network " + name);
    const result = await chooseConnection(config, name);
    if (result) {
      console.log("Connection changed. Reloading .. ");
      await deleteParametersFromLocation();
      //window.location.reload();
    }
  }

  async function forgetBrowserSettings() {
    console.log("Forget browser settings");
    await forgetLocalStorage();
    window.location.reload();
  }
  
  var legend =
    connections.find((elem) => elem?.url == config?.erigonURL)?.menuName ??
    "Networks";

  const connectionItems = connections.map((conn) => (
    <div key={conn?.menuName}>
      <NetworkMenuItem
        onClick={() => goToNetwork(conn?.menuName)}
        checked={conn?.url === config.erigonURL}
        name={conn?.menuName}
        url={conn?.url ?? "(none)"}
      ></NetworkMenuItem>
    </div>
  ));
  return (
    <>
      <Menu>
        <div className="relative self-stretch h-full">
          <MenuButton className="flex items-center justify-center space-x-2 rounded border px-2 py-1 text-sm">
            {legend}
          </MenuButton>
          <MenuItems className="absolute left-0 mt-1 flex min-w-max flex-col rounded-b border bg-white p-1 text-sm">
            {connectionItems}
          <NetworkSetItem onClick={() => setGoToOpen(true)} />
      <RemoveConfigItem onClick={() => forgetBrowserSettings()} />
          </MenuItems>
        </div>
      </Menu>
      {goToOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:align-middle sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Connect to a network
                    </h3>
                    <div className="w-full mt-2 w-full">
                      <div className="text-sm">
                        {" "}
                        You can also configure these by giving the{" "}
                        <InlineCode>network</InlineCode> URL parameter to
                        indicate a URL and (optionally){" "}
                        <InlineCode>name</InlineCode> for the name
                      </div>
                      <div className="text-sm text-gray-500 w-full m-4">
                        Name:{" "}
                        <input
                          className="border ml-4 border-gray-400"
                          id="name"
                          onChange={(e) => setConnectName(e.target.value)}
                        ></input>
                      </div>
                      <div className="text-sm w-full m-4 min-w-[600px]">
                        URL:{" "}
                        <input
                          id="url"
                          className="min-w-[40ch] border ml-4 border-gray-400"
                          onChange={(e) => setConnectUrl(e.target.value)}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setGoToOpen(false);
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    if (!newNetwork(connectName, connectUrl)) {
                      alert("Connection not found?!");
                    }
                    setGoToOpen(false);
                  }}
                >
                  Connect
        </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type RemoveConfigItemProps = {
  onClick: (event?: any) => void;
};


export const RemoveConfigItem: React.FC<RemoveConfigItemProps> = ({ onClick}) => {
  return (
    <MenuItem>
      {({ focus }) => (
        <div
          className={`px-2 py-1 text-left text-sm ${
            focus ? "border-zq-lightblue text-gray-500" : "text-gray-400"
          } transition-colors transition-transform duration-75`}
        >
          <button name="Forget" onClick={onClick}>
          Forget Browser Settings
          </button>
        </div>
      )}
      </MenuItem>
  );
};

type NetworkSetItemProps = {
  onClick: (event?: any) => void;
};

export const NetworkSetItem: React.FC<NetworkSetItemProps> = ({ onClick }) => {
  return (
    <MenuItem>
      {({ focus }) => (
        <div
          className={`px-2 py-1 text-left text-sm ${
            focus ? "border-zq-lightblue text-gray-500" : "text-gray-400"
          } transition-colors transition-transform duration-75`}
        >
          <button name="Connect" onClick={onClick}>
            Connect
          </button>
        </div>
      )}
    </MenuItem>
  );
};

type NetworkMenuItemProps = {
  checked?: boolean;
  name: string;
  url: string;
  onClick: (event?: any) => void;
};

export const NetworkMenuItem: React.FC<
  PropsWithChildren<NetworkMenuItemProps>
> = ({ checked, name, url, onClick }) => (
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

export default React.memo(NetworkMenuWithConfig);
