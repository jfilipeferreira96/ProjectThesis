"use client"
import { FaqSimple } from "@/components/landing-page/sections/faq";
import Footer from "@/components/landing-page/sections/footer";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Button, Group, useMantineColorScheme } from "@mantine/core";

export default function Home() {
  const { setColorScheme, clearColorScheme, toggleColorScheme } = useMantineColorScheme();
   
  return (
    <>
      <FaqSimple />
      <Footer />
    </>
  );
}
