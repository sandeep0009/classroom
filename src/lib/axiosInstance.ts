import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.BASE_URL;

export const axiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
