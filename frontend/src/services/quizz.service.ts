import api from "@/config/api";
import { endpoints } from "@/config/routes";

export enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

export interface QuizzData {
  quizzId?: string;
  questions: {
    question: string;
    id: string;
    type: QuestionType;
    choices: string[];
    correctAnswer: string;
  }[];
}
export const createQuizz = async (data: QuizzData) => {
  try {
    const response = await api.post(endpoints.createQuizzRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChallenges = async () => {
  try {
    const response = await api.get(endpoints.getChallengesByUserId);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleQuizz = async (id: string) => {
  try {
    const response = await api.get(endpoints.getSingleQuizz + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editQuizz = async (data: QuizzData) => {
  try {
    console.log(data)
    const response = await api.post(endpoints.editQuizzRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
