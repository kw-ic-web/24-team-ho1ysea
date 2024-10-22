import axios from "axios";

/**
 * @description 사용자가 관리자 계정인지 확인
 * @description 토큰이 없거나 유효하지 않음: 401
 * @description 토큰이 유효하지만 어드민이 아님: 403
 * @description 토큰이 유효하고 어드민임: 200
 * @param token JWT 토큰
 */
export const isAdminApi = (token: string) => {
  return axios.get<{ message: string }>(
    `${import.meta.env.VITE_API_URL}/admin/validate`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
