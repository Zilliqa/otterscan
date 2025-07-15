import { FC } from "react";
import { NavLink } from "react-router-dom";

type PlainAddressProps = {
  address: string;
  bech32Address?: string | undefined;
  linkable: boolean;
  dontOverrideColors: boolean | undefined;
};

const PlainAddress: FC<PlainAddressProps> = ({
  address,
  linkable,
  dontOverrideColors,
  bech32Address,
}) => {
  if (linkable) {
    return (
      <NavLink
        className={`${
          dontOverrideColors ? "" : "text-link-blue hover:text-link-blue-hover"
        } truncate font-address`}
        to={`/address/${address}`}
        title={address}
      >
        {bech32Address || address}
      </NavLink>
    );
  }

  return (
    <span className="truncate font-address text-gray-400" title={address}>
      {address}
    </span>
  );
};

export default PlainAddress;
