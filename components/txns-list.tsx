
"use client";

import {
  fetchAddressTransactions,
  type FetchAddressTransactionsResponse,
} from "@/lib/fetch-address-transactions";
import { TransactionDetail } from "./txn-details";
import { useState } from "react";

interface TransactionsListProps {
  address: string;
  transactions: FetchAddressTransactionsResponse;
}

export function TransactionsList({
  address,
  transactions,
}: TransactionsListProps) {
  const [allTxns, setAllTxns] = useState(transactions);

  // Load another 20 txns
  async function loadMoreTxns() {
      
    // The new offset to fetch transaction is the offset we used
    // in the last request + the number of txns we fetched previously
    // e.g. if initially we fetched offset = 0 with limit = 20
    // the new offset would be 0 + 20 = 20 to fetch transactions
    // 20 to 40
    const newTxns = await fetchAddressTransactions({
      address,
      offset: allTxns.offset + allTxns.limit,
    });

    setAllTxns({
      ...newTxns,
      results: [...(allTxns.results || []), ...(newTxns.results || [])],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col border rounded-md divide-y border-gray-800 divide-gray-800">
        {allTxns?.results && allTxns.results.length > 0 ? (
          allTxns.results.map((tx) => (
            <div key={tx.tx.tx_id}>
              <TransactionDetail result={tx} />
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400">No transactions found</div>
        )}
      </div>
    </div>

  );
}