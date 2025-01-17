import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  AbiCoder,
  Fragment,
  Interface,
  Log,
  LogDescription,
  keccak256,
  toUtf8Bytes,
} from "ethers";
import React, { FC, memo, useContext, useMemo } from "react";
import ModeTab from "../../components/ModeTab";
import { useSourcifyMetadata } from "../../sourcify/useSourcify";
import { RuntimeContext } from "../../useRuntime";
import { useTopic0 } from "../../useTopic0";
import TransactionAddressWithCopy from "../components/TransactionAddressWithCopy";
import DecodedLogSignature from "./decoder/DecodedLogSignature";
import DecodedParamsTable from "./decoder/DecodedParamsTable";
import DecodedScillaEncaps from "./decoder/DecodedScillaEncaps";
import DecodedScillaLogSignature from "./decoder/DecodedScillaLogSignature";
import DecodedScillaParamsTable from "./decoder/DecodedScillaParamsTable";
import LogIndex from "./log/LogIndex";
import RawLog from "./log/RawLog";
import TwoColumnPanel from "./log/TwoColumnPanel";

type LogEntryProps = {
  log: Log;
};

type ScillaLog = {
  eventName: string;
  address: string;
  params: object;
};

type ScillaEncapsLog = {
  kind: string;
  description: string;
};

type LogDescProps = {
  resolvedLogDesc: LogDescription;
};

const EvmLogDisplay: FC<LogDescProps> = ({ resolvedLogDesc }) => {
  return (
    <div>
      {" "}
      {resolvedLogDesc === undefined ? (
        <TwoColumnPanel>Waiting for data...</TwoColumnPanel>
      ) : resolvedLogDesc === null || resolvedLogDesc.fragment === undefined ? (
        <TwoColumnPanel>Cannot decode data</TwoColumnPanel>
      ) : (
        <TwoColumnPanel>
          <DecodedLogSignature event={resolvedLogDesc.fragment} />
          <DecodedParamsTable
            args={resolvedLogDesc.args}
            paramTypes={resolvedLogDesc.fragment?.inputs}
            hasParamNames={true}
          />
        </TwoColumnPanel>
      )}{" "}
    </div>
  );
};

/// Display a scilla log; if the log were null, we would have defaulted to
///  EvmLogDisplay, so no need to handle undefined or null.
const ScillaLogDisplay: FC<ScillaLog> = (scillaLogDesc) => {
  return (
    <div>
      {" "}
      <TwoColumnPanel>
        <DecodedScillaLogSignature
          name={scillaLogDesc.eventName}
          address={scillaLogDesc.address}
        />
        <DecodedScillaParamsTable params={scillaLogDesc.params as any} />
      </TwoColumnPanel>
    </div>
  );
};

const ScillaEncapsDisplay: FC<ScillaEncapsLog> = (scillaEncaps) => {
  return (
    <div>
      {" "}
      <TwoColumnPanel>
        <DecodedScillaEncaps
          kind={scillaEncaps.kind}
          description={scillaEncaps.description}
        />
      </TwoColumnPanel>
    </div>
  );
};

const LogEntry: FC<LogEntryProps> = ({ log }) => {
  const { provider } = useContext(RuntimeContext);
  const match = useSourcifyMetadata(log.address, provider._network.chainId);
  const scillaLogDesc: ScillaLog | undefined = useMemo(() => {
    // Scilla logs are encoded as a single JSON string.
    try {
      const data = JSON.parse(
        AbiCoder.defaultAbiCoder().decode(["string"], log.data)[0],
      );
      return {
        eventName: data._eventname,
        address: data.address,
        params: data.params,
      };
    } catch (err) {
      // Silently ignore on purpose
      return undefined;
    }
  }, [log]);
  const logDesc = useMemo(() => {
    if (!match) {
      return match;
    }

    const abi = match.metadata.output.abi;
    const intf = new Interface(abi as any);
    try {
      return intf.parseLog({
        topics: Array.from(log.topics),
        data: log.data,
      });
    } catch (err) {
      console.warn("Couldn't find function signature", err);
      return null;
    }
  }, [log, match]);

  const rawTopic0 = log.topics[0];
  // If rawTopic0 is keccak256("ScillaError(String)") or keccak256("ScillaException(String)")
  // this is secretly a Scilla exception and we should treat it as such. W00t. Magic :-)
  // Don't use id() here - the semantics we want are precisely those of the ZIP.
  // - rrw 2023-12-18
  const scillaErrorTopic = keccak256(toUtf8Bytes("ScillaError(string)"));
  const scillaExceptionTopic = keccak256(
    toUtf8Bytes("ScillaException(string)"),
  );
  const topic0ScillaEncapsLogDesc = useMemo(() => {
    const byteTopic0 = rawTopic0.toLowerCase();

    if (byteTopic0 == scillaExceptionTopic || byteTopic0 == scillaErrorTopic) {
      try {
        let kind =
          byteTopic0 == scillaExceptionTopic
            ? "Forwarded_Scilla_Exception"
            : "Forwarded_Scilla_Error";
        let parsed = AbiCoder.defaultAbiCoder().decode(["string"], log.data);
        return {
          kind,
          description: parsed[0],
        };
      } catch (err) {
        console.log(`Failed to parse Scilla error ${err}`);
        return undefined;
      }
    }
    return undefined;
  }, [rawTopic0, log]);

  const topic0 = rawTopic0 ? useTopic0(rawTopic0) : "";

  const topic0LogDesc = useMemo(() => {
    if (!topic0) {
      return topic0;
    }
    if (!topic0.signatures) {
      return undefined;
    }

    const sigs = topic0.signatures;
    for (const sig of sigs) {
      const logFragment = Fragment.from(`event ${sig}`);
      const intf = new Interface([logFragment]);
      try {
        return intf.parseLog({
          topics: Array.from(log.topics),
          data: log.data,
        });
      } catch (err) {
        // Ignore on purpose; try to match other sigs
      }
    }
    return undefined;
  }, [topic0, log]);

  // If we have a known topic, use that. Otherwise, if we have an eth log, use that.
  const resolvedLogDesc = logDesc ?? topic0LogDesc;
  let scillaLog = undefined;
  if (scillaLogDesc !== null && scillaLogDesc !== undefined) {
    scillaLog = (
      <ScillaLogDisplay
        eventName={scillaLogDesc.eventName}
        address={scillaLogDesc.address}
        params={scillaLogDesc.params}
      />
    );
  } else if (topic0ScillaEncapsLogDesc !== undefined) {
    scillaLog = (
      <ScillaEncapsDisplay
        kind={topic0ScillaEncapsLogDesc.kind}
        description={topic0ScillaEncapsLogDesc.description}
      />
    );
  }

  let logDescElem = <TwoColumnPanel>Waiting for data...</TwoColumnPanel>;
  if (resolvedLogDesc !== undefined) {
    if (resolvedLogDesc === null) {
      if (scillaLog !== undefined) {
        logDescElem = scillaLog;
      } else {
        logDescElem = <TwoColumnPanel>Cannot decode data</TwoColumnPanel>;
      }
    } else {
      logDescElem = (
        <TwoColumnPanel>
          <DecodedLogSignature event={(resolvedLogDesc as any).fragment} />
          <DecodedParamsTable
            args={(resolvedLogDesc as any).args}
            paramTypes={(resolvedLogDesc as any).fragment.inputs}
            hasParamNames={resolvedLogDesc === logDesc}
          />
        </TwoColumnPanel>
      );
    }
  }

  return (
    <div className="flex space-x-10 py-5">
      <div>
        <LogIndex idx={log.index} />
      </div>
      <div className="w-full space-y-2">
        <TwoColumnPanel leftPanel={<span className="font-bold">Address</span>}>
          <TransactionAddressWithCopy address={log.address} />
        </TwoColumnPanel>
        <TabGroup>
          <TabList as={React.Fragment}>
            <TwoColumnPanel leftPanel="Parameters">
              <div className="mb-1 flex space-x-1">
                <ModeTab>Decoded</ModeTab>
                <ModeTab>Raw</ModeTab>
              </div>
            </TwoColumnPanel>
          </TabList>
          <TabPanels as={React.Fragment}>
            <TabPanel>{logDescElem}</TabPanel>
            <TabPanel as={React.Fragment}>
              <RawLog topics={log.topics} data={log.data} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default memo(LogEntry);

/*       
              {resolvedLogDesc !== undefined && resolvedLogDesc !== null ? (
                <EvmLogDisplay resolvedLogDesc={resolvedLogDesc} />
              ) : scillaLogDesc !== null && scillaLogDesc !== undefined ? (
              ) : topic0ScillaEncapsLogDesc !== null &&
                topic0ScillaEncapsLogDesc !== undefined ? (
              ) : (
                <TwoColumnPanel>
                  <DecodedLogSignature event={resolvedLogDesc.fragment} />
                  <DecodedParamsTable
                    args={resolvedLogDesc.args}
                    paramTypes={resolvedLogDesc.fragment.inputs}
                    hasParamNames={resolvedLogDesc === logDesc}
                  />
                  <div />
                )}
*/
