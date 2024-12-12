import { faQrcode, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, lazy, memo, useContext, useState } from "react";
import { Link } from "react-router-dom";
import PriceBox from "./PriceBox";
import SourcifyMenu from "./SourcifyMenu";
import NetworkMenu from "./NetworkMenu";
import InlineCode from "./components/InlineCode";
import { useGenericSearch } from "./search/search";
import { RuntimeContext } from "./useRuntime";
// @ts-expect-error
import Otter from "./otter.png?w=128&h=128&webp";

const CameraScanner = lazy(() => import("./search/CameraScanner"));
type HeaderProps = { sourcifyPresent: boolean };

// Should really move out to utils
const Header: FC<HeaderProps> = ({ sourcifyPresent }) => {
  const { config, provider } = useContext(RuntimeContext);
  const [searchRef, handleChange, handleSubmit] = useGenericSearch();
  const [isScanning, setScanning] = useState<boolean>(false);
  const [isHelpOpen, setHelpOpen] = useState<boolean>(false);

  return (
    <>
      {isScanning && <CameraScanner turnOffScan={() => setScanning(false)} />}
      <div className="flex flex-col sm:flex-row items-baseline space-y-1 sm:space-y-0 justify-between px-3 lg:px-9 py-2">
        <div className="flex flex-row justify-between sm:self-center items-center w-full sm:w-auto shrink-0 mr-2">
          <Link className="self-center" to="/">
            <div className="flex items-center space-x-2 font-title text-2xl font-bold text-link-blue">
              <img
                className="rounded-full"
                src={Otter}
                width={32}
                height={32}
                alt="An otter scanning"
                title="An otter scanning"
              />
              <span>
                {config.branding?.siteName || "Otterscan"}
                {config.experimental && <span className="text-red-400">2</span>}
              </span>
            </div>
      </Link>
        </div>
      <div className="pt-2 flex items-center justify-center">
      <NetworkMenu />
         </div>
        <div className="flex items-baseline gap-x-3">
          {(provider._network.chainId === 1n ||
            config.priceOracleInfo?.nativeTokenPrice?.ethUSDOracleAddress) && (
            <div className="hidden lg:inline">
              <PriceBox />
            </div>
          )}
          <form
            className="flex"
            onSubmit={handleSubmit}
            autoComplete="off"
            spellCheck={false}
          >
            <input
              className="w-full rounded-l border-b border-l border-t px-2 py-1 text-sm focus:outline-none"
              type="text"
              size={80}
              placeholder={`Type "/" to search by address / txn hash / #ds block number${
                provider._network.getPlugin(
                  "org.ethers.plugins.network.Ens",
                ) !== null
                  ? " / ENS name"
                  : ""
              }`}
              onChange={handleChange}
              ref={searchRef}
            />
            <button
              className="border bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="button"
              onClick={() => setScanning(true)}
              title="Scan an ETH address using your camera"
            >
              <FontAwesomeIcon icon={faQrcode} />
            </button>
            <button
              className="border bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="button"
              onClick={() => setHelpOpen(true)}
              title="Help with searching"
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
            <button
              className="rounded-r border-b border-r border-t bg-skin-button-fill px-2 py-1 text-sm text-skin-button hover:bg-skin-button-hover-fill focus:outline-none"
              type="submit"
            >
              Search
            </button>
          </form>
           <div className="hidden sm:inline self-stretch">
            {sourcifyPresent && <SourcifyMenu />}
          </div>
        </div>
      </div>
      {isHelpOpen && (
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Help Information
                    </h3>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        <p>Search terms are interpreted as..</p>
                        <br />
                        <ul className="list-disc list-inside mb-6">
                          <li>
                            {" "}
                            A bech32 address if it is in the right format.
                          </li>
                          <li>
                            {" "}
                            An address if we can (right length, starts with{" "}
                            <InlineCode>0x</InlineCode> or{" "}
                            <InlineCode>zil1</InlineCode>).
                          </li>
                          <li>
                            {" "}
                            If a 32-character hex string we'll try to search as
                            a transaction id
                          </li>
                          <li>
                            {" "}
                            If a &gt; 40 character hex string, we'll think it's
                            probably an address with leading 0s.
                          </li>
                          <li>
                            {" "}
                            Then we'll attempt an{" "}
                            <InlineCode>BigInt</InlineCode> and try to find a
                            block number
                          </li>
                          <li>
                            {" "}
                            Terms starting with <InlineCode>#</InlineCode> are
                            treated as a DS block number for ZQ1
                          </li>
                          <li>
                            {" "}
                            Terms like{" "}
                            <InlineCode>epoch:&lt;number&gt;</InlineCode> are
                            epochs.
                          </li>
                          <li>
                            {" "}
                            Terms like{" "}
                            <InlineCode>
                              validator:&lt;number&gt;
                            </InlineCode>{" "}
                            are validator searches.
                          </li>
                        </ul>
                        <p>
                          If the search term does not match any of those rules,
                          we interpret it as an ENS name.
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setHelpOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Header);
