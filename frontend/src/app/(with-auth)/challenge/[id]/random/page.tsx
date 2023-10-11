"use client";
import React, { useEffect, useState } from "react";
import { Card, Title, TextInput, Loader } from "@mantine/core";
import classes from "./random.module.scss";
import { jsQuizz } from "./data";
import Quizz, { Question } from "@/components/quiz";

interface RandomProps {
  params: {
    id: string;
  };
}

const Random: React.FC<RandomProps> = ({ params: { id } }: RandomProps) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        /* const response = await fetch(`https://644982a3e7eb3378ca4ba471.mockapi.io/questions`);
        const questionsResponse = await response.json(); */

        setQuestions(jsQuizz);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getQuestions();
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
