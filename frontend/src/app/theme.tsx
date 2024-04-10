"use client";
import { MantineProvider, createTheme, Button, Group, localStorageColorSchemeManager } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { SessionProvider } from "@/providers/SessionProvider";
import "./global.css";


export const theme = createTheme({
  /* Put your mantine theme override here */
  fontFamily: "DIN Round Pro, sans-serif",
  fontFamilyMonospace: 'DIN Round Pro, sans-serif',
  headings: {
    fontFamily: "Feather Bold, sans-serif",
  },
});

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });

const Theme = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      <SessionProvider>
        <Notifications position="top-center" zIndex={1000} limit={3} />
          {children}
      </SessionProvider>
    </MantineProvider>
  );
};

export default Theme;
