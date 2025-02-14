import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useContext, useState } from "react";
import { RuntimeContext } from "../../useRuntime";
import { ContractState, useSmartContractState } from "../../useZilliqaHooks";

type ScillaStateProps = {
  address: string;
  loadContractState: number | undefined;
  setLoadContractState: React.Dispatch<React.SetStateAction<number>>;
};

type ScillaStateRowProps = {
  name: string;
  value: string;
};

const ScillaStateParamRow: FC<ScillaStateRowProps> = ({ name, value }) => {
  return (
    <>
      <tr className="grid grid-cols-12 gap-x-2 py-2 hover:bg-gray-100">
        <td className="col-span-3 pl-1">
          <span className="text-gray-600">{name}</span>
        </td>
        <td className="col-span-8 text-gray-500">{value}</td>
      </tr>
    </>
  );
};

const formatJsonValue = (value: any): string => {
  if (typeof value == "object") {
    return JSON.stringify(value, null, 2);
  } else {
    return value;
  }
};

export const ScillaState: FC<ScillaStateProps> = ({
  address,
  loadContractState,
  setLoadContractState,
}) => {
  const { zilliqa } = useContext(RuntimeContext);
  const [contractState, setContractState] = useState<ContractState | null>(
    null,
  );
  const { data, isLoading } = useSmartContractState(
    loadContractState ? zilliqa : undefined,
    address,
    loadContractState ?? 0,
  );
  if (data && contractState == null) {
    setContractState(data);
  }

  if (!loadContractState && !contractState) {
    return (
      <div className="mt-6">
        <button
          className="text-link-blue hover:text-link-blue-hover"
          onClick={() => setLoadContractState((prev: number) => prev + 1)}
        >
          Load Contract State
        </button>
      </div>
    );
  }

  if (!contractState) {
    return <div className="mt-6"> Loading contract state </div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(contractState) ?? "");
  };

  return (
    <div className="mt-6">
      <button
        className="text-link-blue hover:text-link-blue-hover"
        onClick={() => {
          setContractState(null);
          setLoadContractState((prev: number) => prev + 1);
        }}
      >
        Refresh
      </button>

      <div className="inline-block w-16"></div>
      <button
        className="absolute hover:bg-skin-button-hover-fill focus:outline-none"
        type="button"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>

      <div className={isLoading ? "opacity-50" : ""}>
        <table className="w-ful border">
          <thead>
            <tr className="grid grid-cols-12 gap-x-2 bg-gray-100 py-2 text-left">
              <th className="col-span-3 pl-1">name</th>
              <th className="col-span-8 pr-1">value</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contractState
              ? Object.keys(contractState).map((val) => (
                  <ScillaStateParamRow
                    key={val}
                    name={val}
                    value={formatJsonValue(contractState[val])}
                  />
                ))
              : undefined}
          </tbody>
        </table>
      </div>
    </div>
  );
};
