"use client";

import { useState } from "react";

export default function ClientPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to the <span className="text-purple-600">Client Page</span>
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-xl">
        This page is generated on the client side and provides interactive features.
      </p>

      <button
        className="mt-6 px-6 py-3 bg-ethereum-gradient text-white text-lg font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
        onClick={() => setCount((c) => c + 1)}
      >
        Count: {count}
      </button>
    </div>
  );
}
