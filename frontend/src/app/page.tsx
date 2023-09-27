"use client"
import { HeaderMenu } from "@/components/LandingPage/Sections/header";
import { Button, Group, useMantineColorScheme } from "@mantine/core";

export default function Home() {
  const { setColorScheme, clearColorScheme, toggleColorScheme } = useMantineColorScheme();
   
  return (
    <>
      <HeaderMenu />
    </>
  );
}
