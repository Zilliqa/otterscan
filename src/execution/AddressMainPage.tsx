import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabGroup, TabList, TabPanels } from "@headlessui/react";
import { fromBech32Address } from "@zilliqa-js/crypto";
import { validation } from "@zilliqa-js/util";
import React, { useCallback, useContext } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AddressOrENSNameNotFound from "../components/AddressOrENSNameNotFound";
import NavTab from "../components/NavTab";
import StandardFrame from "../components/StandardFrame";
import { useProxyAttributes } from "../ots2/usePrototypeTransferHooks";
import SourcifyLogo from "../sourcify/SourcifyLogo";
import { Match, useSourcifyMetadata } from "../sourcify/useSourcify";
import { useWhatsabiMetadata } from "../sourcify/useWhatsabi";
import { ChecksummedAddress } from "../types";
import { useERC1967ProxyAttributes } from "../useERC1967";
import { useHasCode } from "../useErigonHooks";
import { useAddressOrENS } from "../useResolvedAddresses";
import { RuntimeContext } from "../useRuntime";
import AddressSubtitle from "./address/AddressSubtitle";
import { AddressAwareComponentProps } from "./types";

const ProxyTabs: React.FC<AddressAwareComponentProps> = ({ address }) => {
  const { addressOrName } = useParams();
  const { provider } = useContext(RuntimeContext);
  const proxyAttrs = useProxyAttributes(provider, address);
  return (
    <>
      {proxyAttrs.proxyHasCode && proxyAttrs.proxyMatch && (
        <NavTab href={`/address/${addressOrName}/proxyLogicContract`}>
          <span className={`flex items-baseline space-x-2`}>
            <span>Logic Contract</span>
            <SourcifyLogo />
          </span>
        </NavTab>
      )}
      {proxyAttrs.logicAddress && proxyAttrs.proxyMatch && (
        <NavTab href={`/address/${addressOrName}/readContractAsProxy`}>
          <span>Read as Proxy</span>
        </NavTab>
      )}
    </>
  );
};

export type AddressOutletContext = {
  address: string;
  hasCode: boolean | undefined;
  match: Match | null | undefined;
  whatsabiMatch: Match | null | undefined;
};

const AddressMainPage: React.FC = () => {
  const { uncheckedAddressOrName, direction } = useParams();
  if (uncheckedAddressOrName === undefined) {
    throw new Error("uncheckedAddressOrName couldn't be undefined here");
  }
  const addressOrName = validation.isBech32(uncheckedAddressOrName)
    ? fromBech32Address(uncheckedAddressOrName).toLowerCase()
    : uncheckedAddressOrName;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlFixer = useCallback(
    (address: ChecksummedAddress) => {
      navigate(
        `/address/${address}${
          direction ? "/" + direction : ""
        }?${searchParams.toString()}`,
        { replace: true },
      );
    },
    [navigate, direction, searchParams],
  );
  const [checksummedAddress, isENS, error] = useAddressOrENS(
    addressOrName,
    urlFixer,
  );

  const { config, provider } = useContext(RuntimeContext);
  const hasCode = useHasCode(provider, checksummedAddress);

  const match = useSourcifyMetadata(
    hasCode ? checksummedAddress : undefined,
    provider._network.chainId,
  );
  const whatsabiMatch = useWhatsabiMetadata(
    match === null && hasCode ? checksummedAddress : undefined,
    provider._network.chainId,
    provider,
    config.assetsURLPrefix,
  );

  const eip1967ProxyAttrs = useERC1967ProxyAttributes(
    provider,
    checksummedAddress,
  );

  return (
    <StandardFrame>
      {error ? (
        <AddressOrENSNameNotFound
          addressOrENSName={addressOrName}
          supportsENS={
            provider._network.getPlugin("org.ethers.plugins.network.Ens") !==
            null
          }
        />
      ) : (
        checksummedAddress && (
          <>
            <AddressSubtitle
              addressOrName={addressOrName}
              address={checksummedAddress}
              isENS={isENS}
            />
            <TabGroup>
              <TabList className="flex space-x-2 rounded-t-lg border-l border-r border-t bg-white">
                <NavTab href={`/address/${addressOrName}`}>Overview</NavTab>
                {config?.experimental && (
                  <>
                    <NavTab href={`/address/${addressOrName}/erc20`}>
                      ERC20 Transfers
                    </NavTab>
                    <NavTab href={`/address/${addressOrName}/erc721`}>
                      ERC721 Transfers
                    </NavTab>
                    <NavTab href={`/address/${addressOrName}/tokens`}>
                      Token Balances
                    </NavTab>
                    <NavTab href={`/address/${addressOrName}/withdrawals`}>
                      Withdrawals
                    </NavTab>
                    <NavTab href={`/address/${addressOrName}/blocksRewarded`}>
                      Blocks Rewarded
                    </NavTab>
                  </>
                )}
                {hasCode && (
                  <>
                    <NavTab href={`/address/${addressOrName}/contract`}>
                      <span
                        className={`flex items-baseline space-x-2 ${
                          match === undefined ? "italic opacity-50" : ""
                        }`}
                      >
                        <span>Contract</span>
                        {match === undefined ? (
                          <span className="self-center">
                            <FontAwesomeIcon
                              className="animate-spin"
                              icon={faCircleNotch}
                            />
                          </span>
                        ) : match === null ? (
                          <span className="self-center text-red-500">
                            <FontAwesomeIcon icon={faQuestionCircle} />
                          </span>
                        ) : (
                          <span className="self-center">
                            <SourcifyLogo />
                          </span>
                        )}
                      </span>
                    </NavTab>
                    {(match || whatsabiMatch) && (
                      <NavTab href={`/address/${addressOrName}/readContract`}>
                        <span className={`flex items-baseline space-x-2`}>
                          <span>Read Contract</span>
                        </span>
                      </NavTab>
                    )}
                    {(match || whatsabiMatch) &&
                      eip1967ProxyAttrs?.delegate && (
                        <NavTab
                          href={`/address/${addressOrName}/readContractAs1967Proxy`}
                        >
                          <span className={`flex items-baseline space-x-2`}>
                            <span>Read As Proxy</span>
                          </span>
                        </NavTab>
                      )}
                  </>
                )}
                {config?.experimental && (
                  <ProxyTabs address={checksummedAddress} />
                )}
              </TabList>
              <TabPanels>
                <Outlet
                  context={{
                    address: checksummedAddress,
                    hasCode,
                    match,
                    whatsabiMatch,
                  }}
                />
              </TabPanels>
            </TabGroup>
          </>
        )
      )}
    </StandardFrame>
  );
};

export default AddressMainPage;
