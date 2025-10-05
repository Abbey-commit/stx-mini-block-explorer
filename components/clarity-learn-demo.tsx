"use client";

import { useState } from "react";
import { getTerm, storeTerm } from "@/lib/stacks";

export function ClarityLearnDemo() {
  const [searchKey, setSearchKey] = useState("");
  const [storeKey, setStoreKey] = useState("");
  const [storeValue, setStoreValue] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!searchKey.trim()) {
      setResult("Please enter a search term");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await getTerm(searchKey);

      if (data && data.type === "some") {
        setResult(data.value.value.value.value);
      } else if (data && data.type === "none") {
        setResult("Term not found in dictionary");
      } else {
        setResult("Error fetching term");
      }
    } catch (error) {
      setResult("Error connecting to blockchain");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStore() {
    if (!storeKey.trim() || !storeValue.trim()) {
      alert("Please fill in both key and value");
      return;
    }

    if (storeKey.length > 32) {
      alert("Key must be 32 characters or less");
      return;
    }

    if (storeValue.length > 128) {
      alert("Value must be 128 characters or less");
      return;
    }

    setLoading(true);

    try {
      await storeTerm(storeKey, storeValue);
      setStoreKey("");
      setStoreValue("");
    } catch (error) {
      console.error(error);
      alert("Error: Make sure Leather wallet is connected");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">ClarityLearn Dictionary</h2>
        <p className="text-gray-300 mb-6">
          Store and retrieve blockchain terminology definitions on the Stacks blockchain
        </p>

        {/* Search Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Search for a Term</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Enter term (e.g., blockchain)"
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              maxLength={32}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-400 mb-1">Result:</p>
              <p className="text-white">{result}</p>
            </div>
          )}
        </div>

        {/* Store Section */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-3">Add a New Term</h3>
          <p className="text-sm text-gray-400 mb-4">
            Connect your Leather wallet to store terms on-chain
          </p>
          
          <div className="space-y-3">
            <input
              type="text"
              value={storeKey}
              onChange={(e) => setStoreKey(e.target.value)}
              placeholder="Term key (max 32 chars)"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              maxLength={32}
            />
            <textarea
              value={storeValue}
              onChange={(e) => setStoreValue(e.target.value)}
              placeholder="Definition (max 128 chars)"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none"
              maxLength={128}
            />
            <button
              onClick={handleStore}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Processing..." : "Store Term (Requires Wallet)"}
            </button>
          </div>
        </div>

        {/* Example Terms */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm font-semibold mb-2 text-yellow-400">Demo Mode - Using Local Dictionary</p>
          <p className="text-xs text-gray-400 mb-3">
            Contract not yet deployed to testnet. Search works with pre-defined terms. 
            All tests pass in Clarinet environment.
          </p>
          <p className="text-sm font-semibold mb-2">Available terms to search:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• blockchain</li>
            <li>• stacks</li>
            <li>• bitcoin</li>
            <li>• clarity</li>
            <li>• nonce</li>
            <li>• contract_call</li>
            <li>• token_transfer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}