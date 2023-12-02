"use client";
import AffixComponent from "@/components/affix";
import { CarouselSection } from "@/components/landing-page/sections/carousel";
import { FaqSimple } from "@/components/landing-page/sections/faq";
import { FeaturesCards } from "@/components/landing-page/sections/feature-cards";
import Footer from "@/components/landing-page/sections/footer";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Hero } from "@/components/landing-page/sections/hero";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { Affix, Button, Group, useMantineColorScheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { setColorScheme, clearColorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user, isReady } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(routes.home.url);
      return;
    }
  }, [user]);

  return (
    <>
      <title>Project Score</title>
      <AffixComponent />
      <Hero />
      <FeaturesCards />
      {/* <CarouselSection /> */}
      <FaqSimple />
      <Footer />
    </>
  );
}
