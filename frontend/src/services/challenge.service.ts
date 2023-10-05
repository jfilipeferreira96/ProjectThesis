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

export const getChallenges = async () => {
  try {
    console.log(endpoints.getChallengesByUserId)
    const response = await api.get(endpoints.getChallengesByUserId);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleChallenge = async (id:string) => {
  try {
    const response = await api.get(endpoints.getSingleChallenge + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};