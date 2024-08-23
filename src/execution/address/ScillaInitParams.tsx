import { FC, useContext } from "react";
import { RuntimeContext } from "../../useRuntime";
import { useSmartContractInit } from "../../useZilliqaHooks";

type ScillaInitParamsProps = {
  address: string;
};

type ScillaInitParamRowProps = {
  name: string;
  valueType: string;
  value: string;
};

const ScillaInitParamRow: FC<ScillaInitParamRowProps> = ({
  name,
  valueType,
  value,
}) => {
  return (
    <>
      <tr className="grid grid-cols-12 gap-x-2 py-2 hover:bg-gray-100">
        <td className="col-span-3 pl-1">
          <span className="text-gray-600">{name}</span>
        </td>
        <td className="col-span-1 text-gray-500">{valueType}</td>
        <td className="col-span-8 text-gray-500">{value}</td>
      </tr>
    </>
  );
};

export const ScillaInitParams: FC<ScillaInitParamsProps> = ({ address }) => {
  const { zilliqa } = useContext(RuntimeContext);
  let { data, isLoading } = useSmartContractInit(zilliqa, address);
  if (isLoading) {
    return (
      <div className="mt-6">
        Loading (or cannot retrieve) contract init parameters
      </div>
    );
  } else {
    return (
      <div className="mt-6">
        <table className="w-ful border">
          <thead>
            <tr className="grid grid-cols-12 gap-x-2 bg-gray-100 py-2 text-left">
              <th className="col-span-3 pl-1">name</th>
              <th className="col-span-1 pl-1">type</th>
              <th className="col-span-8 pr-1">value</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data
              ? data.map((val) => (
                  <ScillaInitParamRow
                    key={val.vname}
                    name={val.vname}
                    valueType={val.type}
                    value={val.value}
                  />
                ))
              : undefined}
          </tbody>
        </table>
      </div>
    );
  }
};
