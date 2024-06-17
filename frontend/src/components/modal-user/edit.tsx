"use client";
import ThreeDButton from "@/components/3dbutton";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { register, RegisterData, UserType } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input, Center, Radio, CheckIcon, CheckboxGroup } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from "zod";

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

const schema = z.object({
  fullname: z.string().min(2, { message: "Full name should have at least 2 letters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  avatar: z.string().min(4, { message: "Please select an avatar" }),
});

export default function EditUserModal() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { sessionLogin } = useSession();
  const [userType, setUserType] = useState<string[]>([UserType.ADMIN]);

  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      studentId: "",
      password: "",
      type: UserType.ADMIN,
      avatar: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedAvatar) {
      form.setValues({
        avatar: selectedAvatar,
      });
    }
  }, [selectedAvatar]);

  const onSubmitHandler = useCallback(
    async (data: RegisterData) => {
      data.type = userType[0] as UserType;

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
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      }
    },
    [userType]
  );

  const handleCheckboxChange = (value: string[]) => {
    setUserType((prevUserType) => {
      if (value.length === 0) {
        return [];
      } else {
        const valueToSave = value.length > 1 ? value[1] : value[0];
        return [valueToSave];
      }
    });
  };

  return (
    <Center>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <title>Sign Up</title>
        <Title ta="center" mt={100}>
          Create an account!
        </Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?
          <Anchor size="sm" component="a" ml={2} onClick={() => router.push(routes.signin.url)}>
            Sign In
          </Anchor>
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput className="specialinput" label="Full name" placeholder="Your full name" required {...form.getInputProps("fullname")} />
          <TextInput className="specialinput" label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />

          <Checkbox.Group label="User type" mb="xs" value={userType} onChange={handleCheckboxChange}>
            <Group mb="xs" align="center" justify="center">
              <Checkbox value={UserType.ADMIN} label={UserType.ADMIN} defaultChecked />
              <Checkbox value={UserType.TEACHER} label={UserType.TEACHER} />
              <Checkbox value={UserType.STUDENT} label={UserType.STUDENT} />
            </Group>
          </Checkbox.Group>

          <TextInput className="specialinput" label="Student ID" placeholder="Your student ID" {...form.getInputProps("studentId")} />

          <PasswordInput className="specialinput" label="Password" placeholder="Your password" required {...form.getInputProps("password")} />

          <Input.Wrapper className="specialinput" label="Avatar" withAsterisk description="Select an avatar" error={form?.errors?.avatar}>
            <SetAvatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
          </Input.Wrapper>
          <ThreeDButton color="blue" mt="xl" type="submit" smaller>
            Register
          </ThreeDButton>
        </StyledPaper>
      </form>
    </Center>
  );
}
