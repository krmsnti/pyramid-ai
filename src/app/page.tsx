"use client";

import { useEffect, useState } from "react";

type Message = {
  role: string;
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pyramid-messages");

    if (saved) {
      const parsed = JSON.parse(saved);

      setMessages(parsed);

      if (parsed.length > 0) {
        setStarted(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pyramid-messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  async function sendMessage() {
    if (!message.trim()) return;

    setStarted(true);

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bir hata oluştu.",
        },
      ]);
    }
  }

  function newChat() {
    setMessages([]);
    setStarted(false);

    localStorage.removeItem("pyramid-messages");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <button
        onClick={newChat}
        className="absolute top-5 left-5 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        + Yeni Sohbet
      </button>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6">
        {!started ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <h1 className="text-6xl font-bold mb-6">
              Pyramid AI
            </h1>

            <p className="text-slate-400 text-lg max-w-xl">
              Kodunu, ders notlarını ve sorularını birlikte analiz et.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="px-4 py-2 rounded-full bg-slate-800">
                🐛 Bug Analysis
              </div>

              <div className="px-4 py-2 rounded-full bg-slate-800">
                🔍 Code Review
              </div>

              <div className="px-4 py-2 rounded-full bg-slate-800">
                📚 Notes Q&A
              </div>

              <div className="px-4 py-2 rounded-full bg-slate-800">
                🧪 Generate Tests
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl max-w-2xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 ml-auto"
                    : "bg-slate-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Pyramid'e bir soru sor..."
            className="flex-1 rounded-xl bg-slate-900 p-4 outline-none"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-4 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition"
          >
            Gönder
          </button>
        </div>
      </div>
    </main>
  );
}