"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="flex flex-col w-full max-w-3xl min-h-screen mx-auto px-4">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center gap-3 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
            <span className="text-xl drop-shadow-sm">✨</span>
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              AI Assistant
            </h1>
            <p className="text-xs text-slate-500">Ask me anything</p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 py-8 pb-32">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
                <span className="text-xl drop-shadow-sm">✨</span>
              </div>

              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                How can I help?
              </h2>

              <p className="max-w-sm text-sm leading-6 text-slate-500">
                Ask a question, get an explanation, brainstorm ideas, or just
                have a conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* AI Avatar */}
                    {!isUser && (
                      <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm shadow-sm">
                        ✨
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          isUser ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {isUser ? "You" : "AI Assistant"}
                      </div>

                      <div className="whitespace-pre-wrap text-sm leading-6">
                        {message.parts.map((part, i) =>
                          part.type === "text" ? (
                            <span key={i}>{part.text}</span>
                          ) : null,
                        )}
                      </div>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-white text-sm font-medium shadow-sm">
                        You
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 bg-gradient-to-t from-white via-white/95 to-transparent">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <input
                className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                value={input}
                placeholder="Ask something..."
                onChange={(e) => setInput(e.currentTarget.value)}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-2">
              AI can make mistakes. Check important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
