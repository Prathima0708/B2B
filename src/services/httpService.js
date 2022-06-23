import Cookies from "js-cookie";
import axios from "axios";
import { coreServiceBaseUrl } from "../utils/backendUrls";

const instance = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL,
  baseURL: coreServiceBaseUrl,
  timeout: 500000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let adminInfo;
  if (Cookies.get("adminInfo")) {
    adminInfo = JSON.parse(Cookies.get("adminInfo"));
  }

  return {
    ...config,
    headers: {
      authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
    },
  };
});

const responseBody = (response) => {
  return response.data.result || response.data;
};

const requests = {
  get: (url, body, headers) => instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) => instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url) => instance.delete(url).then(responseBody),
};

export default requests;
