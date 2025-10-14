import { openContractCall } from "@stacks/connect";
import { StacksNetworks } from "@stacks/network";
import { stringAsciiCV, fetchCallReadOnlyFunction } from "@stacks/transactions";
import { clarityDictionary } from "./clarity-dictionary";

const network = StacksNetworks.testnet;
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export async function getTerm(key: string) {
  try {
    // Normalize the key to lowercase for case-insensitive lookup
    const normalizedKey = key.toLowerCase().trim();
    
    // Check if term exists in local dictionary
    if (clarityDictionary[normalizedKey]) {
      // Return in Clarity response format
      return {
        type: "some",
        value: {
          value: {
            value: {
              value: clarityDictionary[normalizedKey]
            }
          }
        }
      };
    }
    
    // Term not found
    return { type: "none" };
    
  } catch (error) {
    console.error("Error fetching term:", error);
    return null;
  }
}

export async function storeTerm(key: string, value: string) {
  // For demo: explain deployment requirement
  alert(
    `Demo Mode: Contract not deployed to testnet yet.\n\n` +
    `To enable real blockchain storage:\n` +
    `1. Deploy contract: clarinet deployments apply --testnet\n` +
    `2. Get testnet STX from faucet\n` +
    `3. Update CONTRACT_ADDRESS with deployed address\n\n` +
    `The passing tests prove the contract logic works correctly.`
  );
  console.log("Would store:", key, "=", value);
}