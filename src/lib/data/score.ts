import api from "./axios-instance";

export interface ScoreInfo {
  scoreId: number;
  userId: number;
  points: number;
}

export interface ScoreResponse {
  success: boolean;
  result?: ScoreInfo;
  message?: string;
}

export interface UsePointsRequest {
  bookingId: number;
  pointsToUse: number;
}

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  message?: string;
}

const getScore = async (): Promise<ScoreInfo> => {
  try {
    const response = await api.get<ScoreResponse>(`/api/scores`); // Gọi thẳng API BE
    return response.data.result!; // vì BE trả về ApiResponse.success(..., score)
  } catch (error) {
    console.error("Error fetching score:", error);
    throw error;
  }
};

const makeUsePoints = async (
  request: UsePointsRequest,
  token: string
): Promise<ApiResponse<ScoreInfo>> => {
  try {
    const response = await api.post<ApiResponse<ScoreInfo>>(
      `/api/scores/use`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`, // gắn token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error using points:", error);
    throw error;
  }
};
export { getScore, makeUsePoints };
