import axios, { AxiosInstance } from "axios";

const BASE_URL = 'http://localhost:3000/api';

export const axiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
