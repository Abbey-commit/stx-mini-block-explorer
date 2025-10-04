import { openContractCall } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import { stringAsciiCV, callReadOnlyFunction } from "@stacks/transactions";

const network = new StacksTestnet();
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export async function storeTerm(key: string, value: string) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: "clarity-learn",
    functionName: "store-term",
    functionArgs: [
      stringAsciiCV(key),
      stringAsciiCV(value)
    ],
    network,
    appDetails: {
      name: "Mini Block Explorer + ClarityLearn",
      icon: window.location.origin + "/favicon.ico",
    },
    onFinish: (data: any) => {
      console.log("Transaction submitted:", data.txId);
    },
  };
  
  await openContractCall(options);
}

export async function getTerm(key: string) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: "clarity-learn",
      functionName: "get-term",
      functionArgs: [stringAsciiCV(key)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return result;
  } catch (error) {
    console.error("Error fetching term:", error);
    return null;
  }
}