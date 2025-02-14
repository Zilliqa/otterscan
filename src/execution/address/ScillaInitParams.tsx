import { FC, useContext } from "react";
import { RuntimeContext } from "../../useRuntime";
import { useSmartContractInit } from "../../useZilliqaHooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

type ScillaInitParamsProps = {
  address: string;
};

type ScillaInitParamRowProps = {
  name: string;
  valueType: string;
  value: string;
};

const formatJsonValue = (value: any): string => {
  if (typeof(value)=="object") {
    return JSON.stringify(value, null, 2);
  } else {
    return value
  }
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
      <td className="col-span-8 text-gray-500">{formatJsonValue(value)}</td>
      </tr>
    </>
  );
};

export const ScillaInitParams: FC<ScillaInitParamsProps> = ({ address }) => {
  const { zilliqa } = useContext(RuntimeContext);
  const { data, isLoading } = useSmartContractInit(zilliqa, address);
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data) ?? "");
  };

  if (isLoading) {
    return (
      <div className="mt-6">
        Loading (or cannot retrieve) contract init parameters
      </div>
    );
  } else {
    return (
      <div className="mt-6">
      <button
    className="absolute hover:bg-skin-button-hover-fill focus:outline-none"
    type="button"
    onClick={handleCopy}
    title="Copy to clipboard"
      >
      <FontAwesomeIcon icon={faCopy} />
        </button>
       <div className='h-8'></div>

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
