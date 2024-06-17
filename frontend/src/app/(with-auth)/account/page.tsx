"use client";
import ThreeDButton from "@/components/3dbutton";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { User, useSession } from "@/providers/SessionProvider";
import { RegisterData, updateAccount } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Input, Center, Loader } from "@mantine/core";
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
    fullname: z.string().min(2, { message: 'Full name should have at least 2 letters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
    .string()
    .optional()
    .or(z.string().min(4, { message: 'Password must be at least 4 characters long' })),
    avatar: z.string().min(4, { message: 'Please select an avatar' })
});

export default function UpdateProfile(){
    const router = useRouter();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const { user, sessionLogin, updateUser } = useSession();
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() =>
    {
        if (user)
        {
            setIsLoading(true);
            form.setValues({
                fullname: user.fullname,
                email: user.email,
                studentId: user.studentId || "",
                avatar: user.avatar || "",
            });
            setSelectedAvatar(user.avatar || "");
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() =>
    {
        if (selectedAvatar)
        {
            form.setValues({
                avatar: selectedAvatar,
            });
        }
    }, [selectedAvatar]);

    const onSubmitHandler = useCallback(async (data: Partial<User>) => {
        try
        {
            if (!data.password) {
                delete data.password;
            }

            const response = await updateAccount(user._id, data);
            if (response.status)
            {
                notifications.show({
                    title: "Success",
                    message: "Profile updated successfully",
                    color: "green",
                });

                updateUser(response.user);
            } else
            {
                notifications.show({
                    title: "Error",
                    message: response.message,
                    color: "red",
                });
            }
        } catch (error)
        {
            notifications.show({
                title: "Error",
                message: "Something went wrong",
                color: "red",
            });
        }
    }, [user, sessionLogin, updateUser]);

    if (isLoading)
    {
        return (
            <Center mt={100} mih={"50vh"}>
                <Loader color="blue" />
            </Center>
        );
    }

    return (
      <Center>
        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
          <title>Update Profile</title>

          <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title ta="center" mb={20}>
              Update your profile information
            </Title>
            <TextInput className="specialinput" label="Full name" placeholder="Your full name" required {...form.getInputProps("fullname")} />
            <TextInput className="specialinput" label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} />

            <TextInput className="specialinput" label="Student ID" placeholder="Your student ID" {...form.getInputProps("studentId")} />

            <PasswordInput className="specialinput" label="Password" placeholder="Your password" {...form.getInputProps("password")} />

            <Input.Wrapper className="specialinput" label="Avatar" withAsterisk description="Select an avatar" error={form?.errors?.avatar}>
              <SetAvatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} initialAvatar={user.avatar} />
            </Input.Wrapper>
            <ThreeDButton color="blue" mt="xl" type="submit" smaller>
              Update Profile
            </ThreeDButton>
          </StyledPaper>
        </form>
      </Center>
    );
}
