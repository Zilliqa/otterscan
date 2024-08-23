import { FC, memo, useState, useContext, useEffect, useMemo } from "react";
import { RuntimeContext } from "../../useRuntime";
import StandardTextarea from "../../components/StandardTextarea";
import StandardSelectionBoundary from "../../selection/StandardSelectionBoundary";
import { useSmartContractState, ContractState, StateValue } from "../../useZilliqaHooks";


type ScillaStateProps = {
  address : String
  loadContractState: boolean,
  setLoadContractState: (boolean) => void,
};

type ScillaStateRowProps = {
  name: string,
  value: string
};


const ScillaStateParamRow: FC<ScillaInitParamRowProps> = ({
  name,
  value } ) => {
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
  return JSON.stringify(value,null, 2);
}

export const ScillaState: FC<ScillaStateProps> = ({
  address, loadContractState, setLoadContractState })  => {
    const { zilliqa }  = useContext(RuntimeContext);
    let [ contractState, setContractState ] = useState<string>(null);

    let { data, loading } = useSmartContractState(loadContractState ? zilliqa : null, address);
    if (data && contractState == null) {
      setContractState(data);
    }

    if (!loadContractState && !contractState) {
      return (
        <div className="mt-6">
          <button className="text-link-blue hover:text-link-blue-hover"
        onClick={() => setLoadContractState(true)} >
          Load Contract State</button>
          </div>
      )
    }

    if (!contractState) {
      return (
        <div> Loading contract state </div>)
    }

    return (
        <div className="mt-6"><table className="w-ful border">
          <thead>
         <tr className="grid grid-cols-12 gap-x-2 bg-gray-100 py-2 text-left">
           <th className="col-span-3 pl-1">name</th>
           <th className="col-span-8 pr-1">value</th>
         </tr>
        </thead>
        <tbody className="divide-y">
        {contractState ?
          (Object.keys(contractState).map((val) => <ScillaStateParamRow key={val} name={val} value={formatJsonValue(contractState[val])} />)) : undefined }
       </tbody>
          </table>
          </div>
      )
  }
