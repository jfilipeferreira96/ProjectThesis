"use client";
import { login, LoginData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Center } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { notifications } from '@mantine/notifications';
import { routes } from "@/config/routes";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

export default function SignIn()
{
  const router = useRouter();

  const onSubmitHandler = useCallback(async (data: LoginData) =>
  {
    try
    {
      const response = await login(data);
      console.log('Login bem-sucedido:', response);
      notifications.show({
        title: "Success",
        message: 'Leave the building immediately',
        color: 'green'
      })
    }
    catch (error)
    {
      console.error('Erro ao fazer login:', error);
      notifications.show({
        title: "Error",
        message: 'Something went wrong',
        color: 'red',
      })
    }

  }, [])

  const form = useForm<LoginData>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => (value.length >= 4 ? null : 'Password must be at least 4 characters long'),
    },
  });

  return (
    <Center>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        
        <Title ta="center" mt={100}>Welcome!</Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?
          <Anchor size="sm" component="button" ml={2} onClick={() => router.push(routes.register.url)}>
            Create account
          </Anchor>
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps("password")} />
          <Group justify={"flex-end"} mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </StyledPaper>
      </form>
    </Center>
  );
}
