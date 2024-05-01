import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { addToFormData } from "@/utils/formData";

export enum QuestionType
{
  FillInBlank = "FillInBlank",
  MultipleQuestions = "MultipleQuestions",
  FileUpload = "FileUpload",
}

export enum EvalutionType
{
  Automatic = "Automatic",
  Manual = "Manual",
}

export enum QuizzStatus
{
  PendingStart = 0,
  InProgress = 1,
  Completed = 2,
}

export function getQuizzStatusInfo(status: QuizzStatus)
{
  switch (status)
  {
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

export interface IQuestion
{
  question: string;
  _id?: string;
  key: string;
  type: QuestionType;
  choices: string[];
  correctAnswer: string;
  pontuation?: number;
  file?: File | any | string;
}

export interface QuizzData
{
  quizzId?: string;
  challengeId?: string;
  evaluation?: EvalutionType;
  shuffle?: boolean;
  sounds?: boolean;
  questions: IQuestion[];
}

export interface IAnswer
{
  answer: string | File | any;
  pontuation?: number;
  _id: string;
}[]

export const createQuizz = async (data: QuizzData) =>
{
  try
  {
    const response = await api.post(endpoints.createQuizzRoute, data);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const getChallenges = async () =>
{
  try
  {
    const response = await api.get(endpoints.getChallengesByUserId);

    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const getSingleQuizz = async (id: string) =>
{
  try
  {
    const response = await api.get(endpoints.getSingleQuizz + id);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const editQuizz = async (data: QuizzData) =>
{
  try
  {
    const response = await api.post(endpoints.editQuizzRoute, data);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const editQuizzStatus = async (id: string, status: QuizzStatus) =>
{
  try
  {
    const response = await api.post(endpoints.editQuizzStatusRoute, { quizId: id, status: status });
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const deleteQuizz = async (id: string) =>
{
  try
  {
    const response = await api.post(endpoints.deleteQuizzRoute, { quizId: id });
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const SaveQuizAnswer = async (data: { quizId?: string; userAnswers: IAnswer, seconds: number }) =>
{
  try
  {
    const formData = new FormData();
    addToFormData(data, formData);

    const response = await api.post(endpoints.saveQuizAnswerRoute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const getAnswers = async (id: string) => {
  try
  {
    const response = await api.get(endpoints.getAnswers + id);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const editQuizzPontuation = async (userId: string, quizzId: string, newAnswers: IAnswer[]) => {
  try {
    const response = await api.post(endpoints.editQuizzPontuationRoute, { userId, quizzId, newAnswers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

function getFileType(response: any) {
  const contentType = response.headers["content-type"];
  return contentType.substring(contentType.lastIndexOf("/") + 1);
}


export const getFileForDownload = async (questionId: string, userId: string, filename:string) => {
  try {
    const response = await api.get(endpoints.downloadFile + questionId + "/" + userId, {
      responseType: "blob",
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}`);
    document.body.appendChild(link);
    link.click();

    return response.data;
  } catch (error) {
    throw error;
  }
};