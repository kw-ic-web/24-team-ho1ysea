import {
  BannedUser,
  Report,
  TrashLimit,
  TrashSpeed,
  User,
} from "@@types/adminType";
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

/**
 * @description 모든 유저들의 정보를 가져옴
 * @param token JWT 토큰
 */
export const getAllUsersApi = (token: string) => {
  return axios.get<User[]>(`${import.meta.env.VITE_API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description 모든 유저들의 신고당한 횟수를 가져옴
 * @param token JWT 토큰
 */
export const getReportsApi = (token: string) => {
  return axios.get<Report[]>(`${import.meta.env.VITE_API_URL}/admin/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description 밴 당한 유저들의 정보를 가져옴
 * @param token JWT 토큰
 */
export const getBanUsersApi = (token: string) => {
  return axios.get<BannedUser[]>(
    `${import.meta.env.VITE_API_URL}/admin/banned-users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 사용자를 밴하는 API
 * @param token JWT 토큰
 */
export const banUserApi = (
  token: string,
  userId: string,
  bannedReason: string,
  banDuration: number
) => {
  return axios.post<{ message: string }>(
    `${import.meta.env.VITE_API_URL}/admin/ban`,
    {
      userId,
      banDuration,
      bannedReason,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 쓰레기 생성 속도를 가져옴
 * @param token JWT 토큰
 */
export const getTrashSpeedApi = (token: string) => {
  return axios.get<TrashSpeed>(
    `${import.meta.env.VITE_API_URL}/admin/trash-speed`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 쓰레기 생성 속도를 재설정함
 * @param token JWT 토큰
 * @param newSpeed 새로 설정할 쓰레기 생성 속도
 */
export const setTrashSpeedApi = (token: string, newSpeed: number) => {
  return axios.patch<TrashSpeed>(
    `${import.meta.env.VITE_API_URL}/admin/trash-speed`,
    {
      speed: newSpeed,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 최대 쓰레기 생성량을 가져옴
 * @param token JWT 토큰
 */
export const getTrashLimitApi = (token: string) => {
  return axios.get<TrashLimit>(
    `${import.meta.env.VITE_API_URL}/admin/trash-limit`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 최대 쓰레기 생성량을 재설정함
 * @param token JWT 토큰
 * @param newLimit 새로 설정할 최대 쓰레기 생성량
 */
export const setTrashLimitApi = (token: string, newLimit: number) => {
  return axios.patch<TrashLimit>(
    `${import.meta.env.VITE_API_URL}/admin/trash-limit`,
    {
      quantity: newLimit,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
