"use client"
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Button, Group, useMantineColorScheme } from "@mantine/core";

export default function Home() {
  const { setColorScheme, clearColorScheme, toggleColorScheme } = useMantineColorScheme();
   
  return (
    <>
      <h1>Landing Page</h1>
    </>
  );
}
