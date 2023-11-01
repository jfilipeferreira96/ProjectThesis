"use client";
import React from "react";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input, Center, Textarea, Radio, CheckIcon, List, ThemeIcon } from "@mantine/core";
import { useForm, zodResolver, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from "zod";
import { routes } from "@/config/routes";
import { ChallengeType, CreateChallengeData, createChallenge } from "@/services/challenge.service";
import { useSession } from "@/providers/SessionProvider";

const StyledPaper = styled(Paper)`
  width: 800px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

const StyledList = styled(List)`
  color: var(--mantine-color-dimmed);
`;

const schema = z.object({
  title: z.string().min(4, { message: "Title should have at least 4 letters" }),
  description: z.string(),
  type: z.string(),
});

function CreateChallengePage() {
  const router = useRouter();
  const { addToAdminChallenge } = useSession();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      type: ChallengeType.TYPE_A,
    },
    validate: zodResolver(schema),
  });

  const onSubmitHandler = useCallback(async (data: CreateChallengeData) => {
    try {
      const response = await createChallenge(data);
      if (response.status) {
        notifications.show({
          title: "Success",
          message: "",
          color: "green",
        });

        addToAdminChallenge(response.id);

        //redirect
        router.push(routes.challenge.url + "/" + response.id);
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
    <Center>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <Title ta="center" mt={100}>
          Create a challenge
        </Title>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Title" placeholder="Example: Java Loops" required {...form.getInputProps("title")} />

          <Textarea label="Description" placeholder="Enter a description for this challenge" mt="md" {...form.getInputProps("description")} />

          <Radio.Group name="type" label="Select the challenge type" withAsterisk mt="md" defaultValue={ChallengeType.TYPE_A} {...form.getInputProps("type")}>
            <StyledList spacing="xs" size="xs" center icon={<></>}>
              <List.Item>Type A - Fast paced challenge and short duration, ideal for a single class;</List.Item>
              <List.Item>Type B - Long challenge with multiple session, football matches idk;</List.Item>
            </StyledList>

            <Group mt="xs" align="center" justify="center">
              <Radio value={ChallengeType.TYPE_A} label={ChallengeType.TYPE_A} checked icon={CheckIcon} mt="md" />
              <Radio value={ChallengeType.TYPE_B} label={ChallengeType.TYPE_B} icon={CheckIcon} mt="md" />
            </Group>
          </Radio.Group>

          <Button fullWidth mt="md" type="submit">
            Create
          </Button>
        </StyledPaper>
      </form>
    </Center>
  );
}

export default CreateChallengePage;
