import api from "@/config/api";
import { endpoints } from "@/config/routes";

export enum ChallengeType {
  TYPE_A = "Type A",
  TYPE_B = "Type B",
}

export interface CreateChallengeData {
  title: string;
  description: string;
  type: ChallengeType;
}

export const createChallenge = async (data: CreateChallengeData) => {
  try
  {
    const response = await api.post(endpoints.createChallengeRoute, data);
    return response.data;
  }
  catch (error)
  {
    throw error;
  }
};