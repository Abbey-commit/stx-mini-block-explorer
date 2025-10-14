"use client";

import { useStacks } from "@/hooks/use-stacks";
import { redirect } from "next/navigation";
import { ClarityLearnDemo } from "@/components/clarity-learn-demo";

export default function Home() {
  const { userData } = useStacks();

  if (userData) {
    redirect(`/${userData.profile.stxAddress.mainnet}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Mini Block Explorer</h1>
        <p className="text-gray-400">with ClarityLearn Integration</p>
      </div>
      
      <ClarityLearnDemo />
      
      <div className="text-center mt-8">
        <p className="text-gray-400">Connect your wallet or search for an address above</p>
      </div>
    </main>
  );
}