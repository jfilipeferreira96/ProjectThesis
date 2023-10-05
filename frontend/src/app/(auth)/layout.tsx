import { redirect } from 'next/navigation'
import { HeaderMenu } from '@/components/landing-page/sections/header';
import { Container } from "@mantine/core";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  //checking session
  /*  const data = { session: { user: {} } };

  if (!data.session) {
    redirect("/login");
  } */

  return (
    <>
      <HeaderMenu />
      <Container size="responsive">{children}</Container>
    </>
  );
}