"use client";
import { redirect, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import { Sidebar } from "@/components/sidebar";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user, isReady } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user?._id && isReady) {
      router.push(routes.landingpage.url)
    }
  }, [isReady])

  if (!user?._id) {
    return <></>;
  }
  
  return (
    <>
      <HeaderMenu />
      <Sidebar />
      <Container size="responsive">{children}</Container>
    </>
  );
}
