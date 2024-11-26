import React, { useState } from "react";
import "./App.css";

function App() {
  const [stage, setStage] = useState(1); // 1: Input, 2: Play
  const [truthInput, setTruthInput] = useState("");
  const [dareInput, setDareInput] = useState("");
  const [truthQuestions, setTruthQuestions] = useState([]);
  const [dareQuestions, setDareQuestions] = useState([]);
  const [usedTruthQuestions, setUsedTruthQuestions] = useState([]);
  const [usedDareQuestions, setUsedDareQuestions] = useState([]);
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [readyToFlipBack, setReadyToFlipBack] = useState(false);

  const handleTruthInput = (e) => setTruthInput(e.target.value);
  const handleDareInput = (e) => setDareInput(e.target.value);
  const handlePlayerInput = (e) => setPlayerInput(e.target.value);

  const handleSubmit = () => {
    const truths = truthInput.split("\n").map((q) => q.trim()).filter((q) => q);
    const dares = dareInput.split("\n").map((q) => q.trim()).filter((q) => q);
    const playerList = playerInput.split("\n").map((p) => p.trim()).filter((p) => p);

    if (truths.length === 0 || dares.length === 0 || playerList.length === 0) {
      alert("Please fill out all fields correctly.");
      return;
    }

    setTruthQuestions(truths);
    setDareQuestions(dares);
    setPlayers(playerList);
    setUsedTruthQuestions([]);
    setUsedDareQuestions([]);
    setStage(2); // Move to the Play stage
  };

  const handlePlay = (type) => {
    setFlipped(true);
    setReadyToFlipBack(false);

    setTimeout(() => {
      if (type === "truth" && truthQuestions.length > 0) {
        // Filter unused questions
        const unusedTruths = truthQuestions.filter(
          (q) => !usedTruthQuestions.includes(q)
        );

        if (unusedTruths.length === 0) {
          alert("All Truth questions have been used! Resetting questions.");
          setUsedTruthQuestions([]);
        } else {
          const randomTruth =
            unusedTruths[Math.floor(Math.random() * unusedTruths.length)];
          setCurrentQuestion(`Truth: ${randomTruth}`);
          setUsedTruthQuestions((prev) => [...prev, randomTruth]);
        }
      } else if (type === "dare" && dareQuestions.length > 0) {
        // Filter unused questions
        const unusedDares = dareQuestions.filter(
          (q) => !usedDareQuestions.includes(q)
        );

        if (unusedDares.length === 0) {
          alert("All Dare questions have been used! Resetting questions.");
          setUsedDareQuestions([]);
        } else {
          const randomDare =
            unusedDares[Math.floor(Math.random() * unusedDares.length)];
          setCurrentQuestion(`Dare: ${randomDare}`);
          setUsedDareQuestions((prev) => [...prev, randomDare]);
        }
      } else {
        setCurrentQuestion("No questions available for this category.");
      }

      setReadyToFlipBack(true);
    }, 1000); // Animation duration
  };

  const handleFlipBack = () => {
    setFlipped(false);
    setCurrentQuestion(null);
    setReadyToFlipBack(false);
    // Move to the next player
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  return (
    <div className="app-container">
      {stage === 1 && (
        <div>
          <h1 className="title">Input Questions and Players</h1>
          <div className="input-section">
            <textarea
              value={truthInput}
              onChange={handleTruthInput}
              placeholder="Enter Truth questions here, one per line."
              className="textarea"
            />
            <textarea
              value={dareInput}
              onChange={handleDareInput}
              placeholder="Enter Dare questions here, one per line."
              className="textarea"
            />
            <textarea
              value={playerInput}
              onChange={handlePlayerInput}
              placeholder="Enter player names, one per line."
              className="textarea"
            />
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div>
          <h1 className="title">Truth or Dare</h1>
          <h2 className="current-player">It's {players[currentPlayerIndex]}'s turn!</h2>
          <div className={`card ${flipped ? "flipped" : ""}`}>
            <div className="card-inner">
              <div className="card-front">Click Truth or Dare</div>
              <div className="card-back">{currentQuestion || "Waiting..."}</div>
            </div>
          </div>
          <div className="play-section">
            {!readyToFlipBack && (
              <>
                <button onClick={() => handlePlay("truth")} className="option-button">
                  Truth
                </button>
                <button onClick={() => handlePlay("dare")} className="option-button">
                  Dare
                </button>
              </>
            )}
            {readyToFlipBack && (
              <button onClick={handleFlipBack} className="submit-button">
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
