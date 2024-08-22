// the main frontend code of the app
"use client";
import React, { useState } from "react";
import { getQuestionsBasedOnNotes } from "../utils/chat";
import "../utils/chat";
import ThemeSwitcher from "./ThemeSwitcher";
import '../app/globals.css'

const TestAI = () => {
  const [inputText, setInputText] = useState("");
  // const [response, setResponse] = useState("");
  const [response, setResponse] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [isComplete, setIsComplete] = useState(false); // Track if all questions have been answered
  const [score, setScore] = useState(null); // tracks the user's score
  const [mistakes, setMistakes] = useState([]); // track where the user messed up
  const [notes, setNotes] = useState('')

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleUpload = async () => {
    const notes = inputText;
    setNotes(notes); // Store the notes for later use
    setInputText(""); // Clear the input box

    let questions = [];
    await getQuestionsBasedOnNotes(notes, (fullResponse) => {
      questions = fullResponse
        .split(/\?\s*/)
        .filter(Boolean)
        .map((q) => q.trim() + "?");
    });

    setResponse(questions); // Store questions as an array
    setCurrentQuestionIndex(0); // Start with the first question
    setIsComplete(false); // Reset the completion state
    setScore(null); // Reset the score
    setMistakes([]); // Reset mistakes
  };

  // code for handling answers
  const handleAnswerChange = (event) => {
    const question = response[currentQuestionIndex];
    setAnswers({
      ...answers,
      [question]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (currentQuestionIndex < response.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
    } else {
      setIsComplete(true); // Mark as complete when the last question is answered
      checkAnswers(); // Check the answers once all questions are answered
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission
      handleSubmit(); // Call the submit function when Enter is pressed
    }
  };

  const handleClear = () => {
    setResponse([]); // Clear the response to remove questions from the screen
    setAnswers({}); // Clear all answers
    setCurrentQuestionIndex(0); // Reset to the first question
    setIsComplete(false); // Reset the completion state
    setScore(null); // Reset the score
    setMistakes([]); // Reset mistakes
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    const newMistakes = [];

    response.forEach((question) => {
      const answer = answers[question] || "";
      const questionWords = question
        .split(" ")
        .map((word) => word.toLowerCase());
      const answerWords = answer.split(" ").map((word) => word.toLowerCase());
      const notesWords = notes.split(" ").map((word) => word.toLowerCase());

      // Check if any word in the answer matches a word in the notes
      const isCorrect = answerWords.some(
        (word) =>
          notesWords.includes(word) &&
          questionWords.some((qw) => notesWords.includes(qw))
      );

      if (isCorrect) {
        correctAnswers++;
      } else {
        newMistakes.push({ question, answer });
      }
    });

    setScore(correctAnswers);
    setMistakes(newMistakes);
  };

  return (
    <div className="h-screen container p-10 flex items-center flex-col ">
      
      <h2 className="text-3xl font-bold">TestAI</h2>
      <p className="text-2xl text-center">a simple AI enabled test-taking-app which uses AI to generate questions based on notes <br /> provided by the user</p>
      <input
        type="text"
        className="border rounded-lg bg-gray-200 outline-none  text-black px-4 py-2 w-5/6 shadow-md border-gray-200"
        placeholder="enter your text!"
        value={inputText}
        onChange={handleInputChange}
      />
      <button
        className="px-4 py-2 mt-2 rounded-lg  bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleUpload}
      >
        Upload Notes!
      </button>

      <ThemeSwitcher />

      {/* gettting the output of the questions from the model  */}

      {/* Floating Card */}
      {response.length > 0 && !isComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

          {/* Card Content */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              Question {currentQuestionIndex + 1} of {response.length}
            </h2>
            <div className="font-semibold mb-2">
              {response[currentQuestionIndex]}
            </div>
            <input
              type="text"
              className="border rounded-lg bg-gray-100 outline-none text-black px-4 py-2 w-full shadow-sm border-gray-300"
              placeholder="Enter your answer"
              value={answers[response[currentQuestionIndex]] || ""}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              onClick={handleClear}
            >
              Clear Questions
            </button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

          {/* Completion Message */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg text-center">
            <h2 className="text-lg font-bold mb-4">All questions answered!</h2>
            <p className="mb-4">
              Your Score: {score}/{response.length}
            </p>
            {mistakes.length > 0 && (
              <div className="text-left">
                <h3 className="font-semibold mb-2">Mistakes:</h3>
                {mistakes.map((mistake, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">
                      Question: {mistake.question}
                    </p>
                    <p>Your Answer: {mistake.answer}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              onClick={handleClear}
            >
              Clear Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAI;
