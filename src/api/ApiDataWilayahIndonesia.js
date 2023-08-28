import axios from "axios";

const ApiDataWilayahIndonesia = axios.create({
  // set endpoint api
  baseURL: `https://www.emsifa.com/api-wilayah-indonesia/api/`,

  // set header axios
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});

export default ApiDataWilayahIndonesia;
