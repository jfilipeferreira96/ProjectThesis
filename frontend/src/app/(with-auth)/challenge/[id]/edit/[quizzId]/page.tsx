"use client";
import React, { useCallback, useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Radio, List, CheckIcon, Input, Tooltip, rem, Paper } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { Switch, ActionIcon, Box, Code } from "@mantine/core";
import { randomId, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import Quizz from "@/components/quizz";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { QuestionType, QuizzData, getSingleQuizz, editQuizz } from "@/services/quizz.service";
import { DateInput, DateTimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";

const Edit = ({ params: { id, quizzId } }: { params: { id: string; quizzId: string } }) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [quizzData, setQuizzData] = useState<QuizzData | null>(null);
  const isMdScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const response = await getSingleQuizz(quizzId);
        if (response.status) {
          setQuizzData(response.quiz.questions);
          // Assuming response.quiz.questions is an array of questions
          const initialQuestions = response.quiz.questions || [];
          
          form.setValues({
            name: response.quiz.name,
            startdate: response.quiz.startDate ? (new Date(response.quiz.startDate) as unknown as string) : "",
            enddate: response.quiz.endDat ? (new Date(response.quiz.endDate) as unknown as string) : "",
            questions: initialQuestions.map((question: QuizzData) => ({
              ...question,
              id: randomId(),
            })),
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to fetch quizz data",
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error fetching quizz data:", error);
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      }
    };

    fetchQuizz();
  }, [quizzId]);

  const form = useForm({
    initialValues: {
      name: "",
      startdate: "",
      enddate: "",
      questions: [
        {
          question: "",
          _id: randomId(),
          type: QuestionType.MultipleQuestions,
          choices: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    },
    validate: (values) => {
      const errors: FormErrors = {};

      if (values.startdate && values.enddate && new Date(values.startdate) >= new Date(values.enddate)) {
        errors.startdate = "Start date must be before end date.";
        errors.enddate = "End date must be after start date.";
      }

      values.questions.forEach((item, index) => {
        if (!item.question) {
          errors.question = `Please fill in the question in question ${index + 1}.`;
        }
        if (item.type === QuestionType.MultipleQuestions && !item.correctAnswer) {
          errors.correctAnswer = `Please fill in the correct answer field in question ${index + 1}.`;
        }

        // Verifica se a pergunta é do tipo "MultipleQuestions"
        if (item.type === QuestionType.MultipleQuestions) {
          // Verifica se há uma "correctAnswer"
          if (!item.correctAnswer) {
            errors.correctAnswer = `Please select a correct answer for question ${index + 1}.`;
          }

          // Verifica se a "correctAnswer" é única
          if (item.correctAnswer !== "" && item.choices.filter((choice) => choice === item.correctAnswer).length !== 1) {
            errors.correctAnswer = `Please ensure that there is exactly one unique correct answer for question ${index + 1}.`;
          }
        }
      });

      return errors;
    },
  });

  const nextStep = (addFormEntry: boolean) => {
    if (addFormEntry) {
      form.insertListItem("questions", {
        question: "",
        key: randomId(),
        type: QuestionType.MultipleQuestions,
        choices: ["", "", "", ""],
        correctAnswer: "",
      });
    }
    setActive((current) => {
      return current + 1;
    });
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleCorrectAnswerClick = (index: number, choice: string) => {
    form.setFieldValue(`questions.${index}.correctAnswer`, choice);
  };

  const handleChoiceInputChange = (index: number, choiceIndex: number, newValue: string) => {
    // Verifica se o input atual é a "correct answer"
    const isCorrectAnswer = form.values.questions[index].correctAnswer === form.values.questions[index].choices[choiceIndex];

    // Atualiza o choices array quando o valor do input é alterado
    form.setFieldValue(`questions.${index}.choices.${choiceIndex}`, newValue);

    // Se o input atual é a "correct answer" e o valor é alterado, reseta o campo correctAnswer
    if (isCorrectAnswer && newValue !== form.values.questions[index].choices[choiceIndex]) {
      form.setFieldValue(`questions.${index}.correctAnswer`, "");
    }
  };

  const handleRadioChange = (index: number, type: QuestionType) => {
    form.setFieldValue(`questions.${index}.type`, type);
    form.setFieldValue(`questions.${index}.question`, "");

    if (type === QuestionType.MultipleQuestions) {
      form.setFieldValue(`questions.${index}.choices`, ["", "", "", ""]);
      form.setFieldValue(`questions.${index}.correctAnswer`, "");
    } else {
      form.setFieldValue(`questions.${index}.choices`, undefined);
      form.setFieldValue(`questions.${index}.correctAnswer`, "");
    }
  };

  const onSubmitHandler = useCallback(async (data: QuizzData) => {
    
    try {

      const sendObject = { ...data, quizzId: quizzId };
      const response = await editQuizz(sendObject);
      
      if (response.status) {
        notifications.show({
          title: "Success",
          message: "",
          color: "green",
        });

        //redirect
        router.push(`${routes.challenge.url}/${id}/settings`);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

  return (
    <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
      <title>Edit Challenge</title>
      <Modal opened={opened} onClose={close} title="" size={"calc(100vw - 3rem)"}>
        <Title>Quizz Preview</Title>
        <Quizz questions={form.values.questions} preview />
      </Modal>

      <Flex justify="space-between">
        <Button size={isMdScreen ? "md" : "lg"} variant={isMdScreen ? "transparent" : "filled"} p={isMdScreen ? 0 : undefined} color="gray" onClick={() => router.push(`${routes.challenge.url}/${id}/settings`)}>
          Back
        </Button>
        <div>
          <Button size={isMdScreen ? "md" : "lg"} variant={isMdScreen ? "transparent" : "filled"} p={isMdScreen ? 0 : undefined} mr={5} color="gray" onClick={open}>
            Preview
          </Button>
          <Button type="submit" size={isMdScreen ? "md" : "lg"} variant={isMdScreen ? "transparent" : "filled"} p={isMdScreen ? 0 : undefined}>
            Save Quizz
          </Button>
        </div>
      </Flex>

      <Title>Edit Quizz</Title>
      <Text c="dimmed">Create a challenge for your students using the area above. To preview it, simply click on the preview button.</Text>

      <Grid>
        <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 3 }} style={{ display: "flex", flexDirection: "column" }}>
          <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
            <Title order={3}>Configurations</Title>

            <TextInput label="Quizz name" placeholder="Quizz xpto" required {...form.getInputProps("name")} />
            <Group grow>
              <DateTimePicker label="Pick start date" placeholder="Pick start date" minDate={new Date()} {...form.getInputProps("startdate")} error={form.errors.startdate} />

              <DateTimePicker label="Pick end date" placeholder="Pick end date" minDate={new Date()} {...form.getInputProps("enddate")} error={form.errors.enddate} />
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 9 }}>
          <Paper withBorder shadow="md" p={30} mt={10} radius="md">
            {form.values.questions.map((item, index) => {
              if (index !== active) {
                return;
              }

              return (
                <div key={index}>
                  <Group mt="xs" justify="space-between" align="center" mb={10}>
                    <Title order={3}>Question {index + 1}</Title>
                    <div>
                      {index !== 0 && (
                        <Tooltip label={"Delete question"} withArrow position="right">
                          <ActionIcon
                            color="red"
                            onClick={() => {
                              form.removeListItem("questions", index), setActive((prev) => prev - 1);
                            }}
                            mr={5}
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                      )}

                      {active === form.values.questions.length - 1 && (
                        <Tooltip label={"Add question"} withArrow position="right">
                          <ActionIcon
                            color="green"
                            onClick={() => {
                              nextStep(true);
                            }}
                          >
                            <IconPlus size="1rem" />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </div>
                  </Group>

                  <Radio.Group
                    name="type"
                    label="Select the question type"
                    withAsterisk
                    defaultValue={item.type}
                    {...form.getInputProps(`questions.${index}.type`)}
                    onChange={(type) => handleRadioChange(index, type as QuestionType)}
                  >
                    <Group align="center" justify="center">
                      <Radio value={QuestionType.MultipleQuestions} label={"Multiple questions"} icon={CheckIcon} mt="md" />
                      <Radio value={QuestionType.FillInBlank} label={"Fill in the blank"} icon={CheckIcon} mt="md" />
                    </Group>
                  </Radio.Group>

                  <TextInput
                    label={"Question"}
                    placeholder={item.type === QuestionType.MultipleQuestions ? "Enter a question" : "What's the _ _ _ _ ?"}
                    withAsterisk
                    style={{ flex: 1 }}
                    {...form.getInputProps(`questions.${index}.question`)}
                    mt={10}
                  />

                  {item.type === QuestionType.MultipleQuestions &&
                    item.choices.map((choice, choiceIndex) => {
                      return (
                        <TextInput
                          key={choiceIndex}
                          placeholder={`Awnser nº ${choiceIndex + 1}`}
                          defaultValue={choice}
                          rightSectionPointerEvents="all"
                          mt="md"
                          label={choiceIndex === 0 ? "Answers" : ""}
                          withAsterisk={choiceIndex === 0 ? true : false}
                          onChange={(e) => handleChoiceInputChange(index, choiceIndex, e.currentTarget.value)}
                          rightSection={
                            <Tooltip label={item.correctAnswer === choice && choice !== "" ? "Correct choice" : "Choose the correct choice"} withArrow position="right">
                              <ActionIcon color={item.correctAnswer === choice && choice !== "" ? "teal" : "gray"} variant="subtle" onClick={() => handleCorrectAnswerClick(index, choice)}>
                                <IconCheck style={{ width: rem(16) }} />
                              </ActionIcon>
                            </Tooltip>
                          }
                        />
                      );
                    })}

                  {item.type === QuestionType.FillInBlank && (
                    <TextInput label={"Correct answer"} withAsterisk placeholder={"Correct answer"} style={{ flex: 1 }} {...form.getInputProps(`questions.${index}.correctAnswer`)} mt={10} />
                  )}

                  <Input.Wrapper size="md" error={form?.errors?.question || form?.errors?.correctAnswer} mt={10} />

                  <Flex justify={active !== 0 ? "space-between" : "flex-end"} mt="md">
                    {active !== 0 && (
                      <Button
                        color="gray"
                        onClick={() => {
                          prevStep();
                        }}
                      >
                        Previous Question
                      </Button>
                    )}

                    {active < form.values.questions.length - 1 && (
                      <Button
                        onClick={() => {
                          nextStep(false);
                        }}
                      >
                        Next Question
                      </Button>
                    )}
                  </Flex>
                </div>
              );
            })}
          </Paper>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default Edit;
