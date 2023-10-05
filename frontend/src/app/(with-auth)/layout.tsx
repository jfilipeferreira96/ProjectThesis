"use client";
import { redirect, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user } = useSession();

  if (!user?._id) {
    return <></>;
  }
  
  return (
    <>
      <HeaderMenu />
      <Container size="responsive">{children}</Container>
    </>
  );
}
