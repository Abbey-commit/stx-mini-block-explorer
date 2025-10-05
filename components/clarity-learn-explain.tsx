"use client";

import { useState } from "react";
import { clarityDictionary } from "@/lib/clarity-dictionary";

interface Props {
    terms: string;
    children: React.ReactNode;
}

export function ClarityLearnExplain({ term, children } : Props) {
    const [open, setOpen] = useState(false);

    const explanation =
        clarityDictionary[term] || "No explanation available for this term yet.";

    return (
        <span className="relative">
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer underline decoration-dotted text-blue-400 hover:text-blue-200"
              title="Click to learn more"
            >
                {children}
            </span>

            {open && (
                <div className="absolute z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-72 top-6 left-0 border border-g-700">
                    <h3 className="font-bold mb-2 text-lg">{term}</h3>
                    <p className="text-sm mb-4">{explanation}</p>
                    <button 
                      onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </span>
    )
}