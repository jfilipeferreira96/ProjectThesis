import React, { useEffect, useState } from "react";
import classes from "./quizz.module.scss";
import { Card, Image, Title, TextInput, Loader, Anchor, Group, Text, Button, Center, Flex, Stack, GridCol, Paper, Grid, Input, FileInput, Progress, AppShellAside } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useInterval } from "@mantine/hooks";
import { IAnswer, SaveQuizAnswer } from "@/services/quizz.service";
import { IconFile } from "@tabler/icons-react";
import ThreeDButton from "../3dbutton";

export interface Question
{
  _id?: number | string;
  key: number | string;
  question: string;
  choices?: string[];
  correctAnswer: string;
  type: string;
  pontuation?: number;
  file?: File | any | string;
}

interface Result
{
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  userAnswers: { _id: number | string; answer: string | File | any }[];
}

interface Props
{
  questions: Question[];
  preview?: boolean;
  quizId?: string;
  isAutomatic?: boolean;
  sounds?: boolean;
  reviewMode?: boolean;
  questionNumber?: { total: number, atual: number}
}

const Quizz = (props: Props) =>
{
  const { questions, preview, quizId, isAutomatic, sounds, reviewMode, questionNumber } = props;
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

  useEffect(() =>
  {
    if (!preview)
    {
      interval.start();
      return interval.stop;
    }
  }, []);

  const { _id: questionId, key, question, choices, type, pontuation, file } = questions[currentQuestion];

  const handleChoiceSelection = (chosenAnswer: string) =>
  {
    setResult((prevResult) =>
    {
      const updatedUserAnswers = prevResult.userAnswers.slice(); // Create a copy of the array
      const existingAnswer = updatedUserAnswers.find((answer) => answer._id === questionId);

      if (existingAnswer)
      {
        existingAnswer.answer = chosenAnswer;
      } else
      {
        updatedUserAnswers.push(questionId ? { _id: questionId, answer: chosenAnswer } : { _id: key, answer: chosenAnswer });
      }

      return {
        ...prevResult,
        userAnswers: updatedUserAnswers,
      };
    });

    if (sounds)
    {
      new Audio("/sounds/popclick.mp3").play();
    }
  };

  const handleFile = (file: File | null | string) =>
  {
    setResult((prevResult) =>
    {
      const updatedUserAnswers = prevResult.userAnswers.slice();
      const existingAnswer = updatedUserAnswers.find((answer) => answer._id === questionId);

      if (existingAnswer)
      {
        existingAnswer.answer = file; // Assuming you want to store the file object
      } else
      {
        updatedUserAnswers.push(questionId ? { _id: questionId, answer: file } : { _id: key, answer: file });
      }

      return {
        ...prevResult,
        userAnswers: updatedUserAnswers,
      };
    });
  };

  const onClickNext = (id: number) =>
  {
    if (sounds)
    {
      new Audio("/sounds/click.mp3").play();
    }
    setCurrentQuestion(id);
  };

  const SendAndSaveAnswer = async (userAnswers: IAnswer | any) =>
  {
    setIsLoading(true);

    const answers: IAnswer = userAnswers.map((ans: IAnswer) => ({ ...ans, pontuation: 0 }));

    try
    {
      const response = await SaveQuizAnswer({ userAnswers: answers, quizId });

      if (response.status && response?.data)
      {
        setResult({
          score: response.data.score,
          correctAnswers: response.data.correctAnswers,
          wrongAnswers: response.data.wrongAnswers,
          userAnswers: response.data.userAnswers,
        });

        if (sounds)
        {
          new Audio("/sounds/finish.mp3").play(); // Som ao finalizar
        }
      }
    } catch (error)
    {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    } finally
    {
      setIsLoading(false);
    }
  };

  const endChallenge = () =>
  {
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    interval.stop();

    if (preview === true)
    {
      result.userAnswers.forEach((userAnswer) =>
      {
        const question = questions.find((q) => q._id === userAnswer._id);

        if (question)
        {
          if (question.type === "FillInBlank")
          {
            if (userAnswer.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase())
            {
              score += 5;
              correctAnswers += 1;
            } else
            {
              wrongAnswers += 1;
            }
          } else
          {
            if (userAnswer.answer === question.correctAnswer)
            {
              score += 5;
              correctAnswers += 1;
            } else
            {
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
    } else
    {
      //Submete para o backend e seta o resultado
      SendAndSaveAnswer(result.userAnswers);
    }

    setShowResult(true);
  };

  setTimeout(() =>
  {
    setShowAnswerTimer(true);
  });

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
  {
    const userInput = evt.target.value;

    setResult((prevResult) =>
    {
      const updatedUserAnswers = prevResult.userAnswers.slice(); // Create a copy of the array

      // Check if the current question id is already in userAnswers
      const existingAnswer = updatedUserAnswers.find((answer) => answer._id === questionId);

      if (existingAnswer)
      {
        // If it exists, update the answer
        existingAnswer.answer = userInput;
      } else
      {
        // If it doesn't exist, add a new entry
        updatedUserAnswers.push(questionId ? { _id: questionId, answer: userInput } : { _id: key, answer: userInput });
      }

      return {
        ...prevResult,
        userAnswers: updatedUserAnswers,
      };
    });
  };

  const handleTryAgain = () =>
  {
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

  const getAnswerUI = () =>
  {
    if (type === "FillInBlank")
    {
      return (
        <div className={classes.answerDiv}>
          <Input className="specialinput" size={"lg"} value={result.userAnswers[currentQuestion]?.answer || ""} onChange={handleInputChange} mb={10} />
        </div>
      );
    }

    if (type === "FileUpload")
    {
      return (
        <div className={classes.answerDiv}>
          <FileInput
            className="specialinput"
            rightSection={<IconFile />}
            label="Upload your file"
            placeholder="Your file"
            withAsterisk={true}
            rightSectionPointerEvents="none"
            mt={10}
            radius="lg"
            name="files"
            onChange={handleFile}
            clearable
          />
        </div>
      );
    }

    return (
      <div className={classes.answerDiv}>
        <ul>
          {choices?.map((answer, index) =>
          {
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
        {!showResult && (
          <Paper withBorder shadow="md" p={30} mt={10} radius="md" className={reviewMode ? classes.card : classes.card + " " + classes.minHeight}>
            <>
              {/* {showAnswerTimer && <AnswerTimer duration={10} onTimeUp={handleTimeUp} />} */}
              {/* Secção Header */}
              {reviewMode &&
                
                  <div className={classes.reviewheader}>
                    <Title order={3} mb={20}>
                      <Text span fw={900} variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} className={classes.activeQuestion}>
                      {questionNumber && questionNumber.atual + 1}
                      </Text>
                        /{ questionNumber && questionNumber.total}
                    </Title>
                  </div>
              }

              {!reviewMode &&
                <div className={classes.header}>

                  <Grid>
                    <Grid.Col span={{ md: 9, sm: 9, xs: 9, lg: 9 }}>
                      <div className={classes.header}>
                        <Progress radius="md" size="lg" value={((currentQuestion + 1) / questions.length) * 100} />
                      </div>
                    </Grid.Col>
                  </Grid>

                </div>
              }

              <div className={classes.body}>
                {/* Secção Body */}
                <Title order={2}>{question}</Title>

                {getAnswerUI()}
              </div>

              {/* Secção Footer */}
              {!reviewMode &&
                <div className={classes.footer}>
                  <Group justify="center">
                    {currentQuestion > 0 && (
                      <ThreeDButton mt="md" color="gray" onClick={() => onClickNext(currentQuestion - 1)}>
                        Back
                      </ThreeDButton>
                    )}
                    {currentQuestion === questions.length - 1 ? (
                      <ThreeDButton mt="md" color="blue" onClick={() => endChallenge()} disabled={result.userAnswers[currentQuestion]?.answer ? false : true}>
                        Finish
                      </ThreeDButton>
                    ) : (
                      <ThreeDButton mt="md" color="green" onClick={() => onClickNext(currentQuestion + 1)} disabled={result.userAnswers[currentQuestion]?.answer ? false : true}>
                        Next
                      </ThreeDButton>
                    )}
                  </Group>
                </div>
              }
            </>
          </Paper>
        )}
        {showResult && (
          <Center>
            <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
              <Card withBorder radius="md">
                <Stack align={"center"} gap="0">
                  {isAutomatic && (
                    <>
                      <Title ta="center" size={"h1"} mb={5}>
                        Result
                      </Title>

                      <Text size="md" ta="center" mt={10}>
                        Total Questions: <span>{questions.length}</span>
                      </Text>

                      <Text size="md" ta="center" mt={10}>
                        Total Score: <span>{result.score}</span>
                      </Text>

                      <Text size="md" ta="center" mt={10}>
                        Correct Answers: <span>{result.correctAnswers}</span>
                      </Text>

                      <Text size="md" ta="center" mt={10}>
                        Wrong Answers: <span>{result.wrongAnswers}</span>
                      </Text>
                      <Flex align={"center"}>
                        <Image src="/hero2.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto", width: "60%" }} />
                      </Flex>
                    </>
                  )}
                  {!isAutomatic && (
                    <>
                      <Title ta="center" size={"h2"}>
                        Sit tight!
                      </Title>
                      <Text c="dimmed" size="md" ta="center" mt="sm" mb="sm">
                        Your response is about to undergo some serious scrutiny.
                      </Text>
                      <Flex align={"center"}>
                        <Image src="/waiting.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto", width: "60%" }} />
                      </Flex>
                    </>
                  )}
                  {preview && (
                    <Button mt={5} size="md" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 90 }} onClick={handleTryAgain}>
                      Review the quiz once more
                    </Button>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Center>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default Quizz;
