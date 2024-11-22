import { FC, useContext, useState } from "react";
import { RuntimeContext } from "../../useRuntime";
import { ContractState, useSmartContractState } from "../../useZilliqaHooks";

type ScillaStateProps = {
  address: string;
  loadContractState: boolean | undefined;
  setLoadContractState: (arg0: boolean) => void;
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
  return JSON.stringify(value, null, 2);
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
  );
  if (data && contractState == null) {
    setContractState(data);
  }

  if (!loadContractState && !contractState) {
    return (
      <div className="mt-6">
        <button
          className="text-link-blue hover:text-link-blue-hover"
          onClick={() => setLoadContractState(true)}
        >
          Load Contract State
        </button>
      </div>
    );
  }

  if (!contractState) {
    return <div className="mt-6"> Loading contract state </div>;
  }

  return (
    <div className="mt-6">
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
  );
};
