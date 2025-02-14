import { Tab } from "@headlessui/react";
import React from "react";
import SwitchTab from "../../components/SwitchTab";
import { SyntaxHighlighter, docco } from "../../highlight-init";
import { HighlightedCode } from "../../components/HighlightedCode";
import { ScillaInitParams } from "./ScillaInitParams";
import { ScillaState } from "./ScillaState";

type ContractProps = {
  address: string;
  content: any;
};

const ScillaContract: React.FC<ContractProps> = ({ address, content }) => {
  let [loadContractState, setLoadContractState] = React.useState<number>(0);

  return (
    <div>
      <Tab.Group>
        <Tab.List>
          <SwitchTab>Code</SwitchTab>
          <SwitchTab>Init Params</SwitchTab>
          <SwitchTab>State</SwitchTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
      <HighlightedCode
    language="scilla"
    content = {content ?? ""}
      />
          </Tab.Panel>
          <Tab.Panel>
            {" "}
            <ScillaInitParams address={address} />
          </Tab.Panel>
          <Tab.Panel>
            <ScillaState
              address={address}
              loadContractState={loadContractState}
              setLoadContractState={setLoadContractState}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default React.memo(ScillaContract);
