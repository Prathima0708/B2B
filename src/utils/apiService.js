import Axios from "axios";
import { SERVER_HOST } from "./constants";

const apiService = {
  get(service, url, params) {
    console.info("Get API Call apiService");
    return Axios({
      method: "GET",
      url: SERVER_HOST[service] + url,
      params,
    });
  },
  post(service, url, data, tkn) {
    console.info("Post API Call apiService", data, tkn);
    return Axios({
      method: "POST",
      url: SERVER_HOST[service] + url,
      data,
    });
  },
  delete(service, url, data, tkn) {
    console.info("Post API Call apiService", data, tkn);
    return Axios({
      method: "DELETE",
      url: SERVER_HOST[service] + url,
      data,
    });
  },
  put(service, url, data, tkn) {
    console.info("Post API Call apiService", data, tkn);
    return Axios({
      method: "PUT",
      url: SERVER_HOST[service] + url,
      data,
    });
  },
  patch(service, url, data, tkn) {
    console.info("Patch API Call apiService", data, tkn);
    return Axios({
      method: "PATCH",
      url: SERVER_HOST[service] + url,
      data,
    });
  },
};

export default apiService;
