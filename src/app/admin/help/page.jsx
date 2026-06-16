"use client";

import { useEffect, useState } from "react";

export default function AdminHelpPage() {
  const [questions, setQuestions] = useState([]);
  const [reply, setReply] = useState({});

  // Load all questions
 useEffect(() => {
  fetch("/api/help")
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text(); // debug
        console.error("API error:", text);
        throw new Error("API failed");
      }
      return res.json();
    })
    .then((data) => setQuestions(data))
    .catch((err) => {
      console.error("Fetch error:", err);
      setQuestions([]);
    });
}, []);

  // Send answer to server
  const handleAnswer = async (id, answer) => {
    if (!answer) return;

    await fetch(`/api/help/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    alert("Answer submitted!");
    location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Customer Questions</h1>

      {questions.map((q) => (
        <div key={q._id} className="border p-4 rounded mb-4">
          <p><strong>Email:</strong> {q.email}</p>
          <p><strong>Question:</strong> {q.question}</p>

          {q.status === "answered" ? (
            <p className="text-green-600 mt-2">
              <strong>Answer:</strong> {q.answer}
            </p>
          ) : (
            <div className="mt-3">
             
<input
  type="text"
  placeholder="Write answer..."
  className="border p-2 w-full mb-2"
  onChange={(e) =>
    setReply({ ...reply, [q._id]: e.target.value })
  }
/>

<button
  onClick={() => handleAnswer(q._id, reply[q._id])}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Submit Answer
</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}