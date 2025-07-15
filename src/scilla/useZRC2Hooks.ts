import { useQuery } from "@tanstack/react-query";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { toChecksumAddress } from "@zilliqa-js/crypto";
import { ChecksummedAddress, ZRC2Meta, ZRC2Transfer } from "../types";
import { useTxData } from "../useErigonHooks";
import { AbiCoder, JsonRpcApiProvider } from "ethers";

/**
 * Fetches ZRC2 token metadata from a Scilla contract
 */
export const useZRC2Metadata = (
  zilliqa: Zilliqa | undefined,
  contractAddress: ChecksummedAddress,
): ZRC2Meta | undefined => {
  const { data } = useQuery({
    queryKey: ["zrc2_metadata", contractAddress],
    queryFn: async () => {
      if (!zilliqa) return null;
      
      try {
        const contract = zilliqa.contracts.at(contractAddress);
        const state = await contract.getInit();

        const getValueForName = (name: string): string | undefined => {
          const item = state.find((s: any) => s.vname === name);
          return item ? item.value : undefined;
        };
        
        return {
          name: getValueForName("name") || "Unknown Token",
          symbol: getValueForName("symbol") || "UNK",
          decimals: parseInt(getValueForName("decimals") || "0"),
          contractAddress,
          version: getValueForName("version"),
        };
      } catch (error) {
        console.error("Failed to fetch ZRC2 metadata:", error);
        return null;
      }
    },
    enabled: !!zilliqa && !!contractAddress,
  });

  return data || undefined;
};

/**
 * Detects ZRC2 transfers from Scilla transaction receipts
 */
export const findZRC2TransfersInEventLog = (
  eventLog: any, // Zilliqa transaction receipt
): ZRC2Transfer | null => {
  
if (eventLog._eventname === "TransferSuccess" || eventLog._eventname === "TransferFromSuccess") {
    try {
    const params = eventLog.params || [];
    
    // Find sender, recipient, and amount from params
    const senderParam = params.find((p: any) => p.vname === "sender");
    const recipientParam = params.find((p: any) => p.vname === "recipient");
    const amountParam = params.find((p: any) => p.vname === "amount");
    
    if (senderParam && recipientParam && amountParam) {
        return {
        token: eventLog.address,
        from: toChecksumAddress(senderParam.value),
        to: toChecksumAddress(recipientParam.value),
        value: BigInt(amountParam.value),
        contractAddress: eventLog.address,
        transitionName: "Transfer",
        };
    }
    } catch (error) {
        console.warn("Failed to parse ZRC2 transfer event:", error);
    }
  }
  
  return null;
};

/**
 * Hook to detect ZRC2 transfers in a transaction
 */
export const useZRC2Transfers = (
  provider: JsonRpcApiProvider,
  txHash: string | undefined,
): ZRC2Transfer[] | undefined => {
    const txData = useTxData(provider, txHash!);

  const { data: transfers } = useQuery({
    queryKey: ["zrc2_transfers", txHash],
    queryFn: async () => {
        const zrc2Transfers = txData?.confirmedData?.logs?.map((log) => {
            try {
                const data = JSON.parse(
                    AbiCoder.defaultAbiCoder().decode(["string"], log.data)[0],
                );

                return findZRC2TransfersInEventLog(
                    data
                )
            } catch (err) {
                return undefined;
            }
        }).filter((log) => !!log)

        return zrc2Transfers as any[];
    },
    enabled: !!txData,
  });

  return transfers;
};
