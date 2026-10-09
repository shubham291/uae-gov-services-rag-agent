"use client";

import { useState } from "react";
const SearchPage = () => {
  const [userMessage, setUserMessage] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.group();
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.success) {
          setResults(data?.data?.results || []);
        } else setResults([]);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Search</h1>
          <p className="mt-2 text-gray-500">
            Enter a query to search for relevant documents.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>

          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-transparent text-gray-700
                                   placeholder-gray-400"
            placeholder="Enter your search query here..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium
                                       rounded-xl hover:bg-blue-700 active:bg-blue-800
                                       transition duration-200 shadow-sm"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Search Results
            </h2>
            <ul className="space-y-4">
              {results.map((result: any, index) => (
                <li
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
                >
                  <p className="text-gray-700">
                    <strong>Source:</strong> {result.source}
                  </p>
                  <p className="text-gray-700">
                    <strong>Content:</strong> {result.content}
                  </p>
                  <p className="text-gray-700">
                    <strong>Similarity:</strong> {result.similarity.toFixed(3)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
