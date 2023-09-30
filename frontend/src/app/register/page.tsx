"use client";
import { routes } from "@/config/routes";
import { register, RegisterData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Register() {
  const router = useRouter();

   const form = useForm({
     initialValues: {
       fullname: "",
       email: "",
       studentId: "", 
       password: "",
       avatar: "", 
     },
     validate: {
       fullname: (value) => (value.trim() !== "" ? null : "Please enter your name"),
       email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email address"),
       password: (value) => (value.length >= 4 ? null : "Password must be at least 4 characters long"),
     },
   });
  
    const onSubmitHandler = useCallback(async (data: RegisterData) => {
      try {
        const response = await register(data);
        console.log("Login bem-sucedido:", response);
        notifications.show({
          title: "You've been compromised",
          message: "Leave the building immediately",
          color: "green",
        });
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        notifications.show({
          title: "You've been compromised",
          message: "Leave the building immediately",
          color: "red",
        });
      }
    }, []);
  
  return (
    <Container size="responsive">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
          <Title ta="center">Create an account!</Title>

          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?
            <Anchor size="sm" component="button" ml={2} onClick={() => router.push(routes.signin.url)}>
              Sign In
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={600}>
            <TextInput label="Full name" placeholder="Your full name" required {...form.getInputProps("fullname")} />
            <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />
            <TextInput label="Student ID" placeholder="Your student ID" {...form.getInputProps("studentId")} />
            <PasswordInput label="Password" placeholder="Your password" required {...form.getInputProps("password")} />
            <div>
              <label htmlFor="avatar" style={{ display: "block", marginBottom: "8px" }}>
                Avatar
              </label>
              <input type="file" id="avatar" accept="image/*" />
            </div>
            <Button fullWidth mt="xl" type="submit">
              Register
            </Button>
          </Paper>
        </form>
      </div>
    </Container>
  );
}
