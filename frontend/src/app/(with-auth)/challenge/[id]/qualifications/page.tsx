"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Paper, RingProgress } from "@mantine/core";
import { IconDatabaseOff, IconPencil, IconTrash } from "@tabler/icons-react";
import styled from "styled-components";
import SVG from "next/image";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { getSingleChallenge } from "@/services/challenge.service";
import { IconPentagonNumber1, IconPentagonNumber2, IconPentagonNumber3 } from "@tabler/icons-react";

const StyledTableContainer = styled(Table.ScrollContainer)`
  text-align: center;
  th,
  tr {
    text-align: center;
  }
`;

type DataItem = {
  _id: string;
  fullname: string;
  studentId: string;
  email: string;
  avatar: string;
  challengeScores: { challenge: string; score: number }[];
  score: number;
  position: number;
};

const Qualifications = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [state, setState] = useState<{id: string, rows:DataItem[]}>({
    id: id,
    rows: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const GetSingleChallenge = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getSingleChallenge(id);
      
      if (response.status) {

        const sortedParticipants = response.challenge.participants.sort((a: DataItem, b: DataItem) => {
          return b.challengeScores[0].score - a.challengeScores[0].score;
        });

        const mappedParticipants = sortedParticipants.map((participant: DataItem, index: number) => {
          return {
            _id: participant._id,
            fullname: participant.fullname,
            studentId: participant.studentId,
            email: participant.email,
            avatar: participant.avatar,
            score: participant.challengeScores[0].score,
            position: index + 1,
          };
        });
     
        setState((prevState) => ({
          ...prevState,
          rows: mappedParticipants,
        }));
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
      /* notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      router.push(routes.home.url); */
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      GetSingleChallenge(id);
    }
  }, []);

  const createRows = (data: DataItem[]) => {
    return data.map((item: DataItem, index) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.position}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group gap="sm" justify="center">
            <Avatar size={30} src={item.avatar} radius={30} />
            <Text fz="sm" fw={500}>
              {item.fullname}
            </Text>
          </Group>
        </Table.Td>

        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.email}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.studentId ? item.studentId : "-"}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.score}
          </Text>
        </Table.Td>
      </Table.Tr>
    ));
  };

  const rows = createRows(state.rows);

  const dataTop = [
    {
      label: "First place",
      name: state.rows.length >= 1 ? state.rows[0]?.fullname : "---",
      icon: <SVG src="/svgs/medal1.svg" alt="My SVG" width={60} height={60} />,
    },

    {
      label: "Second place",
      name: state.rows.length >= 2 ? state.rows[1]?.fullname : "---",
      icon: <SVG src="/svgs/medal2.svg" alt="My SVG" width={60} height={60} />,
    },

    {
      label: "Third place",
      name: state.rows.length >= 3 ? state.rows[2]?.fullname : "---",
      icon: <SVG src="/svgs/medal3.svg" alt="My SVG" width={60} height={60} />,
    },
  ];

  const stats = dataTop.map((stat) => {
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          {stat.icon}
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.name}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  if (isLoading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <Grid justify="center" align="stretch" mt={10} mb={10} style={{marginBottom:"3rem"}}>

      <title>Qualifications</title>
      <Grid.Col span={{ md: 12, sm: 12, xs: 12, lg: 12 }} ml={{ md: 200, lg: 200, sm: 200 }}>
        <Title order={1}>Qualifications</Title>
      </Grid.Col>

      {stats.map((stat, index) => (
        <Grid.Col span={{ md: 3, sm: 10, xs: 12, lg: 3 }} key={index} ml={{ md: 0, lg: 0, sm: 100 }}>
          {stat}
        </Grid.Col>
      ))}
      <Grid.Col span={{ md: 10.5, sm: 10, xs: 12, lg: 11 }} ml={{ md: 100, lg: 100, sm: 100 }}>
        <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
          <Title order={3}>Positions</Title>
          <StyledTableContainer minWidth={800}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Student Id</Table.Th>
                  <Table.Th>Score</Table.Th>
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
    </Grid>
  );
};

export default Qualifications;
