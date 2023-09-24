"use client";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  return (
    <div>
      <Container size={420} my={200}>
        <form>
          <Title ta="center">Create an account!</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor size="sm" component="button" ml={2} onClick={() => router.push("/signin")}>
              Sign In
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput label="Email" placeholder="you@gmail.com" required />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl">
              Sign in
            </Button>
          </Paper>
        </form>
      </Container>
    </div>
  );
}
