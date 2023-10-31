"use client";
import React, { useEffect, useState } from "react";
import { Card, Title, TextInput, Loader, Anchor, Group, Text } from "@mantine/core";
import Quizz, { Question } from "@/components/quizz";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

interface RandomProps {
  params: {
    id: string;
  };
}

const Random: React.FC<RandomProps> = ({ params: { id } }: RandomProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  const getQuestions = async (id: string) => {
    try {
      //const response = await getJsonQuestions(`https://644982a3e7eb3378ca4ba471.mockapi.io/questions`);
      const response = {status: false, message: "po crl"};
      console.log(response);
      if (response.status){
        //setQuestions(response.quizz);
        setLoading(false);
      }
      if (response.status === false){
        notifications.show({
          title: "Oops",
          message: response.message,
          color: "red",
        });
        router.push(`${routes.challenge.url}/${id}`);
      }
    } catch (error){
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      router.push(`${routes.challenge.url}/${id}`);
    }
  };

  useEffect(() => {
    if (id){
      getQuestions(id);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Quizz questions={questions} />
    </>
  );
};

export default Random;
