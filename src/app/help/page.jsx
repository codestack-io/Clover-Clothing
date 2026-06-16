"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function HelpPage() {
  const [question, setQuestion] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    await fetch("/api/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@gmail.com", // later use logged-in user
        question,
      }),
    });

    alert("Question submitted!");
    setQuestion("");
=======
    if (!session) {
      alert("Please login first!");
      return;
    }

    if (!question.trim()) {
      alert("Question is required!");
      return;
    }

    const res = await fetch("/api/help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Question submitted!");
      setQuestion("");
    } else {
      alert(data.message);
    }
>>>>>>> temp-branch
  };

  return (
    <div className="max-w-xl mx-auto py-10">
<<<<<<< HEAD
      <h1 className="text-xl font-bold mb-4">Need Help?</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-2 rounded"
=======
      <h1 className="text-2xl font-bold mb-4">
        Need Help?
      </h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-3 rounded"
          rows={5}
>>>>>>> temp-branch
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
<<<<<<< HEAD
        <button className="mt-3 bg-black text-white px-4 py-2 rounded">
          Submit
=======

        <button
          type="submit"
          className="mt-3 bg-black text-white px-4 py-2 rounded"
        >
          Submit Question
>>>>>>> temp-branch
        </button>
      </form>
    </div>
  );
}