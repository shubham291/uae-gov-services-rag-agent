"use client";

import PageLoader from "next/dist/client/page-loader";
import { useState } from "react";

export default function TriagePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const onClickHandler = async (message: string) => {
    setIsLoading(true);
    const response = await fetch("/api/triage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      setResult(data);
    } else {
      console.error("Error:", response.statusText);
    }
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Message Triage
          </h1>
          <p className="mt-2 text-gray-500">
            Enter a customer message to analyze and identify the appropriate
            triage result.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Message
          </label>

          <textarea
            className="w-full min-h-[140px] p-4 border border-gray-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent resize-none text-gray-700
                           placeholder-gray-400"
            placeholder="Enter customer message here..."
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onClickHandler(message)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium
                               rounded-xl hover:bg-blue-700 active:bg-blue-800
                               transition duration-200 shadow-sm"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            className="mt-6 bg-white border border-gray-200 rounded-2xl p-6
                            flex items-center justify-center gap-3 shadow-sm"
          >
            <div
              className="w-5 h-5 border-2 border-blue-200 border-t-blue-600
                                rounded-full animate-spin"
            ></div>
            <p className="text-gray-600 font-medium">Loading... Please wait</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Triage Result
              </h2>

              <span
                className="px-3 py-1 text-xs font-semibold rounded-full
                                     bg-green-100 text-green-700"
              >
                Analysis Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white rounded-2xl border border-gray-200
                                       p-5 shadow-sm hover:shadow-md
                                       transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h3>

                    <span
                      className="px-2.5 py-1 text-xs font-semibold
                                                 rounded-full bg-blue-100 text-blue-700"
                    >
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : typeof value === "object"
                          ? "Details"
                          : "Result"}
                    </span>
                  </div>

                  <div className="text-gray-900 font-semibold text-lg">
                    {typeof value === "object" ? (
                      <pre
                        className="text-sm font-normal text-gray-700
                                                    whitespace-pre-wrap"
                      >
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      String(value)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
