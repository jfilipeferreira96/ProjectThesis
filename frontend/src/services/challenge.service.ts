import api from "@/config/api";
import { endpoints } from "@/config/routes";

export enum ChallengeType {
  TYPE_A = "Type A",
  TYPE_B = "Type B",
}

export enum ChallengeStatus {
  Deleted = 0,
  Active = 1,
  InProgress = 2,
  Completed = 3,
}

export function getStatusInfo(status: ChallengeStatus) {
  switch (status) {
    case ChallengeStatus.Deleted:
      return { name: "Deleted", color: "red" };
    case ChallengeStatus.Active:
      return { name: "Active", color: "blue" };
    case ChallengeStatus.InProgress:
      return { name: "In Progress", color: "green" };
    case ChallengeStatus.Completed:
      return { name: "Completed", color: "orange" };
    default:
      return { name: "Unknown", color: "black" };
  }
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