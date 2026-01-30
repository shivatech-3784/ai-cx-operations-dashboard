import axiosInstance from "./axios";

export const fetchAgents = async () => {
  const res = await axiosInstance.get(
    "/users/agents"
  );
  return res.data.data;
};