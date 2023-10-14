"use client";
import { getSingleChallenge } from "@/services/challenge.service";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Radio, List, CheckIcon, Input, Tooltip, rem } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { Switch, ActionIcon, Box, Code } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import styled from "styled-components";

export enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

const Addd = ({ params: { id } }: { params: { id: string } }) => {
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      quizz: [
        {
          question: "Question example",
          key: randomId(),
          type: QuestionType.MultipleQuestions,
          choices: ["Anwser 1", "Anwser 2", "Anwser 3", "Anwser 4"],
          correctAnswer: "Anwser 1",
        },
      ],
    },
    validate: (values) => {
      const errors: FormErrors = {};

      values.quizz.forEach((item, index) => {
        // Verifica se a pergunta é do tipo "MultipleQuestions"
        if (item.type === QuestionType.MultipleQuestions) {
          // Verifica se há uma "correctAnswer"
          if (!item.correctAnswer) {
            errors.correctAnswer = `Please select a correct answer on question nº ${index + 1}.`;
          }

          // Verifica se a "correctAnswer" é única
          if (item.choices.filter((choice) => choice === item.correctAnswer).length !== 1) {
            errors.correctAnswer = `There must be exactly one unique correct answer. Check question nº ${index + 1}.`;
          }
        }
      });

      return errors;
    },
  });

  const nextStep = (addFormEntry: boolean) => {
    
    if (addFormEntry) {
      form.insertListItem("quizz", {
        question: "Question example",
        key: randomId(),
        type: QuestionType.MultipleQuestions,
        choices: ["Anwser 1", "Anwser 2", "Anwser 3", "Anwser 4"],
        correctAnswer: "Anwser 1",
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

  return (
    <Box maw={500} mx="auto">
      {form.values.quizz.map((item, index) => {
        if (index !== active) {
          return;
        }

        return (
          <div key={item.key}>
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

            <Radio.Group name="type" label="Select the question type" withAsterisk mt="md" defaultValue={item.type} {...form.getInputProps(`quizz.${index}.type`)}>
              <Group align="center" justify="center">
                <Radio value={QuestionType.MultipleQuestions} label={"Multiple questions"} icon={CheckIcon} mt="md" />
                <Radio value={QuestionType.FillInBlank} label={"Fill in the blank"} checked icon={CheckIcon} mt="md" />
              </Group>
            </Radio.Group>

            <TextInput placeholder="Enter a question" withAsterisk style={{ flex: 1 }} {...form.getInputProps(`quizz.${index}.question`)} mt={10} />

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
                      <Tooltip label={item.correctAnswer === choice ? "Correct choice" : "Choose the correct choice"} withArrow position="right">
                        <ActionIcon color={item.correctAnswer === choice ? "teal" : "gray"} variant="subtle" onClick={() => handleCorrectAnswerClick(index, choice)}>
                          <IconCheck style={{ width: rem(16) }} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                );
              })}

            <Input.Wrapper error={form?.errors?.correctAnswer} mt={10} />

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
        <Button onClick={() => { console.log(123); if (form.validate().hasErrors) {
          return;
        } }}>Save Quizz</Button>
      </Center>
      {/* CODE: */}
      <Text size="sm" fw={500} mt="md">
        Form values:
      </Text>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>
    </Box>
  );
};

export default Addd;
