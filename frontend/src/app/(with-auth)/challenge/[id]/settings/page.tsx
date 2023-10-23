"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput, Flex, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Paper } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import styled from "styled-components";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { getAllChallengeQuizzes } from "@/services/challenge.service";

const data = [
  {
    avatar: "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Robert Wolfkisser",
    job: "Engineer",
    email: "rob_wolf@gmail.com",
    phone: "+44 (452) 886 09 12",
  },
  {
    avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Jill Jailbreaker",
    job: "Engineer",
    email: "jj@breaker.com",
    phone: "+44 (934) 777 12 76",
  },
  {
    avatar: "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Henry Silkeater",
    job: "Designer",
    email: "henry@silkeater.io",
    phone: "+44 (901) 384 88 34",
  },
  {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Bill Horsefighter",
    job: "Designer",
    email: "bhorsefighter@gmail.com",
    phone: "+44 (667) 341 45 22",
  },
  {
    avatar: "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    name: "Jeremy Footviewer",
    job: "Manager",
    email: "jeremy@foot.dev",
    phone: "+44 (881) 245 65 65",
  },
];

const jobColors: Record<string, string> = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

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
        <Group gap="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={jobColors[item.job.toLowerCase()]} variant="light">
          {item.job}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {item.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phone}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end" >
          <ActionIcon variant="subtle" color="gray">
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
        <Flex justify={"flex-end"} mr={{ xl: 110, md: 110,  sm: 110 }}>
          <Button size="lg" variant="filled" onClick={() => router.push(`${routes.challenge.url}/${id}/add`)}>
            Add Quizz
          </Button>
        </Flex>
      
        <Title order={1}>Settings</Title>

        <Table.ScrollContainer minWidth={800} /* style={{width:"93%"}} */>
         {/*  <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed"> */}

          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Job title</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Grid.Col>
    </Grid>
  );
};

export default Settings;
