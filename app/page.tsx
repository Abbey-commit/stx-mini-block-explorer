"use client";

import { useStacks } from "@/hooks/use-stacks";
import { ClarityLearnDemo } from "@/components/clarity-learn-demo";
import Link from "next/link";

export default function Home() {
  // Get wallet connection data from the custom hook
  const { userData } = useStacks();

  // ========================================
  // KEY CHANGE: REMOVED THE REDIRECT!
  // ========================================
  // OLD CODE (DELETED):
  // if (userData) {
  //   redirect(`/${userData.profile.stxAddress.mainnet}`);
  // }
  //
  // WHY? The redirect was sending users away from ClarityLearn
  // the moment they connected their wallet. This breaks the
  // user experience and hides the new feature.
  // ========================================

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      {/* ========================================
          HEADER SECTION
          Shows the app title and description
          ======================================== */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Mini Block Explorer</h1>
        <p className="text-gray-400">with ClarityLearn Integration</p>
      </div>

      {/* ========================================
          CLARITYLEARN DICTIONARY - THE MAIN FEATURE
          This is YOUR added feature for Stacks Ascent
          It's always visible, regardless of wallet status
          ======================================== */}
      <ClarityLearnDemo />

      {/* ========================================
          NAVIGATION SECTION
          Shows different messages and actions based on wallet state
          ======================================== */}
      <div className="text-center mt-8 space-y-4">
        {/* If wallet is NOT connected */}
        {!userData && (
          <p className="text-gray-400">
            Connect your wallet to store terms on-chain, or search for an address above
          </p>
        )}

        {/* If wallet IS connected - show link to view their transactions */}
        {userData && (
          <div className="space-y-3">
            <p className="text-gray-300">
              ✓ Wallet connected! You can now store terms on the blockchain.
            </p>
            
            {/* ========================================
                NEW: Link to view user's transaction history
                This preserves the original block explorer feature
                while keeping ClarityLearn as the main page
                ======================================== */}
            <Link
              href={`/${userData.profile.stxAddress.testnet}`}
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              View My Transaction History
            </Link>

            <p className="text-sm text-gray-500">
              Address: {userData.profile.stxAddress.testnet}
            </p>
          </div>
        )}
      </div>

      {/* ========================================
          INFORMATION FOOTER
          Explains the integration of both features
          ======================================== */}
      <div className="text-center mt-8 max-w-2xl">
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-blue-400">🎓 ClarityLearn Dictionary</span> 
            {" "}is an original feature added to the Mini Block Explorer.
          </p>
          <p className="text-xs text-gray-400">
            Search blockchain terms (free) • Store definitions (requires wallet + testnet STX) • View transaction history
          </p>
        </div>
      </div>
    </main>
  );
}