import { FC, useContext } from "react";
import { NavLink, useOutletContext } from "react-router-dom";
import ContentFrame from "../../components/ContentFrame";
import { useSourcifyMetadata } from "../../sourcify/useSourcify";
import { useWhatsabiMetadata } from "../../sourcify/useWhatsabi";
import { addressURL } from "../../url.ts";
import { useERC1967ProxyAttributes } from "../../useERC1967";
import { RuntimeContext } from "../../useRuntime";
import { type AddressOutletContext } from "../AddressMainPage";
import ReadContract from "./contract/ReadContract";

const AddressReadContractAsProxy: FC = () => {
  const { address } = useOutletContext() as AddressOutletContext;
  const { config, provider } = useContext(RuntimeContext);
  const proxyAttributes = useERC1967ProxyAttributes(provider, address);
  const match = useSourcifyMetadata(
    proxyAttributes?.delegate,
    provider._network.chainId,
  );
  const whatsabiMatch = useWhatsabiMetadata(
    match === null ? proxyAttributes?.delegate : undefined,
    provider._network.chainId,
    provider,
    config.assetsURLPrefix,
  );

  return (
    <ContentFrame tabs>
      <div>
        <p className="py-6">
          {" "}
          Reading ERC-1967 proxy
          <NavLink
            className="rounded-lg bg-link-blue/10 px-2 py-1 text-xs text-link-blue hover:bg-link-blue/100 hover:text-white"
            to={addressURL(address)}
          >
            {address}
          </NavLink>
          whose implementation is at
          <NavLink
            className="rounded-lg bg-link-blue/10 px-2 py-1 text-xs text-link-blue hover:bg-link-blue/100 hover:text-white"
            to={addressURL(proxyAttributes!.delegate)}
          >
            {proxyAttributes?.delegate}
          </NavLink>
          .
        </p>
      </div>
      <ReadContract
        checksummedAddress={address}
        match={match ?? whatsabiMatch}
      />
    </ContentFrame>
  );
};

export default AddressReadContractAsProxy;
