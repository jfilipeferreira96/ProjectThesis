"use client";
import { Avatar, Group, Button, Box, Burger, useMantineTheme, Image, Title, Flex, rem, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { IconLogout, IconLogout2 } from "@tabler/icons-react";

export const HeaderMenu = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { user, logout } = useSession();

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" ml={10} mr={10}>
          <Flex align={"center"} onClick={() => router.push(user?._id ? routes.home.url : routes.landingpage.url)} style={{ cursor: "pointer" }}>
            <Image src={"./20521.png"} alt="Logo" radius="md" h={45} w="auto" />
            <Title size="h2" ml={10} visibleFrom="xs">
              Score
            </Title>
          </Flex>

          <Group visibleFrom={user?._id ? "sm" : ""}>
            {user?._id ? (
              <>
                <Avatar src={user?.avatar} alt="it's me" />
                <>{user?.fullname}</>
                <Button variant="default" onClick={() => logout()}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href={routes.signin.url}>
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href={routes.register.url}>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </Group>

          {/* DESCOMENTAR SE ALGUMA VEZ QUISER TER UM HAMBURGUER MENU */}
          {/* <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" /> */}

          {user?._id && (
            <ActionIcon size={42} variant="default" onClick={() => logout()} hiddenFrom="sm">
              <IconLogout style={{ width: rem(24), height: rem(24) }} />
            </ActionIcon>
          )}
        </Group>
      </header>
    </Box>
  );
};
