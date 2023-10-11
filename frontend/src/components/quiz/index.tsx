import React, { useEffect, useState } from "react";
import classes from "./random.module.scss";

export interface Question {
  id: number;
  question: string;
  choices?: string[];
  correctAnswer: string;
  type: string;
}

interface Result {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  userAnswers: { id: number; answer: string }[];
}

interface Props {
  questions: Question[];
}

const Quizz = (props: Props) => {
  const { questions } = props;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<Result>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    userAnswers: [],
  });
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);

  const { id: questionId, question, choices, correctAnswer, type } = questions[currentQuestion];

  const handleChoiceSelection = (chosenAnswer: string) => {
    setResult((prevResult) => {
      const updatedUserAnswers = prevResult.userAnswers.slice(); // Create a copy of the array
      const existingAnswer = updatedUserAnswers.find((answer) => answer.id === questionId);

      if (existingAnswer) {
        existingAnswer.answer = chosenAnswer;
      } else {
        updatedUserAnswers.push({ id: questionId, answer: chosenAnswer });
      }

      return {
        ...prevResult,
        userAnswers: updatedUserAnswers,
      };
    });
  };

  const onClickNext = (id: number) => {
    setCurrentQuestion(id);
  };

  const endChallenge = () => {
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    result.userAnswers.forEach((userAnswer) => {
      const question = questions.find((q) => q.id === userAnswer.id);

      if (question) {
        if (question.type === "FIB") {
          if (userAnswer.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
            score += 5;
            correctAnswers += 1;
          } else {
            wrongAnswers += 1;
          }
        } else {
          if (userAnswer.answer === question.correctAnswer) {
            score += 5;
            correctAnswers += 1;
          } else {
            wrongAnswers += 1;
          }
        }
      }
    });

    setResult({
      score,
      correctAnswers,
      wrongAnswers,
      userAnswers: result.userAnswers,
    });

    setShowResult(true);
  };

  setTimeout(() => {
    setShowAnswerTimer(true);
  });

  const onTryAgain = () => {
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      userAnswers: [],
    });
    setShowResult(false);
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = evt.target.value;

    setResult((prevResult) => {
      const updatedUserAnswers = prevResult.userAnswers.slice(); // Create a copy of the array

      // Check if the current question id is already in userAnswers
      const existingAnswer = updatedUserAnswers.find((answer) => answer.id === questionId);

      if (existingAnswer) {
        // If it exists, update the answer
        existingAnswer.answer = userInput;
      } else {
        // If it doesn't exist, add a new entry
        updatedUserAnswers.push({ id: questionId, answer: userInput });
      }

      return {
        ...prevResult,
        userAnswers: updatedUserAnswers,
      };
    });
  };

  const handleTryAgain = () => {
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      userAnswers: [],
    });
    setShowResult(false);
  };

  const getAnswerUI = () => {
    if (type === "FIB") {
      return <input value={result.userAnswers[currentQuestion]?.answer || ""} onChange={handleInputChange} />;
    }

    return (
      <ul>
        {choices?.map((answer, index) => (
          <li onClick={() => handleChoiceSelection(answer)} key={index} className={result.userAnswers[currentQuestion]?.answer === answer ? classes.selectedAnswer : undefined}>
            {answer}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={classes.quizContainer}>
      {!showResult ? (
        <>
          {/* {showAnswerTimer && <AnswerTimer duration={10} onTimeUp={handleTimeUp} />} */}

          <span className={classes.activeQuestionNo}>{currentQuestion + 1}</span>
          <span className={classes.totalQuestion}>/{questions.length}</span>
          <h2 className={classes.question}>{question}</h2>
          {getAnswerUI()}

          <div className={classes.footer}>
            {currentQuestion > 0 && (
              <button onClick={() => onClickNext(currentQuestion - 1)} className={classes.button}>
                Back
              </button>
            )}
            {currentQuestion === questions.length - 1 ? (
              <button onClick={() => endChallenge()} disabled={result.userAnswers[currentQuestion]?.answer ? false : true} className={classes.button}>
                Finish
              </button>
            ) : (
              <button onClick={() => onClickNext(currentQuestion + 1)} disabled={result.userAnswers[currentQuestion]?.answer ? false : true} className={classes.button}>
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={classes.result}>
          <h1 className={classes.gameOver}>game over</h1>
          <h3>Result</h3>
          <p>
            Total Questions: <span>{questions.length}</span>
          </p>
          <p>
            Total Score: <span>{result.score}</span>
          </p>
          <p>
            Correct Answers: <span>{result.correctAnswers}</span>
          </p>
          <p>
            Wrong Answers: <span>{result.wrongAnswers}</span>
          </p>
          <button onClick={handleTryAgain}>Try again</button>
        </div>
      )}
    </div>
  );
};

export default Quizz;
