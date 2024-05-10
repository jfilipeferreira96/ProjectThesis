"use client";
import React from "react";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input, Center, Textarea, Radio, CheckIcon, List, ThemeIcon, Box } from "@mantine/core";
import { useForm, zodResolver, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from "zod";
import { routes } from "@/config/routes";
import { ChallengeType, CreateChallengeData, createChallenge } from "@/services/challenge.service";
import { useSession } from "@/providers/SessionProvider";
import ThreeDButton from "@/components/3dbutton";
import RichTextEditor from "@/components/rich-text-editor";

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
      type: ChallengeType.TYPE_EXPRESS,
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
          <TextInput className="specialinput" label="Title" placeholder="Example: Java Loops" required {...form.getInputProps("title")} />

          <Textarea className="specialinput" label="Description" placeholder="Enter a description for this challenge" mt="md" {...form.getInputProps("description")} />

          <Radio.Group name="type" label="Select the challenge type" withAsterisk mt="md" defaultValue={ChallengeType.TYPE_EXPRESS} {...form.getInputProps("type")}>
            <StyledList spacing="xs" size="xs" center icon={<></>}>
              <List.Item>
                <b>Express -</b> Fast paced challenge and short duration, perfect for a single dynamic class.
              </List.Item>
              <List.Item>
                <b>Marathon -</b> A league-based challenge comprised of one or multiple challenges.
              </List.Item>
            </StyledList>

            <Group mt="xs" align="center" justify="center">
              <Radio value={ChallengeType.TYPE_EXPRESS} label={ChallengeType.TYPE_EXPRESS} checked icon={CheckIcon} mt="md" />
              <Radio value={ChallengeType.TYPE_MARATHON} label={ChallengeType.TYPE_MARATHON} icon={CheckIcon} mt="md" />
            </Group>
          </Radio.Group>

          <ThreeDButton color="blue" mt="lg" smaller animationOnHover={false} type="submit">
            Create
          </ThreeDButton>
        </StyledPaper>
      </form>
    </Center>
  );
}

export default CreateChallengePage;
