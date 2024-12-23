import { API_URL, DEV_API_URL, IS_DEVELOPMENT } from "@/config";
import { sleep } from "@/utils/sleep";
import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const NETWORK_ERROR =
  "Unable to Connect: The server is currently unreachable or refusing the connection. Please check your network connection and try again later.";

export const axios = Axios.create({
  baseURL: IS_DEVELOPMENT ? DEV_API_URL : API_URL,
  withCredentials: true,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.headers.Accept = "application/json";

  await sleep(450);

  return config;
};

const errorResponseInterceptor = (error: AxiosError) => {
  const { message } = error.response?.data as unknown as { message: string };

  if (error.code === "ERR_NETWORK") {
    throw new Error(NETWORK_ERROR);
  }

  throw new Error(message);
};

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use((response) => response.data, errorResponseInterceptor);
