import axios, { AxiosError } from 'axios';

interface IApiError {
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestampKst: string;
  timestampUtc: string;
}

const instance = (answererToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (answererToken) {
    headers.Authorization = `Bearer ${answererToken}`;
  }

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_URL,
    withCredentials: true,
    headers,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<IApiError>) => {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 401:
            console.error('401 Unauthorized:', data.message);
            break;

          case 403:
            console.error('403 Forbidden:', data.message);
            break;

          case 404:
            console.error('404 Not Found:', data.message);
            break;

          case 500:
          default:
            console.error(`Server Error ${status}:`, data.message);
            break;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error settingup request:', error.message);
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default instance;
