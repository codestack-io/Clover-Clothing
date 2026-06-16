"use client";

import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useSession } from "next-auth/react";

export default function QnAPage() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState([]);

  const userEmail = session?.user?.email;

useEffect(() => {
  fetch(`/api/help?email=${userEmail}`)
    .then(async (res) => {
      const data = await res.json();

      
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error("API Error:", data);
        setQuestions([]); // fallback
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setQuestions([]);
    });
}, []);
  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Your Questions & Answers
      </h1>

      {questions.length === 0 && (
        <p>You have not asked any questions yet.</p>
      )}

      {Array.isArray(questions) && questions.length > 0 ? (
  questions.map((q) => (
    <div key={q._id} className="border p-4 rounded mb-4">
      <p><strong>Question:</strong> {q.question}</p>

      {q.status === "answered" ? (
        <p className="text-green-600 mt-2">
          <strong>Answer:</strong> {q.answer}
        </p>
      ) : (
        <p className="text-yellow-600 mt-2">
          <strong>Status:</strong> Pending
        </p>
      )}

      <p className="text-gray-400 text-sm mt-1">
        Asked on: {new Date(q.createdAt).toLocaleString()}
      </p>
    </div>
  ))
) : (
  <p>No questions found.</p>
)}
=======

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
>>>>>>> temp-branch
    </div>
  );
}