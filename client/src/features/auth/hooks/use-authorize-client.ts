import { API_URL, DEV_API_URL, IS_DEVELOPMENT } from "@/config";
import { ParsedToken, parsedTokenSchema } from "@/features/auth/schema";
import { axios as client } from "@/lib/axios";
import { useAppStore } from "@/stores";
import { isTokenExpired } from "@/utils/is-token-expired";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Token } from "../types";

const getRefreshToken = async () => {
  try {
    const response = await axios.get<Token>("/auth/refresh", {
      withCredentials: true,
      baseURL: IS_DEVELOPMENT ? DEV_API_URL : API_URL,
    });

    const { accessToken } = response.data;

    const decodedToken = jwtDecode<ParsedToken>(accessToken);
    const parsedUser = parsedTokenSchema.parse(decodedToken);
    const { role, exp } = parsedUser;

    return { role, exp };
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
};

export const useAuthorizeClient = () => {
  const [isSet, setIsSet] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const auth = useAppStore.use.auth();
  const refreshToken = useAppStore.use.refreshToken();

  useEffect(() => {
    const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
      if (auth.isAuthenticated && isTokenExpired(auth.tokenExpiration as number)) {
        try {
          const { exp, role } = await getRefreshToken();
          console.log("Token refresh success: ", exp);
          refreshToken({ role, tokenExpiration: exp });
        } catch (error) {
          console.log("Token refresh failed: ", error);
          setIsSessionExpired(true);
        }
      }

      return config;
    };

    const errorRequestInterceptor = (error: AxiosError) => {
      if (error.status === 401) {
        console.log("Unauthorized:", error.response?.data);
      }

      const { message } = error.response?.data as unknown as {
        message: string;
      };

      return Promise.reject(message);
    };

    const interceptor = client.interceptors.request.use(
      requestInterceptor,
      errorRequestInterceptor
    );

    setIsSet(true);

    return () => {
      client.interceptors.request.eject(interceptor);
    };
  }, [auth.isAuthenticated, auth.tokenExpiration, refreshToken]);

  return {
    isSet,
    isSessionExpired,
    handleSessionExpire: () => setIsSessionExpired(false),
  };
};
