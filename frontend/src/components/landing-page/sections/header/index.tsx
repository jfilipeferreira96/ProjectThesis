"use client";
import { Avatar, Group, Button, Box, Burger, useMantineTheme, Title, Flex, rem, ActionIcon, Menu, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import Image from "next/image"; 
import { ToogleColorTheme } from "@/components/toogle-color";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import cx from "clsx";

export const HeaderMenu = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { user, logout } = useSession();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  
  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" ml={10} mr={10}>
          <Flex align={"center"} onClick={() => router.push(user?._id ? routes.home.url : routes.landingpage.url)} style={{ cursor: "pointer" }}>
            <Image src="/20521.png" alt="Logo" width={85} height={45} />
            {/* <Title size="h2" ml={10} visibleFrom="xs" className={classes.logo}>
              Score
            </Title> */}
          </Flex>

          <Group visibleFrom={user?._id ? "sm" : ""}>
            {user?._id ? (
              <>
                <Menu width={260} position="bottom-end" transitionProps={{ transition: "pop-top-right" }} onClose={() => setUserMenuOpened(false)} onOpen={() => setUserMenuOpened(true)} withinPortal>
                  <Menu.Target>
                    <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                      <Group gap={7}>
                        <Avatar src={user?.avatar} alt="it's me" radius={"xl"} />
                        <Text fw={500} size="sm" lh={1} mr={3}>
                          {user?.fullname}
                        </Text>
                        <IconChevronDown style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onClick={() => router.push(routes.account.url )}>
                      Account settings
                    </Menu.Item>
                    <Menu.Item leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} onClick={() => logout()}>
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <>
                <ToogleColorTheme />
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
