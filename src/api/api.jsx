import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // thêm api (để trống khi dùng mock)
  withCredentials: false,
});

export default api;
