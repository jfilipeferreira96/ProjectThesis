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
import { ChallengeStatus, ChallengeType, getChallenges, getStatusInfo, joinChallenge } from "@/services/challenge.service";
import { UserType } from "@/services/auth.service";
import { useSession } from "@/providers/SessionProvider";
import { GiggleCard } from "@/components/card";
import ThreeDButton from "@/components/3dbutton";

type ChallengeProps = {
  _id: string;
  title: string;
  description: string;
  type: ChallengeType;
  admins: string[];
  participants: string[];
  status: ChallengeStatus;
  user_type?: "Admin" | "User";
}[];

export default function Home() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [challenges, setChallenges] = useState<ChallengeProps>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHiddenChallenges, setShowHiddenChallenges] = useState(false);
  const { user } = useSession();
 
  const GetUserChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await getChallenges();
      if (response) {
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

  const form = useForm({
    initialValues: {
      token: "",
    },
    validate: {
      token: (value) => (value.length >= 20 ? null : "Invalid token"),
    },
  });

  const onSubmitHandler = useCallback(async (data: { token: string }) => {
    try {
      const response = await joinChallenge(data.token);
      if (response.status) {
        notifications.show({
          title: "Success",
          message: "",
          color: "green",
        });

        //redirect to the leagues page
        router.push(`${routes.challenge.url}/${response.challenge._id}`);
      }
      if (response.status === false) {
        notifications.show({
          title: "Oops",
          message: response.message,
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

  // Filtra os desafios ativos
  const activeChallenges = challenges.filter((challenge) => ![ChallengeStatus.Deleted, ChallengeStatus.Completed].includes(challenge.status));

  // Filtra os desafios com estado ChallengeStatus.Deleted e ChallengeStatus.Completed
  const hiddenChallenges = challenges.filter((challenge) => [ChallengeStatus.Deleted, ChallengeStatus.Completed].includes(challenge.status));

  if (isLoading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <>
      <Grid justify="center" align="stretch" mt={10} mb={10} pb={10}>
        <title>Home</title>
        <Modal
          opened={opened}
          onClose={close}
          title=""
          size="md"
          overlayProps={{
            backgroundOpacity: 0.8,
          }}
        >
          <Title ta="center">JOIN A CHALLENGE</Title>

          <Text c="dimmed" size="md" ta="center" mt={5}>
            Do you hold the token for challenge access?
            <br />
            Great! Paste it here.
          </Text>
          <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
            <TextInput mt={10} placeholder="Challenge token" required {...form.getInputProps("token")} />
            <Center>
              <ThreeDButton color="blue" smaller mt="sm" type="submit" animationOnHover={false}>
                Submit
              </ThreeDButton>
            </Center>
          </form>
        </Modal>

        <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
          <GiggleCard>
            {(user.type === UserType.STUDENT || user.type === UserType.ADMIN) && (
              <div onClick={open} className={classes.pointer}>
                <Text fz="sm" c="dimmed" className={classes.label}>
                  Join a challenge
                </Text>
                <div className={classes.imageSection}>
                  <Image className={user.type === UserType.STUDENT ? classes.fullimage : classes.image} src="./37541671.png" alt="Join image" />
                </div>
              </div>
            )}

            {(user.type === UserType.TEACHER || user.type === UserType.ADMIN) && (
              <Card.Section className={`${classes.section} ${user.type === UserType.ADMIN ? classes.bordertop : ""}`} mt="md" onClick={() => router.push(routes.challenge.create.url)}>
                <Text fz="sm" c="dimmed" className={classes.label}>
                  Create a challenge
                </Text>
                <div className={classes.imageSection}>
                  <Image className={user.type === UserType.TEACHER ? classes.fullimage : classes.image} src="./5000_4_07.png" alt="Create image" />
                </div>
              </Card.Section>
            )}
          </GiggleCard>
        </Grid.Col>

        {/* Renderiza os desafios ativos */}
        {activeChallenges.map((challenge, index) => (
          <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }} key={challenge._id}>
            <GiggleCard onClick={() => router.push(`${routes.challenge.url}/${challenge._id}`)}>
              <Flex justify={"flex-end"}>
                <Badge variant="filled" size="md" color={getStatusInfo(challenge.status).color}>
                  {getStatusInfo(challenge.status).name}
                </Badge>
              </Flex>

              <Card.Section className={classes.imageSection}>
                <Image className={classes.challengeImage} src={challenge.type === ChallengeType.TYPE_EXPRESS ? "./type1.png" : "./type2.png"} alt="Challenge Type" />
              </Card.Section>

              <Group justify="center" mt="md" align="center">
                <div style={{ textAlign: "center" }}>
                  <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                    {challenge.title}
                  </Text>
                  <Text fz="xs" c="dimmed" mt={challenge.description ? "" : 20}>
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
                  {/* {challenge.user_type !== "Admin" && (
                    <Center>
                      <IconFlag size="1.05rem" className={classes.icon} stroke={1.5} />
                      <Text size="xs">
                        {challenge.participants.length}/{challenge.participants.length} Place
                      </Text>
                    </Center>
                  )} */}
                </Group>
              </Card.Section>
            </GiggleCard>
          </Grid.Col>
        ))}

        {/* Renderiza os desafios escondidos, se o botão for clicado */}
        {showHiddenChallenges &&
          hiddenChallenges.length > 0 &&
          hiddenChallenges.map((challenge, index) => (
            <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }} key={challenge._id}>
              <GiggleCard onClick={() => router.push(`${routes.challenge.url}/${challenge._id}`)}>
                <Flex justify={"flex-end"}>
                  <Badge variant="filled" size="md" color={getStatusInfo(challenge.status).color}>
                    {getStatusInfo(challenge.status).name}
                  </Badge>
                </Flex>

                <Card.Section className={classes.imageSection}>
                  <Image className={classes.challengeImage} src={challenge.type === ChallengeType.TYPE_EXPRESS ? "./type1.png" : "./type2.png"} alt="Challenge Type" />
                </Card.Section>

                <Group justify="center" mt="md" align="center">
                  <div style={{ textAlign: "center" }}>
                    <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                      {challenge.title}
                    </Text>
                    <Text fz="xs" c="dimmed" mt={challenge.description ? "" : 20}>
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
                    {challenge.user_type !== "Admin" && (
                      <Center>
                        <IconFlag size="1.05rem" className={classes.icon} stroke={1.5} />
                        <Text size="xs">
                          {challenge.participants.length}/{challenge.participants.length} Place
                        </Text>
                      </Center>
                    )}
                  </Group>
                </Card.Section>
              </GiggleCard>
            </Grid.Col>
          ))}
      </Grid>
      {/* Botão para mostrar desafios escondidos */}
      {!showHiddenChallenges && hiddenChallenges.length > 0 && (
        <Center mt={20}>
          <ThreeDButton color="blue" onClick={() => setShowHiddenChallenges(true)}>
            Show Hidden Challenges
          </ThreeDButton>
        </Center>
      )}
    </>
  );
}
