"use client";
import React, { useEffect, useState } from "react";
import { Card, Title, TextInput, Loader, Anchor, Group, Text, Center } from "@mantine/core";
import Quizz, { Question } from "@/components/quizz";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { EvalutionType, getSingleQuizz } from "@/services/quizz.service";

interface PlayPageProps {
  params: {
    id: string;
    quizzId: string;
    isAutomatic?: boolean
  };
}

export const shuffleArray = (array: any[]) => {
  const newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const PlayPage = (props: PlayPageProps) => {
  const { id, quizzId, isAutomatic } = props.params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shouldShuffle, setShouldShuffle] = useState(true);
  const [evaluationType, setEvaluationType] = useState("");
  const [sounds, setSounds] = useState(true);

  const getQuestions = async (id: string) => {
    try {
    
      const response = await getSingleQuizz(quizzId);
      if (response.status) {
        let questions = response.questions;
        
        if (response.shuffle) {

          questions = shuffleArray(response.questions);
        }
        
        setQuestions(questions);

        setShouldShuffle(response.shuffle);
        setSounds(response.sounds);
        setEvaluationType(response.evaluation);

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
      <Quizz
        questions={questions}
        quizId={quizzId}
        sounds={sounds}
        isAutomatic={evaluationType === EvalutionType.Automatic}
      />
    </>
  );
};

export default PlayPage;
