import api from "@/config/api";
import { endpoints } from "@/config/routes";

export enum QuestionType {
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
}

export enum QuizzStatus {
  PendingStart = 0,
  InProgress = 1,
  Completed = 2,
}

export function getQuizzStatusInfo(status: QuizzStatus) {
  switch (status) {
    case QuizzStatus.PendingStart:
      return { name: "Pending Start", color: "blue" };
    case QuizzStatus.InProgress:
      return { name: "In Progress", color: "green" };
    case QuizzStatus.Completed:
      return { name: "Completed", color: "orange" };
    default:
      return { name: "Unknown", color: "black" };
  }
}

export interface QuizzData {
  quizzId?: string;
  challengeId?: string;
  questions: {
    question: string;
    _id?: string;
    key: string;
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
    const response = await api.post(endpoints.editQuizzRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editQuizzStatus = async (id: string, status: QuizzStatus) => {
  try {
    const response = await api.post(endpoints.editQuizzStatusRoute, { quizId: id, status: status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuizz = async (id: string) => {
  
  try {
    const response = await api.post(endpoints.deleteQuizzRoute, { quizId: id });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SaveQuizAnswer = async (data: { quizId?: string; userAnswers: { _id: number | string; answer: string }[] }) => {
  try {
    const response = await api.post(endpoints.SaveQuizAnswerRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};