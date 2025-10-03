import { Clarinet, Tx, Chain, Account } from "clarinet";

Clarinet.test({
  name: "Ensure clicks increment correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;

    let block = chain.mineBlock([
      Tx.contractCall("clarity-learn", "record-click", [], deployer.address),
    ]);

    block.receipts[0].result.expectOk().expectUint(1);

    let block2 = chain.mineBlock([
      Tx.contractCall("clarity-learn", "record-click", [], deployer.address),
    ]);

    block2.receipts[0].result.expectOk().expectUint(2);

    let clicks = chain.callReadOnlyFn("clarity-learn", "get-clicks", [], deployer.address);
    clicks.result.expectOk().expectUint(2);
  },
});
