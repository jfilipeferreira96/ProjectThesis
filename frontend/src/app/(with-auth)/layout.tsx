"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container, rem } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import { Sidebar } from "@/components/sidebar";
import styled from "styled-components";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { AppShell, Burger, Group, Skeleton } from "@mantine/core";

const regex = /^\/challenge\/[0-9a-f]{24}$/;
const regexQualifications = /^\/challenge\/[0-9a-f]{24}\/qualifications$/;
const regexSettings = /^\/challenge\/[0-9a-f]{24}\/settings$/;

function getIdFromUrl(url:string): string | undefined {
  const regex = /\/challenge\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return undefined;
  }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user, isReady } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isChallengePage = regex.test(pathname) || regexQualifications.test(pathname) || regexSettings.test(pathname);
  const [opened, { toggle }] = useDisclosure();
  const challengeId = getIdFromUrl(pathname);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      {isChallengePage && !isMobile && (
        <AppShell.Navbar>
          <Sidebar isAdmin={(challengeId !== undefined && user.adminChallenges?.includes(challengeId)) ?? false} />
        </AppShell.Navbar>
      )}
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <Container size="responsive">{children}</Container>
        {isMobile && isChallengePage && <Sidebar isAdmin={(challengeId !== undefined && user.adminChallenges?.includes(challengeId)) ?? false} />}
      </AppShell.Main>
    </AppShell>
  );
}
