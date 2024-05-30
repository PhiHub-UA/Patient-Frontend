import axios from "axios";

export default axios.create({
  baseURL: "http://phihub-backend:8080"
});