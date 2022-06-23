import { SERVER_HOST } from "./constants";
import axios from "axios";

export const uploaderUtil = (formData) => {
  return axios
    .post(`${SERVER_HOST["doc_uploader"]}/uploader`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((s3) => s3.data.url);
};

export const deleteUtil = (url) => {
  return axios
    .delete(`${SERVER_HOST["doc_uploader"]}/delete/by-url?url=${url}`)
    .catch((err) => console.log(err));
};
