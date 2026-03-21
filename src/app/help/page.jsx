"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function HelpPage() {
  const [question, setQuestion] = useState("");
 const { data: session } = useSession();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
    alert("Please login first!");
   return;
  }

    await fetch("/api/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        
        question,
      }),
    });

    alert("Question submitted!");
    setQuestion("");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-xl font-bold mb-4">Need Help?</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="mt-3 bg-black text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}