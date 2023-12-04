"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import { Sidebar } from "@/components/sidebar";
import styled from "styled-components";

const regex = /^\/challenge\/[0-9a-f]{24}$/; //regex do challenge/:id

const StyledContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--mantine-spacing-md);
  padding-right: var(--mantine-spacing-md);
  width: 100%;
  height: 100%;
`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user, isReady } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isChallengePage = regex.test(pathname);

  useEffect(() => {
    if (!user?._id && isReady) {
      router.push(routes.landingpage.url)
    }
  }, [isReady])

  if (!user?._id) {
    return <></>;
  }

  return (
    <div>
      <HeaderMenu />

      {!isChallengePage && <Container size="responsive">{children}</Container>}
      {isChallengePage && (
        <div style={{ display: "flex" }}>
          <Sidebar isAdmin={false} />
          <StyledContainer>{children}</StyledContainer>
        </div>
      )}
    </div>
  );
}
