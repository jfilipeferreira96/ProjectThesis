"use client"
import AffixComponent from "@/components/affix";
import { FaqSimple } from "@/components/landing-page/sections/faq";
import Footer from "@/components/landing-page/sections/footer";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Affix, Button, Group, useMantineColorScheme } from "@mantine/core";

export default function Home() {
  const { setColorScheme, clearColorScheme, toggleColorScheme } = useMantineColorScheme();
   
  return (
    <>
      <AffixComponent />
      <FaqSimple />
      <Footer />
    </>
  );
}
