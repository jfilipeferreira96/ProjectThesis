"use client";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { register, RegisterData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input, Center } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from 'zod';

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

const schema = z.object({
  fullname: z.string().min(2, { message: 'Full name should have at least 2 letters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
  avatar: z.string().min(4, { message: 'Please select an avatar' })
});

export default function Register() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { sessionLogin } = useSession();

  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      studentId: "",
      password: "",
      avatar: "",
    },
    validate: zodResolver(schema), 
  });

  useEffect(() => {
    if (selectedAvatar)
    {
      form.setValues({
        avatar: selectedAvatar,
      });
    }
  }, [selectedAvatar]);

  const onSubmitHandler = useCallback(async (data: RegisterData) => {
    try {
      const response = await register(data);
      if (response.status) {
        notifications.show({
          
          title: "Success",
          message: "",
          color: "green",
        });

        sessionLogin(response.user, response.accessToken, response.refreshToken);
      } else {
        notifications.show({
          title: "Error",
          message: response.message,
          color: "red",
        });
      }
      
    }
    catch (error){
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

  return (
    <Center>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        
        <Title ta="center" mt={100}>Create an account!</Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?
          <Anchor size="sm" component="button" ml={2} onClick={() => router.push(routes.signin.url)}>
            Sign In
          </Anchor>
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Full name" placeholder="Your full name" required {...form.getInputProps("fullname")} />
          <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />
          <TextInput label="Student ID" placeholder="Your student ID" {...form.getInputProps("studentId")} />
          <PasswordInput label="Password" placeholder="Your password" required {...form.getInputProps("password")} />

          <Input.Wrapper label="Avatar" withAsterisk description="Select an avatar" error={form?.errors?.avatar}>
            <SetAvatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
          </Input.Wrapper>
          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </StyledPaper>
      </form>
    </Center>

  );
}
