"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Paper } from "@mantine/core";
import { IconPencil, IconTrash, IconPlayerPlay, IconPlayerStop, IconPlayerStopFilled } from "@tabler/icons-react";
import styled from "styled-components";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { getAllChallengeQuizzes } from "@/services/challenge.service";
import { getQuizzStatusInfo } from "@/services/quizz.service";

const data = [
  {
    name: "Robert Wolfkisser",
    number: 4,
    status: 0,
    startdate: "--",
    enddate: "--",
  },
  {
    name: "Jill Jailbreaker",
    number: 5,
    status: 1,
    startdate: "--",
    enddate: "--",
  },
  {
    name: "Henry Silkeater",
    number: 3,
    status: 2,
    startdate: "--",
    enddate: "--",
  },
  {
    name: "Bill Horsefighter",
    number: 0,
    status: 0,
    startdate: "--",
    enddate: "--",
  },
  {
    name: "Jeremy Footviewer",
    number: 1,
    status: 1,
    startdate: "--",
    enddate: "--",
  },
];

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
  });
  const [isLoading, setIsLoading] = useState(false);

  const GetAllChallengeQuizzes = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getAllChallengeQuizzes(id);
      console.log(response)
      if (response.status) {
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

  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.name}
        </Text>
      </Table.Td>

      <Table.Td>{item.number}</Table.Td>

      <Table.Td>
        <Text fz="sm">{item.startdate}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.enddate}</Text>
      </Table.Td>

      <Table.Td>
        <Badge variant="filled" size="md" color={getQuizzStatusInfo(item.status).color} style={{ minWidth: "110px" }}>
          {getQuizzStatusInfo(item.status).name}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="center">
          <ActionIcon variant="subtle" color="green">
            <IconPlayerPlay style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="orange">
            <IconPlayerStopFilled style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="blue">
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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
