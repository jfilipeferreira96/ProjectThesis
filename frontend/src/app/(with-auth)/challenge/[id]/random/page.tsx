"use client";
import React, { useEffect, useState, } from "react";
import { Card, Title, TextInput, Loader } from "@mantine/core";
import classes from "./random.module.scss";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: string;
  type: string;
}

interface Result {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface RandomProps {
  params: {
    id: string;
  };
}

const Random: React.FC<RandomProps> = ({ params: { id } }: RandomProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState<number | null>(null);
  const [answer, setAnswer] = useState<boolean | undefined>(undefined);
  const [result, setResult] = useState<Result>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [inputAnswer, setInputAnswer] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(result)
  console.log(inputAnswer)
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetch(`https://644982a3e7eb3378ca4ba471.mockapi.io/questions`);
        const questionsResponse = await response.json();

        setQuestions(questionsResponse);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getQuestions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const { question, choices, correctAnswer, type } = questions[currentQuestion];
  console.log(question, choices, correctAnswer, type);
  const onAnswerClick = (answer: string, index: number) => {
    setAnswerIdx(index);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer: boolean | undefined) => {
    setAnswerIdx(null);
    setShowAnswerTimer(false);
    setInputAnswer("");
    setResult((prev) =>
      finalAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
    }
  };

  setTimeout(() => {
    setShowAnswerTimer(true);
  });

  const onTryAgain = () => {
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    setShowResult(false);
  };

  const handleTimeUp = () => {
    setAnswer(false);
    onClickNext(false);
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnswer(evt.target.value);

    if (evt.target.value === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const getAnswerUI = () => {
    if (type === "FIB") {
      return <input value={inputAnswer} onChange={handleInputChange} />;
    }
    return (
      <ul>
        {choices.map((answer, index) => (
          <li onClick={() => onAnswerClick(answer, index)} key={answer} className={answerIdx === index ? classes.selectedAnswer : undefined}>
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
          <p className={classes.answer}>{answer}</p>
          <span className={classes.activeQuestionNo}>{currentQuestion + 1}</span>
          <span className={classes.totalQuestion}>/{questions.length}</span>
          <h2 className={classes.question}>{question}</h2>
          {getAnswerUI()}

          <div className={classes.footer}>
            <button
              onClick={() => onClickNext(answer)}
              disabled={answerIdx === null && !inputAnswer} // disables the Next button until there is an answer.
              className={classes.button}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        /*  <Result result={result} onTryAgain={onTryAgain} totalQuestions={questions.length} /> */
        <h1 className={classes.gameOver}>game over</h1>
      )}
    </div>
  );
};

export default Random;
