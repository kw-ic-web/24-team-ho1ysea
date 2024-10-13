import axios from "axios";

/**
 * @description ID 중복 여부 검사하는 API
 */
export const idCheckApi = (id: string) => {
  return axios.get<{ isAvailable: boolean }>(
    `${import.meta.env.VITE_API_URL}/user/check-id?id=${id}`
  );
};
