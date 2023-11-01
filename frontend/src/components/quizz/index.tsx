import React, { useEffect, useState } from "react";
import classes from "./random.module.scss";
import { Card, Title, TextInput, Loader, Anchor, Group, Text, Button, Center, Flex, Stack, GridCol, Paper, Grid, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useInterval } from "@mantine/hooks";
import { SaveQuizAnswer } from "@/services/quizz.service";

export interface Question {
  _id: number | string;
  question: string;
  choices?: string[];
  correctAnswer: string;
  type: string;
}

interface Result {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  userAnswers: { _id: number | string; answer: string }[];
}

interface Props {
  questions: Question[];
  preview?: boolean;
  quizId?: string
}

const Quizz = (props: Props) => {
  const { questions, preview, quizId } = props;
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
  const [isLoading, setIsLoading] = useState(false);

  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  const { _id: questionId, question, choices, type } = questions[currentQuestion];

  const handleChoiceSelection = (chosenAnswer: string) => {
    setResult((prevResult) => {
      const updatedUserAnswers = prevResult.userAnswers.slice(); // Create a copy of the array
      const existingAnswer = updatedUserAnswers.find((answer) => answer._id === questionId);

      if (existingAnswer) {
        existingAnswer.answer = chosenAnswer;
      } else {
        updatedUserAnswers.push({ _id: questionId, answer: chosenAnswer });
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

  const SendAndSaveAnswer = async (userAnswers: {_id: number | string; answer: string;}[]) => {
    setIsLoading(true);
    try {
      const response = await SaveQuizAnswer({ userAnswers, quizId });

      if (response.status) {
        setResult({
          score: response.data.score,
          correctAnswers: response.data.correctAnswers,
          wrongAnswers: response.data.wrongAnswers,
          userAnswers: response.data.userAnswers,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endChallenge = () => {
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    interval.stop();

    if (preview === true) {
      result.userAnswers.forEach((userAnswer) => {
        const question = questions.find((q) => q._id === userAnswer._id);

        if (question) {
          if (question.type === "FillInBlank") {
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
    } else {
      //Submete para o backend e seta o resultado
      SendAndSaveAnswer(result.userAnswers);
    }

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
      const existingAnswer = updatedUserAnswers.find((answer) => answer._id === questionId);

      if (existingAnswer) {
        // If it exists, update the answer
        existingAnswer.answer = userInput;
      } else {
        // If it doesn't exist, add a new entry
        updatedUserAnswers.push({ _id: questionId, answer: userInput });
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
    if (type === "FillInBlank") {
      return (
        <div className={classes.answerDiv}>
          <Input size={"lg"} value={result.userAnswers[currentQuestion]?.answer || ""} onChange={handleInputChange} mb={10} />
        </div>
      );
    }

    return (
      <div className={classes.answerDiv}>
        <ul>
          {choices?.map((answer, index) => {
            if (!answer) return <></>;

            return (
              <li onClick={() => handleChoiceSelection(answer)} key={index} className={result.userAnswers[currentQuestion]?.answer === answer ? classes.selectedAnswer : undefined}>
                <Text size="md" span>
                  {answer}
                </Text>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <Grid align="center" justify="center">
      <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 12 }}>
        <Paper withBorder shadow="md" p={30} mt={10} radius="md" className={classes.card}>
          <>
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
          </>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default Quizz;
