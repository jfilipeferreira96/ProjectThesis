"use client";
import { HoverCard, Group, Button, UnstyledButton, Text, SimpleGrid, ThemeIcon, Anchor, Divider, Center, Box, Burger, Drawer, Collapse, ScrollArea, rem, useMantineTheme, Container, Image, Title, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

export const HeaderMenu = () =>
{
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { user, logout } = useSession();

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" ml={10} mr={10}>
          <Flex align={"center"} onClick={() => router.push(user?._id ? routes.home.url : routes.landingpage.url)} style={{ cursor: "pointer" }}>
            <Image src={"./logo.png"} alt="My image" radius="md" h={40} w="auto" />
            <Title size="h2" ml={10}>
              Score
            </Title>
          </Flex>

          <Group visibleFrom="sm">
            {user?._id ? <Button variant="default" onClick={() => logout()}>Log out</Button>
              :
              <>
                <Link href={routes.signin.url}>
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href={routes.register.url}>
                  <Button>Sign up</Button>
                </Link>
              </>
            }
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>
    </Box>
  );
};
