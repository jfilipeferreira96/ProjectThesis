"use client";
import { MantineProvider, createTheme, Button, Group, localStorageColorSchemeManager  } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';

export const theme = createTheme({
  /* Put your mantine theme override here */
});

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });

const Theme = ({ children }: { children: React.ReactNode }) => {

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      <Notifications position="top-center" zIndex={1000} limit={3} />
      {children}
    </MantineProvider>
  );
};

export default Theme;
