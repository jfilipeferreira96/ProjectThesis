"use client";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import classes from "./home.module.css";
import { IconFlag, IconGasStation, IconGauge, IconManualGearbox, IconUserCheck, IconUsers } from "@tabler/icons-react";
import { ChallengeStatus, ChallengeType, getChallenges, getStatusInfo } from "@/services/challenge.service";

type ChallengeProps = {
  _id: string;
  title: string;
  description: string;
  type: ChallengeType;
  admins: string[];
  participants: string[];
  status: ChallengeStatus;
}[];

export default function Home() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [challenges, setChallenges] = useState<ChallengeProps>([]);
  const [isLoading, setIsLoading] = useState(false);

  const GetUserChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await getChallenges();
      if (response) {
        console.log(response);
        setChallenges(response.challenges);
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
  useEffect(() => {
    GetUserChallenges();
  }, []);

  /* TODO */
  // async function join league
  // join -> refresh leagues

  const form = useForm({
    initialValues: {
      token: "",
    },
    validate: {
      token: (value) => (value.length >= 4 ? null : "Password must be at least 4 characters long"),
    },
  });

  const onSubmitHandler = useCallback(async (data: { token: string }) => {
    try {
      notifications.show({
        title: "Success",
        message: "Leave the building immediately",
        color: "green",
      });

      // chamada da funçao fetchLeagues
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <Grid justify="center" align="stretch" mt={10}>
      <Modal opened={opened} onClose={close} title="" size="md">
        <Title ta="center">JOIN A LEAGUE</Title>

        <Text c="dimmed" size="md" ta="center" mt={5}>
          Do you hold the token for league access?
          <br />
          Great! Paste it here.
        </Text>
        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
          <TextInput mt={10} placeholder="League token" required {...form.getInputProps("token")} />
          <Center>
            <Button mt={10} type="submit">
              Submit
            </Button>
          </Center>
        </form>
      </Modal>
      <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
        <Card withBorder radius="md">
          <Text fz="sm" c="dimmed" className={classes.label}>
            Join a league
          </Text>
          <div className={classes.imageSection}>
            <Image className={classes.image} src="./18354571.jpg" alt="Join image" />
          </div>
          <Button radius="xl" onClick={open} fullWidth>
            Join now
          </Button>

          <Card.Section className={classes.section} mt="md">
            <Text fz="sm" c="dimmed" className={classes.label}>
              Create a challenge
            </Text>
            <div className={classes.imageSection}>
              <Image
                className={classes.image}
                src="https://learnenglishkids.britishcouncil.org/sites/kids/files/styles/top_level_landing/public/field/section/image/fun_games_tongue.png?itok=pBtq9jrX"
                alt="Create image"
              />
            </div>
            <Button radius="xl" fullWidth onClick={() => router.push(routes.challenge.create.url)}>
              Create
            </Button>
          </Card.Section>
        </Card>
      </Grid.Col>

      {challenges.map((challenge, index) => (
        <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }} key={challenge._id} onClick={() => router.push(`${routes.challenge.url}/${challenge._id}`)}>
          <Card withBorder radius="md" className={classes.card}>
            <Flex justify={"flex-end"}>
              <Badge variant="filled" size="md" color={getStatusInfo(challenge.status).color}>
                {getStatusInfo(challenge.status).name}
              </Badge>
            </Flex>

            <Card.Section className={classes.imageSection}>
              <Image src="https://i.imgur.com/ZL52Q2D.png" alt="Tesla Model S" />
            </Card.Section>

            <Group justify="center" mt="md" align="center">
              <div style={{ textAlign: "center" }}>
                <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                  {challenge.title}
                </Text>
                <Text fz="xs" c="dimmed">
                  {challenge.description}
                </Text>
              </div>
            </Group>
            <Card.Section className={classes.section} mt="md">
              <Text fz="sm" c="dimmed" className={classes.label}>
                Informations
              </Text>

              <Group gap={8} mb={-8}>
                <Center>
                  <IconUsers size="1.05rem" className={classes.icon} stroke={1.5} />
                  <Text size="xs">{challenge.participants.length} Participants</Text>
                </Center>
                <Center>
                  <IconUserCheck size="1.05rem" className={classes.icon} stroke={1.5} />
                  <Text size="xs">{challenge.admins.length} Admins</Text>
                </Center>
                <Center>
                  <IconFlag size="1.05rem" className={classes.icon} stroke={1.5} />
                  <Text size="xs">
                    {challenge.participants.length}/{challenge.participants.length} Place
                  </Text>
                </Center>
              </Group>
            </Card.Section>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}
