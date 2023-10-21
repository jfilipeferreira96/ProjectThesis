"use client";
import React, { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { Card, Image, Text, Badge, Group, Center, Title, Loader, Container, Avatar, Table, ActionIcon, Anchor, rem, Stack, Input, CloseButton, CopyButton, Tooltip, Grid, Tabs, Flex } from "@mantine/core";
import { IconPencil, IconTrash, IconCopy, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { usePathname, useRouter } from "next/navigation";
import { getSingleChallenge } from "@/services/challenge.service";
import ThreeDButton from "@/components/3dbutton";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons-react";
import classes from "./Demo.module.css";
import styled from "styled-components";
import { Sidebar } from "@/components/sidebar";

const StyledTab = styled(Tabs)`

`;

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

const buttons = (pathname: string, isAdmin: boolean) => {
  if (isAdmin) {
    return [
      { name: "Play", path: `${pathname}/random`, color: "blue" },
      { name: "Qualifications", path: `${pathname}/qualifications`, color: "blue" },
      { name: "Settings", path: `${pathname}/settings`, color: "blue" },
    ];
  } else {
    return [
      { name: "Play", path: `${pathname}/random`, color: "blue" }, //agapar
      { name: "Qualifications", path: `${pathname}/qualifications`, color: "blue" },
      { name: "Settings", path: `${pathname}/settings`, color: "blue" },
    ];
  }
};

const ChallengeIdPage = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState({
    id: id,
  });
  const [isLoading, setIsLoading] = useState(false);
    const iconStyle = { width: rem(12), height: rem(12) };

  const GetSingleChallenge = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getSingleChallenge(id);
      if (response.status) {
        console.log(response);
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
        <Group gap={0} justify="flex-end">
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
    <div>
      <Grid justify="center" align="stretch" mt={10} mb={10}>
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
      </Grid>
      <Center mt={200}>
        <Stack align="center" p={10}>
          {buttons(pathname, true).map((button, index) => {
            return (
              <ThreeDButton
                key={index}
                color={button.color}
                onClick={() => {
                  router.push(button.path);
                }}
              >
                {button.name}
              </ThreeDButton>
            );
          })}
        </Stack>
      </Center>
    </div>
  );
};

export default ChallengeIdPage;
