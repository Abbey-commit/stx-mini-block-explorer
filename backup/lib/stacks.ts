import { openContractCall } from "@stacks/connect";
import { StacksNetworks } from "@stacks/network";
import { stringAsciiCV, fetchCallReadOnlyFunction } from "@stacks/transactions";

const network = StacksNetworks.testnet;

// Your DEPLOYED testnet contract address
const CONTRACT_ADDRESS = "STTGMHNSGEDHMK15KY3C4TAN5NDQ1Z8FJN1YV757";
const CONTRACT_NAME = "clarity-learn";

/**
 * Store a term in the blockchain dictionary
 * Opens wallet for transaction signing
 */
export async function storeTerm(key: string, value: string) {
  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
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
      alert(`Transaction submitted!\nTX ID: ${data.txId}\n\nCheck status on Hiro Explorer`);
    },
    onCancel: () => {
      console.log("Transaction cancelled by user");
    }
  };
  
  await openContractCall(options);
}

/**
 * Get a term from the blockchain dictionary
 * Free read-only call
 */
export async function getTerm(key: string) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
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

/**
 * Get total number of unique terms stored
 * Free read-only call
 */
export async function getTotalTerms() {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-total-terms",
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return result;
  } catch (error) {
    console.error("Error fetching total terms:", error);
    return null;
  }
}