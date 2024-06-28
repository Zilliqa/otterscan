import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlockTag } from "ethers";
import { FC, memo } from "react";
import { NavLink } from "react-router-dom";
import { dsBlockURL } from "../url";
import { commify } from "../utils/utils";

type DSBlockLinkProps = {
  blockTag: BlockTag;
};

const DSBlockLink: FC<DSBlockLinkProps> = ({ blockTag }) => {
  const isNum = typeof blockTag === "number";
  const isText = typeof blockTag === "string";
  let text = "";
  if (isNum) {
    text = commify(blockTag);
  } else if (isText) {
    text = blockTag;
  } else {
    text = "0x";
  }

  return (
    <NavLink
      className={`flex-inline items-baseline space-x-1 text-link-blue hover:text-link-blue-hover ${
        isNum ? "font-blocknum" : "font-hash"
      }`}
      to={dsBlockURL(blockTag)}
    >
      <span className="text-black">
        <FontAwesomeIcon className="self-center" icon={faCube} size="1x" />
      </span>
      <span>{text}</span>
    </NavLink>
  );
};

export default memo(DSBlockLink);
