import { FC, ReactNode, memo } from "react";
import { NavLink } from "react-router-dom";

type RecentNavBarProps = {
    isLoading : boolean
};

const RecentNavBar: FC<RecentNavBarProps> = ({ isLoading }) => (
  <div className="flex items-baseline justify-between py-3">
    <div className="text-sm text-gray-500">
      {isLoading
        ? "Waiting for blocks..."
        : "Transaction Blocks"}
    </div>
    <NavLink
        className={"text-link-blue hover:text-link-blue-hover truncate"}
        to={`/blocklist`}
        title={"Block List"}
      >
        {"Block List"}
      </NavLink>
  </div>
);

export default memo(RecentNavBar);
