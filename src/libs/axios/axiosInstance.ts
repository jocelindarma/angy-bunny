import axios from "axios";

const BASE_URL: string = "";

let sessionFailedHandler: (() => void);
let isLocked: boolean = false;

export const setSessionFailedHandler = (handle: () => void) => {
  sessionFailedHandler = handle;
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

axiosInstance.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (!isLocked) {
        isLocked = true;
        if (sessionFailedHandler) {
          sessionFailedHandler();
        }
        isLocked = false;
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
)