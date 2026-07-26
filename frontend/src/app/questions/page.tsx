"use client";

import { useEffect, useState } from "react";
import { getQuestions } from "@/lib/api";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions()
      .then((data) => {
        const mockData = data && data.length > 0 ? data : [
          { _id: "q1", title: "What is React?", topic: "React", difficulty: "Easy", question_type: "mcq" },
          { _id: "q2", title: "Explain Node.js event loop", topic: "Node.js", difficulty: "Medium", question_type: "descriptive" },
          { _id: "q3", title: "Implement a linked list", topic: "Data Structures", difficulty: "Hard", question_type: "coding" },
        ];
        setQuestions(mockData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Questions</h1>

      {questions.map((q) => (
        <div
          key={q._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h2>{q.title}</h2>
          <p>Topic: {q.topic}</p>
          <p>Difficulty: {q.difficulty}</p>
          <p>Type: {q.question_type}</p>
        </div>
      ))}
    </div>
  );
}