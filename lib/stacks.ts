import { openContractCall } from "@stacks/connect";
import { StacksNetworks } from "@stacks/network";
import { 
  stringAsciiCV, 
  cvToValue,
  fetchCallReadOnlyFunction,
  ClarityType,
  // uintCV
} from "@stacks/transactions";

// ========================================
// NETWORK CONFIGURATION
// ========================================
const network = StacksNetworks.testnet;

// ========================================
// YOUR DEPLOYED TESTNET CONTRACT
// ========================================
const CONTRACT_ADDRESS = "STTGMHNSGEDHMK15KY3C4TAN5NDQ1Z8FJN1YV757";
const CONTRACT_NAME = "clarity-learn";

/**
 * Store a term in the blockchain dictionary
 * Opens your wallet for transaction signing
 */
export async function storeTerm(key: string, value: string) {
  try {
    console.log(`Storing term: "${key}" = "${value}"`);
    
    // Validate input
    if (!key || !value) {
      throw new Error("Key and value are required");
    }
    
    if (key.length > 32 || value.length > 128) {
      throw new Error("Key or value exceeds maximum length");
    }
    
    const functionArgs = [
      stringAsciiCV(key),
      stringAsciiCV(value)
    ];
    
    console.log("Function args created");
    console.log("Key CV:", functionArgs[0]);
    console.log("Value CV:", functionArgs[1]);
    
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "store-term",
      functionArgs,
      network,
      appDetails: {
        name: "ClarityLearn Dictionary",
        icon: window.location.origin + "/favicon.ico",
      },
      onFinish: (data: any) => {
        console.log("Transaction submitted:", data.txId);
        alert(
          `Transaction submitted successfully!\n\n` +
          `TX ID: ${data.txId}\n\n` +
          `View on Explorer:\n` +
          `https://explorer.hiro.so/txid/${data.txId}?chain=testnet\n\n` +
          `The transaction will be confirmed in ~10 minutes.`
        );
      },
      onCancel: () => {
        console.log("Transaction cancelled by user");
        alert("Transaction was cancelled");
      }
    };
    
    console.log("Opening contract call...");
    console.log("Contract:", `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    console.log("Function:", "store-term");
    
    await openContractCall(options);
  } catch (error) {
    console.error("Error in storeTerm:", error);
    throw error;
  }
}

/**
 * Get a term from the blockchain dictionary
 * Uses fetchCallReadOnlyFunction from @stacks/transactions
 */
// UPDATE: lib/stacks.ts
// Replace the getTerm function with this version

export async function getTerm(key: string) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    if (isDevelopment) {
      console.log(`Searching for term: "${key}"`);
      console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    }
    
    // Call the read-only function using fetchCallReadOnlyFunction
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-term",
      functionArgs: [stringAsciiCV(key.toLowerCase())],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    if (isDevelopment) {
      console.log("Raw result:", result);
    }
    
    // Check if it's an optional type
    if (result.type === ClarityType.OptionalSome) {
      const innerValue = result.value;
      
      if (innerValue.type === ClarityType.StringASCII) {
        if (isDevelopment) {
          console.log("✅ Found on blockchain:", innerValue.data);
        }
        return {
          type: "some",
          value: innerValue.data,
          source: "blockchain"
        };
      }
    } else if (result.type === ClarityType.OptionalNone) {
      if (isDevelopment) {
        console.log("Not found on blockchain");
      }
      return {
        type: "none",
        source: "blockchain"
      };
    }
    
    return null;
    
  } catch (error) {
    // Only log errors in development
    if (isDevelopment) {
      console.warn("Blockchain query failed (this is often expected):", error);
      if (error instanceof Error) {
        console.warn("Error details:", error.message);
      }
    }
    
    // Return null to trigger fallback logic
    return null;
  }
}

/**
 * Get total number of unique terms stored
 * Uses fetchCallReadOnlyFunction from @stacks/transactions
 */
export async function getTotalTerms() {
  try {
    console.log(`Fetching total terms count...`);
    
    // Call the read-only function
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "get-total-terms",
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    console.log("Raw result:", result);
    
    // Check if it's a Response type with Ok
    if (result.type === ClarityType.ResponseOk) {
      const innerValue = result.value;
      if (innerValue.type === ClarityType.UInt) {
        console.log("Total terms:", innerValue.value);
        return {
          type: "ok",
          value: Number(innerValue.value)
        };
      }
    }
    
    console.log("Unexpected result format:", result);
    return null;
    
  } catch (error) {
    console.error("Error fetching total terms:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return null;
  }
}

// ========================================
// HELPER: Export contract info for debugging
// ========================================
export const CONTRACT_INFO = {
  address: CONTRACT_ADDRESS,
  name: CONTRACT_NAME,
  network: "testnet",
  explorerUrl: `https://explorer.hiro.so/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=testnet`,
};