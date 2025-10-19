import axios from "axios";

const api = axios.create({
    baseURL: "", // thêm api (để trống khi dùng mock)
    withCredentials: false,
});

export default api;
