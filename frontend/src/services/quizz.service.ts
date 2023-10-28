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
    const response = await api.post(endpoints.editQuizzRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editQuizzState = async (id: string, state: QuizzStatus) => {
  try {
    const response = await api.post(endpoints.editQuizzStateRoute, { quizId: id, state: state });
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