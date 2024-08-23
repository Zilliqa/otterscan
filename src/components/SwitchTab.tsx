import { Tab } from "@headlessui/react";
import React, { Fragment, PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

type SwitchTabProps = {
  href: string;
};

const SwitchTab: React.FC<PropsWithChildren<SwitchTabProps>> = ({
  disabled,
  children,
}) => (
  <Tab className={({ selected }) => (
        `${
disabled ? "cursor-default border-gray-100 text-gray-300" :
( selected ? "border-link-blue text-link-blue" : "border-transparent text-gray-500" )
} border-b-2 px-3 py-3 text-sm font-bold hover:text-link-blue` )} 
  disabled={disabled}
    >
      {children}
  </Tab>
);

export default SwitchTab;
