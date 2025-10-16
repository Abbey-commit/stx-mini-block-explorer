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

  // // Load another 20 txns
  async function loadMoreTxns() {
    // Simply fetch more transactions without offset
    const newTxns = await fetchAddressTransactions({
      address,
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
    
    {/* Add Load More button */}
    <button 
      onClick={loadMoreTxns}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
    >
      Load More Transactions
    </button>
  </div>
  );
}