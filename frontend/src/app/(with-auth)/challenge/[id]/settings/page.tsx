"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Paper, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash, IconPlayerPlay, IconPlayerStop, IconPlayerStopFilled } from "@tabler/icons-react";
import styled from "styled-components";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { getAllChallengeQuizzes } from "@/services/challenge.service";
import { QuizzStatus, getQuizzStatusInfo, deleteQuizz, editQuizzState } from "@/services/quizz.service";
import dayjs from "dayjs";

type DataItem = {
  _id: string;
  name: string;
  questions: string[];
  status: number;
  startDate: string;
  endDate: string;
};

const StyledTableContainer = styled(Table.ScrollContainer)`
  @media (min-width: 1200px) {
   width: 92%;
  }
  text-align: center;
  th,
  tr {
    text-align: center;
  }
`;

const Settings = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [state, setState] = useState({
    id: id,
    rows: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const GetAllChallengeQuizzes = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getAllChallengeQuizzes(id);
      if (response.status) {
        setState((prevState) => ({ ...prevState, rows: response.quizzes }));
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
  }

  const EditQuizzState = async (quizId: string, state:QuizzStatus) => {
    try {
      const response = await editQuizzState(quizId, state);
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
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (id) {
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
                <ActionIcon variant="subtle" color="green" onClick={() => EditQuizzState(item._id, QuizzStatus.InProgress)}>
                  <IconPlayerPlay style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
            {item.status === QuizzStatus.InProgress && (
              <Tooltip label={"Close quizz"} withArrow position="top">
                <ActionIcon variant="subtle" color="orange" onClick={() => EditQuizzState(item._id, QuizzStatus.Completed)}>
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
            <Tooltip label={"Delete quizz"} withArrow position="top">
              <ActionIcon variant="subtle" color="red" onClick={() => DeleteQuizz(item._id)}>
                <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  };

  const rows = createRows(state.rows);
  
  return (
    <Grid justify="center" align="stretch" mb={10}>
      <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 12 }} ml={{ md: 200, lg: 200, sm: 200 }}>
        <Flex justify={"flex-end"} mr={{ xl: 110, md: 110, sm: 110 }}>
          <Button size="lg" variant="filled" onClick={() => router.push(`${routes.challenge.url}/${id}/add`)}>
            Add Quizz
          </Button>
        </Flex>

        <Title order={1}>Settings</Title>

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
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </StyledTableContainer>
      </Grid.Col>
    </Grid>
  );
};

export default Settings;
