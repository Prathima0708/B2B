export const gatewayServiceBaseUrl =
  process.env.REACT_APP_PRODUCT_ENV === "B2C"
    ? "https://b2c.baqaala.com/api/v1"
    : "https://b2b.baqaala.com/api/v1";

export const assetServiceBaseUrl =
  process.env.REACT_APP_PRODUCT_ENV === "B2C"
    ? "https://b2c.baqaala.com/asset/api/v1"
    : "https://b2b.baqaala.com/asset/api/v1";

export const coreServiceBaseUrl =
  process.env.REACT_APP_PRODUCT_ENV === "B2C"
    ? "https://b2c.baqaala.com/core/api/v1"
    : "https://b2b.baqaala.com/core/api/v1";

export const notificationServiceBaseUrl =
  process.env.REACT_APP_PRODUCT_ENV === "B2C"
    ? "https://b2c.baqaala.com/notification/service/api/notifications"
    : "https://b2b.baqaala.com/notification/service/api/notifications";
