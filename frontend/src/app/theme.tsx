"use client";
import { MantineProvider, createTheme, Button, Group, localStorageColorSchemeManager } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { SessionProvider } from "@/providers/SessionProvider";
import "./global.scss";


export const theme = createTheme({
  /* Put your mantine theme override here */
  fontFamily: "DIN Round Pro, sans-serif",
  fontFamilyMonospace: 'DIN Round Pro, sans-serif',
  headings: {
    fontFamily: "Feather Bold, sans-serif",
  },
  fontSizes: {
    xs: "0.875rem",
    sm: "1rem ",
    md: "1.125rem",
    lg: "1.25rem",
    xl: "1.35rem"
  }
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
