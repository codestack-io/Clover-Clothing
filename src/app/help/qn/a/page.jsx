"use client";

import { useEffect, useState } from "react";

export default function UserQnAPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/api/help") // ✅ no email needed now
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Questions</h1>

      {questions.length === 0 && <p>No questions yet.</p>}

      {questions.map((q) => (
        <div key={q._id} className="border p-4 rounded mb-4">
          <p><strong>Question:</strong> {q.question}</p>

          {q.status === "answered" ? (
            <p className="text-green-600 mt-2">
              <strong>Answer:</strong> {q.answer}
            </p>
          ) : (
            <p className="text-yellow-600 mt-2">
              Pending...
            </p>
          )}
        </div>
      ))}
    </div>
  );
}