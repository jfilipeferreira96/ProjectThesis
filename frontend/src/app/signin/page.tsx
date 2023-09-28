"use client";
import { login, LoginData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { notifications } from '@mantine/notifications';

export default function SignIn(){
  const router = useRouter();

  const onSubmitHandler = useCallback(async (data: LoginData) =>{
      try
      {
        const response = await login(data);
        console.log('Login bem-sucedido:', response);
        notifications.show({
          title: "You've been compromised",
          message: 'Leave the building immediately',
          color: 'green'
        })
      }
      catch (error)
      {
        console.error('Erro ao fazer login:', error);
        notifications.show({
          title: "You've been compromised",
          message: 'Leave the building immediately',
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
    <Container size={420} my={200}>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <Title ta="center">Welcome back!</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?
          <Anchor size="sm" component="button" ml={2} onClick={() => router.push("/register")}>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps('email')} />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
          <Group justify={'flex-end'} mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
