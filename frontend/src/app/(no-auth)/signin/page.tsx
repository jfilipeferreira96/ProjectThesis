"use client";
import { login, LoginData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Center } from "@mantine/core";
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { notifications } from '@mantine/notifications';
import { routes } from "@/config/routes";
import styled from "styled-components";
import { useSession } from "@/providers/SessionProvider";
import { z } from 'zod';
import ThreeDButton from "@/components/3dbutton";

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
});


export default function SignIn(){
  const { sessionLogin } = useSession();
  const router = useRouter();

  const onSubmitHandler = useCallback(async (data: LoginData) => {
    try
    {
      const response = await login(data);
      
      if (response.status)
      {
        notifications.show({
          title: "Success",
          message: '',
          color: 'green'
        })
        sessionLogin(response.user, response.accessToken, response.refreshToken);
      }
      if (response.status === false)
      {
        notifications.show({
          message: response.message,
          color: "red",
        });
      }
    }
    catch (error)
    {
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
    validate: zodResolver(schema),
  });
 
  return (
    <Center>
      <title>Sign In</title>

      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <Title ta="center" mt={100}>
          Welcome!
        </Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?
          <Anchor size="sm" component="a" ml={2} onClick={() => router.push(routes.register.url)}>
            Create account
          </Anchor>
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput className="specialinput" label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />
          <PasswordInput className="specialinput" label="Password" placeholder="Your password" required mt="md" {...form.getInputProps("password")} />
          <Group justify={"flex-end"} mt="lg">
            {/* <Anchor component="button" size="sm">
              Forgot password?
            </Anchor> */}
          </Group>
          <ThreeDButton color="blue" mt="xl" type="submit" smaller>
            Sign in
          </ThreeDButton>
        </StyledPaper>
      </form>
    </Center>
  );
}
