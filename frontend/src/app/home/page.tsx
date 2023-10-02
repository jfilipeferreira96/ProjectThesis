"use client";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput } from '@mantine/core';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

type LeagueProps = {
  _id: string;
  name: string,
}[]

export default function Home(){
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [leagues, setLeagues] = useState<LeagueProps>([])

  /* TODO */
  //  useEffect com async function getLeagues/getChallenges
  // async function join league
  // join -> refresh leagues
  // card join league/create league
  // leagues.map

  const form = useForm({
    initialValues: {
      token: "",
    },
    validate: {
      token: (value) => (value.length >= 4 ? null : "Password must be at least 4 characters long"),
    },
  });

  const onSubmitHandler = useCallback(async (data:{token:string}) =>{
    console.log(data)
    try
    {
      //const response = await register(token);
      //console.log("Register bem-sucedido:", response);
      notifications.show({
        title: "Success",
        message: "Leave the building immediately",
        color: "green",
      });

      // chamada da funçao fetchLeagues
    }
    catch (error)
    {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

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
            <Button mt={10} type="submit">Submit</Button>
          </Center>
        </form>
      </Modal>

      <Button onClick={open}>Open modal</Button>

      <Grid.Col span={{ md: 6, sm: 6, xs:12, lg: 3 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Norway Fjord Adventures</Text>
            <Badge color="pink" variant="light">
              On Sale
            </Badge>
          </Group>

          <Text size="sm" c="dimmed">
            With Fjord Tours you can explore more of the magical fjord landscapes with tours and
            activities on and around the fjords of Norway
          </Text>

          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ md: 6, sm: 6, xs:12, lg: 3 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Norway Fjord Adventures</Text>
            <Badge color="pink" variant="light">
              On Sale
            </Badge>
          </Group>

          <Text size="sm" c="dimmed">
            With Fjord Tours you can explore more of the magical fjord landscapes with tours and
            activities on and around the fjords of Norway
          </Text>

          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
