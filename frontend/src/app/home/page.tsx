"use client";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Modal, Button, Group, Center, SimpleGrid, Grid, Title, TextInput } from '@mantine/core';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import classes from './home.module.css';
import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';

const mockdata = [
  { label: '4 passengers', icon: IconUsers },
  { label: '100 km/h in 4 seconds', icon: IconGauge },
  { label: 'Automatic gearbox', icon: IconManualGearbox },
  { label: 'Electric', icon: IconGasStation },
];

const features = mockdata.map((feature) => (
  <Center key={feature.label}>
    <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
    <Text size="xs">{feature.label}</Text>
  </Center>
));

type LeagueProps = {
  _id: string;
  name: string,
}[]

export default function Home()
{
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

  const onSubmitHandler = useCallback(async (data: { token: string }) =>
  {
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
      <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
        <Card withBorder radius="md" className={classes.card}>
          <Text fz="sm" c="dimmed" className={classes.label}>
            Join a league
          </Text>
          <div className={classes.imageSection}>
            <Image
              className={classes.image}
              src="./18354571.jpg"
              alt="Join image" />
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
                alt="Create image" />
            </div>
            <Button radius="xl" fullWidth onClick={() => router.push(routes.register.url)}>
              Create
            </Button>
          </Card.Section>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ md: 6, sm: 6, xs: 12, lg: 3 }}>
        <Card withBorder radius="md" className={classes.card}>
          <Card.Section className={classes.imageSection}>
            <Image src="https://i.imgur.com/ZL52Q2D.png" alt="Tesla Model S" />
          </Card.Section>

          <Group justify="space-between" mt="md">
            <div>
              <Text fw={500}>Tesla Model S</Text>
              <Text fz="xs" c="dimmed">
                Free recharge at any station
              </Text>
            </div>
            <Badge variant="outline">25% off</Badge>
          </Group>

          <Card.Section className={classes.section} mt="md">
            <Text fz="sm" c="dimmed" className={classes.label}>
              Basic configuration
            </Text>

            <Group gap={8} mb={-8}>
              {features}
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group gap={30}>
              <div>
                <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                  $168.00
                </Text>
                <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
                  per day
                </Text>
              </div>

              <Button radius="xl" style={{ flex: 1 }}>
                Rent now
              </Button>
            </Group>
          </Card.Section>
        </Card>
      </Grid.Col>

    </Grid>
  );
}
