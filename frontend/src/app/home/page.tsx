"use client";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { register, RegisterData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

export default function Home() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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
      avatar: (value) => (value.length > 1 ? null : "Please select an avatar"),
    },
  });
  
  useEffect(() => {
    if (selectedAvatar) {
      form.setValues({
        avatar: selectedAvatar,
      });
    }
  }, [selectedAvatar]);

  const onSubmitHandler = useCallback(async (data: RegisterData) => {
    try {
      const response = await register(data);
      console.log("Register bem-sucedido:", response);
      notifications.show({
        title: "Success",
        message: "Leave the building immediately",
        color: "green",
      });
    } catch (error) {
      console.error("Erro ao fazer register:", error);
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  }, []);

  return (
    <>
      <div>

      </div>
    </>
  );
}
