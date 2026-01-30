import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/AICX-Dashboard/api/v1",
  withCredentials: true,
});

export default axiosInstance;
