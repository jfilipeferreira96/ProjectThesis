import React, { useEffect, useState } from "react";
import classes from "./random.module.scss";
import { Card, Title, TextInput, Loader, Anchor, Group, Text, Button, Center, Flex, Stack } from "@mantine/core";
import { useInterval } from "@mantine/hooks";

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
  const [seconds, setSeconds] = useState(0);

  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

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

    interval.stop();

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
    setCurrentQuestion(0);

    setSeconds(0);
    interval.start();
  };

  const getAnswerUI = () => {
    if (type === "FIB") {
      return <input value={result.userAnswers[currentQuestion]?.answer || ""} onChange={handleInputChange} />;
    }

    return (
      <ul>
        {choices?.map((answer, index) => (
          <li onClick={() => handleChoiceSelection(answer)} key={index} className={result.userAnswers[currentQuestion]?.answer === answer ? classes.selectedAnswer : undefined}>
            <Text size="md" span>
              {answer}
            </Text>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card withBorder radius="md" className={classes.card}>
      {!showResult ? (
        <>
          {/* {showAnswerTimer && <AnswerTimer duration={10} onTimeUp={handleTimeUp} />} */}
          <Title order={3} mb={20}>
            <Text span fw={900} variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} className={classes.activeQuestion}>
              {currentQuestion + 1}
            </Text>
            /{questions.length}
          </Title>
          
          <Title order={2}>{question}</Title>

          {getAnswerUI()}

          <div className={classes.footer}>
            <Group justify="center">
              {currentQuestion > 0 && (
                <Button mt={5} size="md" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} onClick={() => onClickNext(currentQuestion - 1)}>
                  Back
                </Button>
              )}
              {currentQuestion === questions.length - 1 ? (
                <Button mt={5} size="md" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} onClick={() => endChallenge()} disabled={result.userAnswers[currentQuestion]?.answer ? false : true}>
                  Finish
                </Button>
              ) : (
                <Button
                  mt={5}
                  size="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  onClick={() => onClickNext(currentQuestion + 1)}
                  disabled={result.userAnswers[currentQuestion]?.answer ? false : true}
                >
                  Next
                </Button>
              )}
            </Group>
          </div>
        </>
      ) : (
        <Stack align={"center"} gap="0">
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
          <Button mt={5} size="md" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} onClick={handleTryAgain}>
            Try again
          </Button>
        </Stack>
      )}
    </Card>
  );
};

export default Quizz;
