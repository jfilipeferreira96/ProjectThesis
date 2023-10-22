"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container, rem } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import { Sidebar } from "@/components/sidebar";
import styled from "styled-components";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Skeleton } from "@mantine/core";

const regex = /^\/challenge\/[0-9a-f]{24}$/;
const regexQualifications = /^\/challenge\/[0-9a-f]{24}\/qualifications$/;
const regexSettings = /^\/challenge\/[0-9a-f]{24}\/settings$/;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user, isReady } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isChallengePage = regex.test(pathname) || regexQualifications.test(pathname) || regexSettings.test(pathname);
  const [opened, { toggle }] = useDisclosure();
  
  useEffect(() => {
    if (!user?._id && isReady) {
      router.push(routes.landingpage.url)
    }
  }, [isReady])

  if (!user?._id) {
    return <></>;
  }

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: "auto", breakpoint: "sm", collapsed: { mobile: !opened } }}>
      <AppShell.Header>
        <HeaderMenu />
      </AppShell.Header>
      {isChallengePage && (
        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>
      )}
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <Container size="responsive">{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
