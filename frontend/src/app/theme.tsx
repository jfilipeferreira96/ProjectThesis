"use client";
import { MantineProvider, createTheme, Button, Group, localStorageColorSchemeManager, Container  } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { HeaderMenu } from "@/components/landing-page/sections/header";

export const theme = createTheme({
  /* Put your mantine theme override here */
});

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });

const Theme = ({ children }: { children: React.ReactNode }) => {

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      <Notifications position="top-center" zIndex={1000} limit={3} />
      <HeaderMenu />
      <Container size="responsive">
        {children}
      </Container>
    </MantineProvider>
  );
};

export default Theme;
