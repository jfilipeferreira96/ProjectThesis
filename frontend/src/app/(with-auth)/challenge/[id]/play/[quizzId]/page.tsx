"use client";
import React, { useEffect, useState } from "react";
import { Card, Title, TextInput, Loader, Anchor, Group, Text, Center } from "@mantine/core";
import Quizz, { Question } from "@/components/quizz";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { getSingleQuizz } from "@/services/quizz.service";

interface RandomProps {
  params: {
    id: string;
  };
}

const Random = ({ params: { id, quizzId } }: { params: { id: string; quizzId: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  const getQuestions = async (id: string) => {
    try {
      
      const response = await getSingleQuizz(quizzId);
      if (response.status) {
        setQuestions(response.questions);
        setLoading(false);
      }
      if (response.status === false) {
        notifications.show({
          title: "Oops",
          message: response.message,
          color: "red",
        });
        router.push(`${routes.challenge.url}/${id}`);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      router.push(`${routes.challenge.url}/${id}`);
    }
  };

  useEffect(() => {
    if (id) {
      getQuestions(id);
    }
  }, []);

  if (loading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <>
      <Quizz questions={questions} quizId={quizzId} />
    </>
  );
};

export default Random;
