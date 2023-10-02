"use client";
import { MantineProvider, createTheme, Button, Group, localStorageColorSchemeManager  } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { HeaderMenu } from "@/components/landing-page/sections/header";

export const theme = createTheme({
  /* Put your mantine theme override here */
 //  type DefaultMantineColor = 'dark' | 'gray' | 'red' | 'pink' | 'grape' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'green' | 'lime' | 'yellow' | 'orange' | 'teal' | (string & {});
/*   primaryShade: { light: 6, dark: 4 } ,
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan", */
});

const colorSchemeManager = localStorageColorSchemeManager({ key: "color-scheme" });

const Theme = ({ children }: { children: React.ReactNode }) => {

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      <Notifications position="top-center" zIndex={1000} limit={3} />
      <HeaderMenu />
      {children}
    </MantineProvider>
  );
};

export default Theme;
