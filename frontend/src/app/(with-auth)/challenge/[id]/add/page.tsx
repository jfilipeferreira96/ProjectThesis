"use client";
import React, { useCallback, useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Radio, List, CheckIcon, Input, Tooltip, rem, Paper, Select, FileInput } from "@mantine/core";
import { DateInput, DateTimePicker } from '@mantine/dates';
import { FormErrors, useForm } from "@mantine/form";
import { Switch, ActionIcon, Box, Code } from "@mantine/core";
import { randomId, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash, IconFile } from "@tabler/icons-react";
import Quizz from "@/components/quizz";
import { notifications } from "@mantine/notifications";
import { EvalutionType, QuestionType, QuizzData, createQuizz } from "@/services/quizz.service";
import { useRouter } from "next/navigation";
import '@mantine/dates/styles.css';
import styled from "styled-components";

const StyledList = styled(List)`
  color: var(--mantine-color-dimmed);
`;

const Add = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const isMdScreen = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      name: "",
      startdate: "",
      enddate: "",
      evaluation: EvalutionType.Automatic,
      questions: [
        {
          question: "",
          key: randomId(),
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

 const handleRadioChangeEvalution = (type: EvalutionType) => {
    // Atualiza o valor do tipo de avaliação
   form.setFieldValue(`evaluation`, type); 

   // Reset das perguntas para o estado inicial
   form.setFieldValue(`questions`, [
     {
       question: "",
       key: randomId(),
       type: QuestionType.MultipleQuestions,
       choices: ["", "", "", ""],
       correctAnswer: "",
     },
   ]);

   // Volta para a questão 1
   setActive(0);
 };


  const onSubmitHandler = useCallback(async (data: QuizzData) => {

    try {
      const sendObject = { ...data, challengeId: id};
      const response = await createQuizz(sendObject);
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
      <title>Add Challenge</title>
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
          <Button type="submit" size={isMdScreen ? "md" : "lg"} p={isMdScreen ? 0 : undefined} variant={isMdScreen ? "transparent" : "filled"}>
            Save Quizz
          </Button>
        </div>
      </Flex>

      <Title>Create Quizz</Title>
      <Text c="dimmed">Create a challenge for your students using the area above. To preview it, simply click on the preview button.</Text>

      <Grid>
        <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 3 }} style={{ display: "flex", flexDirection: "column" }}>
          <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
            <Title order={3}>Configurations</Title>

            <TextInput className="specialinput" label="Quizz name" placeholder="Quizz xpto" required {...form.getInputProps("name")} />
            <Group grow>
              <DateTimePicker className="specialinput" label="Pick start date" placeholder="Pick start date" minDate={new Date()} {...form.getInputProps("startdate")} error={form.errors.startdate} />

              <DateTimePicker className="specialinput" label="Pick end date" placeholder="Pick end date" minDate={new Date()} {...form.getInputProps("enddate")} error={form.errors.enddate} />
            </Group>

            <Radio.Group
              name="evaluation"
              label="Evaluation type"
              withAsterisk
              defaultValue={EvalutionType.Automatic}
              {...form.getInputProps(`evaluation`)}
              onChange={(type) => handleRadioChangeEvalution(type as EvalutionType)}
            >
              <StyledList spacing="xs" size="xs" center icon={<></>}>
                <List.Item>
                  <b>Automatic:</b> Multiple questions and Fill in the blank
                </List.Item>
                <List.Item>
                  <b>Manual:</b> Multiple questions, Fill in the blank and File Upload
                </List.Item>
              </StyledList>
              <Group align="center" justify="center">
                <Radio value={EvalutionType.Automatic} label={"Automatic"} icon={CheckIcon} mt="md" />
                <Radio value={EvalutionType.Manual} label={"Manual"} icon={CheckIcon} mt="md" />
              </Group>
            </Radio.Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 9 }}>
          <Paper withBorder shadow="md" p={30} mt={10} radius="md">
            {form.values.questions.map((item, index) => {
              if (index !== active) {
                return;
              }

              return (
                <div key={item.key}>
                  <Group justify="space-between" align="center" mb={10}>
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
                      {form.values.evaluation === EvalutionType.Manual && <Radio value={QuestionType.FileUpload} label={"File Upload"} icon={CheckIcon} mt="md" />}
                    </Group>
                  </Radio.Group>

                  <TextInput
                    className="specialinput"
                    label={"Question"}
                    placeholder={item.type === QuestionType.FillInBlank ? "What's the _ _ _ _ ?" : "Enter a question"}
                    withAsterisk
                    style={{ flex: 1 }}
                    {...form.getInputProps(`questions.${index}.question`)}
                    mt={10}
                  />

                  {item.type === QuestionType.MultipleQuestions &&
                    item.choices.map((choice, choiceIndex) => {
                      return (
                        <TextInput
                          className="specialinput"
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
                    <TextInput className="specialinput" label={"Correct answer"} withAsterisk placeholder={"Correct answer"} style={{ flex: 1 }} {...form.getInputProps(`questions.${index}.correctAnswer`)} mt={10} />
                  )}

                  {item.type === QuestionType.FileUpload && (
                    /*  <TextInput className="specialinput" label={"Correct answer"} withAsterisk placeholder={"Correct answer"} style={{ flex: 1 }} {...form.getInputProps(`questions.${index}.correctAnswer`)} mt={10} /> */
                    <FileInput className="specialinput" rightSection={<IconFile />} label="Upload your file" placeholder="Your file" withAsterisk rightSectionPointerEvents="none" mt={10} radius="lg" />
                  )}

                  <Input.Wrapper className="specialinput" size="md" error={form?.errors?.question || form?.errors?.correctAnswer} mt={10} />

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

export default Add;
