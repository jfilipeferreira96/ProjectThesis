"use client";
import { HoverCard, Group, Button, UnstyledButton, Text, SimpleGrid, ThemeIcon, Anchor, Divider, Center, Box, Burger, Drawer, Collapse, ScrollArea, rem, useMantineTheme, Container } from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";

export const HeaderMenu = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" ml={10} mr={10}>
          <MantineLogo size={30} onClick={() => router.push(routes.landingpage.url)} />

          <Group visibleFrom="sm">
            <Link href={routes.signin.url}>
              <Button variant="default">Log in</Button>
            </Link>
            <Link href={routes.register.url}>
              <Button>Sign up</Button>
            </Link>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>
    </Box>
  );
};
