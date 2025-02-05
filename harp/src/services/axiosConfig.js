import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9001/api", // URL base de tu backend

});

export default axiosInstance;
