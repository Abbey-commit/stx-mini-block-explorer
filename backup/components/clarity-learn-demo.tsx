"use client";

import { useState } from "react";
import { getTerm, storeTerm, getTotalTerms } from "@/lib/stacks";

export function ClarityLearnDemo() {
  const [searchKey, setSearchKey] = useState("");
  const [storeKey, setStoreKey] = useState("");
  const [storeValue, setStoreValue] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [totalTerms, setTotalTerms] = useState<number | null>(null);
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
        // Extract value from Clarity response
        const value = data.value.value.value.value;
        setResult(value);
      } else if (data && data.type === "none") {
        setResult("Term not found in blockchain dictionary");
      } else {
        setResult("Error fetching term from blockchain");
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
      // Clear form on successful submission
      setStoreKey("");
      setStoreValue("");
    } catch (error) {
      console.error(error);
      alert("Error: Make sure Leather wallet is connected");
    } finally {
      setLoading(false);
    }
  }

  async function loadTotalTerms() {
    setLoading(true);
    try {
      const data = await getTotalTerms();
      if (data && data.type === "ok") {
        const count = Number(data.value.value);
        setTotalTerms(count);
      }
    } catch (error) {
      console.error(error);
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

        {/* Total Terms Counter */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={loadTotalTerms}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Loading..." : "Load Total Terms Count"}
          </button>
          {totalTerms !== null && (
            <p className="mt-3 text-gray-300">
              Total unique terms on blockchain: <span className="font-bold text-white">{totalTerms}</span>
            </p>
          )}
        </div>

        {/* Live Testnet Notice */}
        <div className="mt-6 p-4 bg-green-900 bg-opacity-30 rounded-lg border border-green-700">
          <p className="text-sm font-semibold mb-2 text-green-400">✓ Live on Stacks Testnet</p>
          <p className="text-xs text-gray-300 mb-2">
            Contract deployed at: STTGMHNSGEDHMK15KY3C4TAN5NDQ1Z8FJN1YV757.clarity-learn
          </p>
          <p className="text-xs text-gray-400">
            Search reads from blockchain (free). Store requires testnet STX and wallet signature.
          </p>
        </div>

        {/* Example Terms */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm font-semibold mb-2">Try searching for:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Any term you've stored</li>
            <li>• Terms from the tests (check if they're on testnet)</li>
            <li>• Case-insensitive search works!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}