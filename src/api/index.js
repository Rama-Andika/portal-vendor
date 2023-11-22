import axios from "axios";
const Api = axios.create({
  baseURL: "http://localhost:8002/oxy_api8/api",

});

export default Api;
