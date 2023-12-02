"use client";
import React, { useEffect, useState } from "react";
import classes from "./settings.module.css";
import { routes } from "@/config/routes";
import {
  Card,
  Image,
  Text,
  Badge,
  Modal,
  Button,
  Group,
  Center,
  SimpleGrid,
  Grid,
  Title,
  TextInput,
  Flex,
  Loader,
  Container,
  Avatar,
  Table,
  ActionIcon,
  Anchor,
  rem,
  Stack,
  Paper,
  Tooltip,
  Switch,
  Radio,
  List,
  CheckIcon,
} from "@mantine/core";
import { IconPencil, IconTrash, IconPlayerPlay, IconPlayerStopFilled, IconFileDatabase, IconDatabaseOff } from "@tabler/icons-react";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { ChallengeType, getAllChallengeQuizzes } from "@/services/challenge.service";
import { QuizzStatus, getQuizzStatusInfo, deleteQuizz, editQuizzStatus } from "@/services/quizz.service";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";

type DataItem = {
  _id: string;
  name: string;
  questions: string[];
  status: number;
  startDate: string;
  endDate: string;
};

const StyledTableContainer = styled(Table.ScrollContainer)`
  text-align: center;
  th,
  tr {
    text-align: center;
  }
`;

const StyledList = styled(List)`
  color: var(--mantine-color-dimmed);
`;

const teste = [
  { title: "Messages", description: "Direct messages you have received from other users" },
  { title: "Review requests", description: "Code review requests from your team members" },
  { title: "Comments", description: "Daily digest with comments on your posts" },
  {
    title: "Recommendations",
    description: "Digest with best community posts from previous week",
  },
];

const Settings = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [state, setState] = useState({
    id: id,
    rows: [],
    type: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isTypeABlockAcess = state.type === "Type A" && state.rows.length === 1 ? true : false;
  const isScreenXL = useMediaQuery("(min-width: 1200px)");

  const GetAllChallengeQuizzes = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getAllChallengeQuizzes(id);
      if (response.status) {
        console.log(response)
        setState((prevState) => ({ ...prevState, rows: response.quizzes, type: response.type }));
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

  const DeleteQuizz = async (quizId: string) => {
    try {
      const response = await deleteQuizz(quizId);
      if (response.status) {
        notifications.show({
          title: "Quizz was sucessfully deleted",
          message: "",
          color: "green",
        });
        GetAllChallengeQuizzes(id);
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
  };

  const EditQuizzStatus = async (quizId: string, state: QuizzStatus) => {
    try {
      const response = await editQuizzStatus(quizId, state);
      if (response.status) {
        notifications.show({
          title: "Success",
          message: "",
          color: "green",
        });
        GetAllChallengeQuizzes(id);
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
    }
  };

  useEffect(() => {
    if (id) {
      //brings settings and admins

      //brings the challenge quizzes
      GetAllChallengeQuizzes(id);
    }
  }, []);

  if (isLoading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  const createRows = (data: DataItem[]) => {
    return data.map((item: DataItem) => (
      <Table.Tr key={item.name}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>

        <Table.Td>{item.questions.length}</Table.Td>

        <Table.Td>
          <Text fz="sm">{item.startDate ? dayjs(item.startDate).format("YYYY-MM-DD HH:mm:ss") : "-"}</Text>
        </Table.Td>

        <Table.Td>
          <Text fz="sm">{item.endDate ? dayjs(item.endDate).format("YYYY-MM-DD HH:mm:ss") : "-"}</Text>
        </Table.Td>

        <Table.Td>
          <Badge variant="filled" size="md" color={getQuizzStatusInfo(item.status).color} style={{ minWidth: "110px" }}>
            {getQuizzStatusInfo(item.status).name}
          </Badge>
        </Table.Td>

        <Table.Td>
          <Group gap={0} justify="center">
            {item.status === QuizzStatus.PendingStart && (
              <Tooltip label={"Start quizz"} withArrow position="top">
                <ActionIcon variant="subtle" color="green" onClick={() => EditQuizzStatus(item._id, QuizzStatus.InProgress)}>
                  <IconPlayerPlay style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
            {item.status === QuizzStatus.InProgress && (
              <Tooltip label={"Close quizz"} withArrow position="top">
                <ActionIcon variant="subtle" color="orange" onClick={() => EditQuizzStatus(item._id, QuizzStatus.Completed)}>
                  <IconPlayerStopFilled style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
            {item.status !== QuizzStatus.Completed && (
              <Tooltip label={"Edit quizz"} withArrow position="top">
                <ActionIcon variant="subtle" color="blue" onClick={() => router.push(`${routes.challenge.url}/${id}/edit/${item._id}`)}>
                  <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
            {item.status !== QuizzStatus.Completed && (
              <Tooltip label={"Delete quizz"} withArrow position="top">
                <ActionIcon variant="subtle" color="red" onClick={() => DeleteQuizz(item._id)}>
                  <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  };

  const rows = createRows(state.rows);

  const items = teste.map((item) => (
    <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl" key={item.title}>
      <div>
        <Text>{item.title}</Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
      <Switch onLabel="ON" offLabel="OFF" className={classes.switch} size="lg" />
    </Group>
  ));

  return (
    <Grid justify="center" align="stretch" mb={10}>
      <title>Settings</title>

      <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 12 }} ml={{ md: 200, lg: 200, sm: 200 }}>
        <Title order={1}>Settings</Title>
        <Flex display={isScreenXL ? "flex" : "block"}>
          <Grid.Col span={{ md: 10.5, sm: 10, xs: 12, lg: 4.5 }} style={{ display: "flex", flexDirection: "column" }}>
            <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
              <Title order={3}>Configurations</Title>

              {/* <Text fz="xs" c="dimmed" mt={3} mb="xl">
              Choose what notifications you want to receive
            </Text>
            {items} */}
              <Radio.Group name="type" label="Change the challenge type" withAsterisk mt="md" defaultValue={state.type}>
                <StyledList spacing="xs" size="xs" center icon={<></>}>
                  <List.Item>Type A - Fast paced challenge and short duration, perfect for a single dynamic class.</List.Item>
                  <List.Item>Type B - A league-based challenge comprised of one or multiple challenges.</List.Item>
                </StyledList>

                <Group mt="xs" align="center" justify="center">
                  <Radio value={ChallengeType.TYPE_A} label={ChallengeType.TYPE_A} checked icon={CheckIcon} mt="md" />
                  <Radio value={ChallengeType.TYPE_B} label={ChallengeType.TYPE_B} icon={CheckIcon} mt="md" />
                </Group>
              </Radio.Group>

              <Flex justify="end" mt="lg">
                <Button size="md" variant="filled" onClick={() => console.log("update")}>
                  Update
                </Button>
              </Flex>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ md: 10.5, sm: 10, xs: 12, lg: 4.5 }} style={{ display: "flex", flexDirection: "column" }}>
            <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
              <Title order={3}>Admins</Title>
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>

                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  {/* {rows.length > 0 && <Table.Tbody>{rows}</Table.Tbody>} */}
                </Table>
              <Flex justify="end" mt="lg">
                <Button size="md" variant="filled" onClick={() => console.log("update")}>
                  Add admin
                </Button>
              </Flex>
            </Paper>
          </Grid.Col>
        </Flex>
        <Grid.Col span={{ md: 10.5, sm: 10, xs: 12, lg: 11 }}>
          <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
            <Flex justify={"flex-end"}>
              {isTypeABlockAcess ? (
                <Tooltip label={"Type A challenge cannot contain multiple challenges."} withArrow>
                  <Button size="lg" variant="filled" disabled={true} onClick={() => router.push(`${routes.challenge.url}/${id}/add`)}>
                    Add Quizz
                  </Button>
                </Tooltip>
              ) : (
                <Button size="lg" variant="filled" onClick={() => router.push(`${routes.challenge.url}/${id}/add`)}>
                  Add Quizz
                </Button>
              )}
            </Flex>
            <Title order={3}>Quizzes</Title>
            <StyledTableContainer minWidth={800}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>No. Questions</Table.Th>
                    <Table.Th>Start Date</Table.Th>
                    <Table.Th>End Date</Table.Th>
                    <Table.Th>State</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {rows.length > 0 && <Table.Tbody>{rows}</Table.Tbody>}
              </Table>

              {rows.length === 0 && (
                <Flex justify={"center"} mt="xl" display="block">
                  <ActionIcon size="xl" disabled aria-label="No records found">
                    <IconDatabaseOff />
                  </ActionIcon>
                  <Text c="dimmed" size="sm" ta="center" mt={5}>
                    {"No records found"}
                  </Text>
                </Flex>
              )}
            </StyledTableContainer>
          </Paper>
        </Grid.Col>
      </Grid.Col>
    </Grid>
  );
};

export default Settings;
