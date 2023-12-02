"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Group, Center, Title, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Input, CloseButton, CopyButton, Tooltip, Grid, Tabs, Flex } from "@mantine/core";
import { IconPencil, IconTrash, IconCopy, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { usePathname, useRouter } from "next/navigation";
import { getSingleChallenge, getStatusInfo } from "@/services/challenge.service";
import ThreeDButton from "@/components/3dbutton";
import { useSession } from "@/providers/SessionProvider";

const ChallengeIdPage = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({
    id: id,
    title: "",
    description: "",
    type: "",
    admins: [] as string[],
    participants: [],
    status: 0,
    activeQuizz: {
      id: null,
      completed: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSession();
  const userIsAdmin = user ? state.admins.includes(user?._id) : false;
  const activeAndCompleted = state.activeQuizz?.id && state.activeQuizz?.completed;
  const activeAndNotCompleted = state.activeQuizz?.id && !state.activeQuizz?.completed;
  const noActiveQuizz = !state.activeQuizz?.id;

  
  const GetSingleChallenge = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getSingleChallenge(id);
      if (response.status) {
        console.log(response)
        setState(response.challenge);
      }
      if (response.status === false) {
        notifications.show({
          title: "Oops",
          message: response.message,
          color: "red",
        });
        router.push(routes.home.url);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      router.push(routes.home.url);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      GetSingleChallenge(id);
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
    <>
      <Grid justify="center" align="stretch" mt={10} mb={10}>
        <title>Challenge</title>
        <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 12 }} ml={{ md: 200, lg: 200, sm: 200 }}>
          <Title order={1}>{state.title}</Title>

          {state.description && <Text c="dimmed">{state.description}</Text>}
        </Grid.Col>

        {userIsAdmin && (
          <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
            <Card withBorder radius="md">
              <Title ta="center" size={"h3"}>
                Unleash the Power!
              </Title>

              <Text c="dimmed" size="md" ta="center" mt={5}>
                Share this enchanted token with fellow players.
              </Text>

              <Input
                placeholder="Clearable input"
                defaultValue={id}
                rightSectionPointerEvents="all"
                mt="md"
                size="md"
                rightSection={
                  <CopyButton value={id} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                        <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                          {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                }
              />
            </Card>
          </Grid.Col>
        )}
        {!userIsAdmin && (
          <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
            <Card withBorder radius="md">
              <Title ta="center" size={"h3"}>
                {activeAndNotCompleted ? "Game Time! Are You Set?" : activeAndCompleted ? "You Already Completed This Challenge" : "No Active Challenges at the Moment"}
              </Title>

              <Text c="dimmed" size="md" ta="center" mt="sm" mb="sm">
                {activeAndNotCompleted ? "Get Ready to Dive In!" : activeAndCompleted ? "Congratulations! Challenge Conquered! " : "Hold Tight for More Action!"}
              </Text>

              {activeAndNotCompleted ? (
                <ThreeDButton
                  color="blue"
                  onClick={() => {
                    if (state.activeQuizz?.id) {
                      router.push(`${routes.challenge.url}/${id}/play/${state.activeQuizz?.id}`);
                    }
                  }}
                  disabled={state.activeQuizz?.completed === false ? false : true}
                >
                  Play
                </ThreeDButton>
              ) : activeAndCompleted ? (
                <Flex align={"center"}>
                  <Image src="/completed.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto", width: "60%" }} />
                </Flex>
              ) : (
                <Flex align={"center"}>
                  <Image src="/waiting.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto", width: "60%" }} />
                </Flex>
              )}
            </Card>
          </Grid.Col>
        )}
      </Grid>
    </>
  );
};

export default ChallengeIdPage;
