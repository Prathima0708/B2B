import Axios from "axios";

export const SERVER_HOST = getBaseUrl();
export const SERVER_HOST_LINK = "https://test-payment.baqaala.com/b2b/orders/supplier/doc"
export const SERVER_HOST_LINK2 = "https://test-payment.baqaala.com/b2b/orders/seller/doc"
export const IMAGE_URL_SERVER_HOST = null;

function getBaseUrl() {
  if (process.env.REACT_APP_NODE_ENV !== undefined && process.env.REACT_APP_NODE_ENV === "local") {
    return {
      b2b: "https://itsok.support/api/v1",
      user_service: "https://itsok.support:3001/api/v1",
      doc_uploader: "http://localhost:5500/api/v1",
    };
  }

  switch (process.env.NODE_ENV) {
    // case "production":
    //   return {
    //     b2b: "https://itsok.support/api/v1",
    //     user_service: "https://itsok.support:3001/api/v1",
    //     doc_uploader: "https://itsok.support:4001/api/v1",
    //     eLocals: "https://itsok.support/delivery/api/v1",
    //   };

    // case "development":
    //   return {
    //     b2b: "https://itsok.support/api/v1", //http://13.233.54.227:8000/api/v1
    //     user_service: "https://itsok.support:3001/api/v1",
    //     doc_uploader: "https://itsok.support:4001/api/v1",
    //     eLocals: "https://itsok.support:8080/api/v1",b2c.baqaala.com:8000/api/v1
    //   };

    default:
      return {
        user_service:
          process.env.REACT_APP_PRODUCT_ENV === "B2C"
            ? "https://b2c.baqaala.com/api/v1"
            : "https://b2b.baqaala.com/api/v1",
        doc_uploader:
          process.env.REACT_APP_PRODUCT_ENV === "B2C"
            ? "https://b2c.baqaala.com/asset/api/v1"
            : "https://b2b.baqaala.com/asset/api/v1",
        b2b:
          process.env.REACT_APP_PRODUCT_ENV === "B2C"
            ? "https://b2c.baqaala.com/core/api/v1"
            : "https://b2b.baqaala.com/core/api/v1",
        eLocals:
          process.env.REACT_APP_PRODUCT_ENV === "B2C"
            ? "https://b2c.baqaala.com/delivery/api/v1"
            : "https://b2b.baqaala.com/delivery/api/v1",
      };
  }
}

/**
 * FOR DELIVEY APP
 */
let basicAuth = {
  username: "sellerService",
  password: "23erj29uth;.d1o[399o2",
};
export const apiServiceAuth = {
  get(service, url, params) {
    console.info("Get API Call apiService");
    return Axios({
      method: "GET",
      url: SERVER_HOST[service] + url,
      params,
      auth: basicAuth,
    });
  },
  post(service, url, data, tkn) {
    console.info("Post API Call apiService", data, tkn);
    return Axios({
      method: "POST",
      url: SERVER_HOST[service] + url,
      data,
      auth: basicAuth,
    });
  },
  put(service, url, data, tkn) {
    console.info("Post API Call apiService", data, tkn);
    return Axios({
      method: "PUT",
      url: SERVER_HOST[service] + url,
      data,
      auth: basicAuth,
    });
  },
};

export const defaultImage = "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png";
