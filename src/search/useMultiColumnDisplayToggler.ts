import { useState } from "react";

export enum MultiColumnDisplay {
  SHOW_PARENT = 0,
  SHOW_PROPOSER = 1,
}

export const useMultiColumnDisplayToggler = (): [
  MultiColumnDisplay,
  () => void,
] => {
  const [multiColumnDisplay, setMultiColumnDisplay] =
    useState<MultiColumnDisplay>(MultiColumnDisplay.SHOW_PARENT);
  const multiColumnDisplayToggler = () => {
    if (multiColumnDisplay === MultiColumnDisplay.SHOW_PARENT) {
      setMultiColumnDisplay(MultiColumnDisplay.SHOW_PROPOSER);
    } else {
      setMultiColumnDisplay(MultiColumnDisplay.SHOW_PARENT);
    }
  };
  return [multiColumnDisplay, multiColumnDisplayToggler];
};
