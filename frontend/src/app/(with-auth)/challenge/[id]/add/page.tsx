"use client";
import { getSingleChallenge } from "@/services/challenge.service";
import React, { useCallback, useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Radio, List, CheckIcon, Input, Tooltip, rem, Paper } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { Switch, ActionIcon, Box, Code } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import styled from "styled-components";
import Quizz from "@/components/quizz";

export enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

const Add = ({ params: { id } }: { params: { id: string } }) => {
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      quizz: [
        {
          question: "",
          id: randomId(),
          type: QuestionType.MultipleQuestions,
          choices: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    },
    validate: (values) => {
      const errors: FormErrors = {};

      values.quizz.forEach((item, index) => {
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
      form.insertListItem("quizz", {
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
    form.setFieldValue(`quizz.${index}.correctAnswer`, choice);
  };

  const handleChoiceInputChange = (index: number, choiceIndex: number, newValue: string) => {
    // Verifica se o input atual é a "correct answer"
    const isCorrectAnswer = form.values.quizz[index].correctAnswer === form.values.quizz[index].choices[choiceIndex];

    // Atualiza o choices array quando o valor do input é alterado
    form.setFieldValue(`quizz.${index}.choices.${choiceIndex}`, newValue);

    // Se o input atual é a "correct answer" e o valor é alterado, reseta o campo correctAnswer
    if (isCorrectAnswer && newValue !== form.values.quizz[index].choices[choiceIndex]) {
      form.setFieldValue(`quizz.${index}.correctAnswer`, "");
    }
  };

  const handleRadioChange = (index: number, type: QuestionType) => {
    form.setFieldValue(`quizz.${index}.type`, type);
    form.setFieldValue(`quizz.${index}.question`, "");

    if (type === QuestionType.MultipleQuestions) {
      form.setFieldValue(`quizz.${index}.choices`, ["", "", "", ""]);
      form.setFieldValue(`quizz.${index}.correctAnswer`, "");
    } else {
      form.setFieldValue(`quizz.${index}.choices`, undefined);
      form.setFieldValue(`quizz.${index}.correctAnswer`, "");
    }
  };

  const onSubmitHandler = useCallback(async (data: any) => {
    console.log(data);
    try {
    } catch (error) {}
  }, []);

  return (
    <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
      <Grid>
        <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 6 }}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <>
              {form.values.quizz.map((item, index) => {
                if (index !== active) {
                  return;
                }

                return (
                  <div key={item.id}>
                    <Group mt="xs" justify="space-between" align="center" mb={10}>
                      <Title>Question {index + 1}</Title>
                      <div>
                        {index !== 0 && (
                          <ActionIcon
                            color="red"
                            onClick={() => {
                              form.removeListItem("quizz", index), setActive((prev) => prev - 1);
                            }}
                            mr={5}
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        )}

                        {active === form.values.quizz.length - 1 && (
                          <ActionIcon
                            color="green"
                            onClick={() => {
                              nextStep(true);
                            }}
                          >
                            <IconPlus size="1rem" />
                          </ActionIcon>
                        )}
                      </div>
                    </Group>

                    <Radio.Group
                      name="type"
                      label="Select the question type"
                      withAsterisk
                      mt="md"
                      defaultValue={item.type}
                      {...form.getInputProps(`quizz.${index}.type`)}
                      onChange={(type) => handleRadioChange(index, type as QuestionType)}
                    >
                      <Group align="center" justify="center">
                        <Radio value={QuestionType.MultipleQuestions} label={"Multiple questions"} icon={CheckIcon} mt="md" />
                        <Radio value={QuestionType.FillInBlank} label={"Fill in the blank"} icon={CheckIcon} mt="md" />
                      </Group>
                    </Radio.Group>

                    <TextInput
                      placeholder={item.type === QuestionType.MultipleQuestions ? "Enter a question" : "What's the _ _ _ _ ?"}
                      withAsterisk
                      style={{ flex: 1 }}
                      {...form.getInputProps(`quizz.${index}.question`)}
                      mt={10}
                    />

                    {item.type === QuestionType.MultipleQuestions &&
                      item.choices.map((choice, choiceIndex) => {
                        return (
                          <Input
                            key={choiceIndex}
                            placeholder={`Awnser nº ${choiceIndex + 1}`}
                            defaultValue={choice}
                            rightSectionPointerEvents="all"
                            mt="md"
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

                    {item.type === QuestionType.FillInBlank && <TextInput placeholder={"Correct answer"} withAsterisk style={{ flex: 1 }} {...form.getInputProps(`quizz.${index}.correctAnswer`)} mt={10} />}

                    <Input.Wrapper size="md" error={form?.errors?.question || form?.errors?.correctAnswer} mt={10} />

                    <Group justify={active !== 0 ? "space-between" : "flex-end"} mt="md">
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

                      {active < form.values.quizz.length - 1 && (
                        <Button
                          onClick={() => {
                            nextStep(false);
                          }}
                        >
                          Next Question
                        </Button>
                      )}
                    </Group>
                  </div>
                );
              })}

              <Center mt={10}>
                <Button type="submit">Save Quizz</Button>
              </Center>
              {/* CODE: */}
              <Text size="sm" fw={500} mt="md">
                Form values:
              </Text>
              <Code block>{JSON.stringify(form.values, null, 2)}</Code>
            </>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 6 }}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Quizz preview questions={form.values.quizz} />
          </Paper>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default Add;
