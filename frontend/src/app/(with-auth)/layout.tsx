"use client";
import { redirect, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { routes } from "@/config/routes";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user } = useSession();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "success">("loading");

  useEffect(() => {
    if (user) {
      setState("success");
      return;
    }

    if (!user) {
      router.push(routes.signin.url);

      return;
    }
  }, [user]);

  if (state === "loading") {
    return <></>;
  }
  
  return (
    <>
      <HeaderMenu />
      <Container size="responsive">{children}</Container>
    </>
  );
}
