import { describe, expect, it, beforeAll } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

let simnet: any;
let accounts: Map<string, string>;

beforeAll(async () => {
  simnet = await initSimnet();
  accounts = simnet.getAccounts();
});

describe("ClarityLearn Dictionary Tests", () => {
  
  it("stores and retrieves a term successfully", () => {
    const deployer = accounts.get("deployer")!;
    
    // Store a term
    const storeResult = simnet.callPublicFn(
      "clarity-learn",
      "store-term",
      [
        Cl.stringAscii("blockchain"),
        Cl.stringAscii("A distributed ledger technology")
      ],
      deployer
    );
    
    // Verify the store was successful
    expect(storeResult.result.type).toBe("ok");
    
    // Retrieve the term
    const getResult = simnet.callReadOnlyFn(
      "clarity-learn",
      "get-term",
      [Cl.stringAscii("blockchain")],
      deployer
    );
    
    // Verify we got a Some value back
    expect(getResult.result.type).toBe("some");
    expect(getResult.result.value.value.value.value).toBe("A distributed ledger technology");
  });

  it("returns none for non-existent keys", () => {
    const deployer = accounts.get("deployer")!;
    
    const getResult = simnet.callReadOnlyFn(
      "clarity-learn",
      "get-term",
      [Cl.stringAscii("nonexistent")],
      deployer
    );
    
    // Verify we got None back
    expect(getResult.result.type).toBe("none");
  });

  it("allows updating existing terms", () => {
    const deployer = accounts.get("deployer")!;
    
    // Store initial term
    simnet.callPublicFn(
      "clarity-learn",
      "store-term",
      [
        Cl.stringAscii("stacks"),
        Cl.stringAscii("Initial definition")
      ],
      deployer
    );
    
    // Update the term
    const updateResult = simnet.callPublicFn(
      "clarity-learn",
      "store-term",
      [
        Cl.stringAscii("stacks"),
        Cl.stringAscii("Updated: A Bitcoin L2 for smart contracts")
      ],
      deployer
    );
    
    expect(updateResult.result.type).toBe("ok");
    
    // Verify the update
    const getResult = simnet.callReadOnlyFn(
      "clarity-learn",
      "get-term",
      [Cl.stringAscii("stacks")],
      deployer
    );
    
    // Should have the updated value
    expect(getResult.result.type).toBe("some");
    expect(getResult.result.value.value.value.value).toBe("Updated: A Bitcoin L2 for smart contracts");
  });

  it("allows different users to store terms", () => {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    
    // Deployer stores a term
    simnet.callPublicFn(
      "clarity-learn",
      "store-term",
      [
        Cl.stringAscii("clarity"),
        Cl.stringAscii("Smart contract language for Stacks")
      ],
      deployer
    );
    
    // Wallet1 can also store
    const wallet1Result = simnet.callPublicFn(
      "clarity-learn",
      "store-term",
      [
        Cl.stringAscii("bitcoin"),
        Cl.stringAscii("Peer-to-peer electronic cash system")
      ],
      wallet1
    );
    
    expect(wallet1Result.result.type).toBe("ok");
    
    // Verify wallet1's term was stored
    const getResult = simnet.callReadOnlyFn(
      "clarity-learn",
      "get-term",
      [Cl.stringAscii("bitcoin")],
      wallet1
    );
    
    expect(getResult.result.type).toBe("some");
    expect(getResult.result.value.value.value.value).toBe("Peer-to-peer electronic cash system");
  });

  it("increments total terms count when new term is stored", async () => {
  const deployer = accounts.get("deployer")!;

  // Store a completely new term
  simnet.callPublicFn(
    "clarity-learn",
    "store-term",
    [
      Cl.stringAscii("newterm"),
      Cl.stringAscii("This is a new unique term"),
    ],
    deployer
  );

  // Get total term count
  const totalResult = simnet.callReadOnlyFn(
    "clarity-learn",
    "get-total-terms",
    [],
    deployer
  );

  expect(totalResult.result.type).toBe("ok");
  const count = Number(totalResult.result.value.value);
  expect(count).toBeGreaterThan(0);
  });
});