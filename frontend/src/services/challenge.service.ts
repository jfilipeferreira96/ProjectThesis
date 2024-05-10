import api from "@/config/api";
import { endpoints } from "@/config/routes";

export enum ChallengeType {
  TYPE_EXPRESS = "Express",
  TYPE_LEAGUE = "League",
}

export enum ChallengeStatus {
  Deleted = 0,
  Active = 1,
  InProgress = 2,
  Completed = 3,
}

type StatusOption = {
  label: string;
  value: number;
};

export const challengeStatusOptions: StatusOption[] = [
  { label: "Deleted", value: ChallengeStatus.Deleted },
  { label: "Active", value: ChallengeStatus.Active },
  { label: "In Progress", value: ChallengeStatus.InProgress },
  { label: "Completed", value: ChallengeStatus.Completed },
];

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
  id?: string;
  title: string;
  description: string;
  type: ChallengeType;
  status?: ChallengeStatus | string;
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

export const editChallenge = async (data: CreateChallengeData) => {
  try {
    const response = await api.post(endpoints.editChallengeRoute, data);
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

export const getSingleChallenge = async (id:string) => {
  try {
    const response = await api.get(endpoints.getSingleChallenge + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllChallengeQuizzes = async (id: string) => {
  try {
    const response = await api.get(endpoints.getAllChallengeQuizzes + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinChallenge = async (token: string) => {
  try {
    const response = await api.post(endpoints.joinChallenge, { token: token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAdmin = async (challengeId: string, email: string) => {
  try {
    const response = await api.post(endpoints.addAdminRoute, { challengeId: challengeId, email: email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const removeAdmin = async (challengeId: string, userId: string) => {
  try {
    const response = await api.post(endpoints.removeAdminRoute, { challengeId: challengeId, userId: userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};