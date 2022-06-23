import { DELETE_USER_DETAILS, SET_USER_DETAILS, SET_VERIFIED_MOBILE_NUMBER } from "./types";

export const setVerifiedMobileNumber = (data) => {
  return {
    type: SET_VERIFIED_MOBILE_NUMBER,
    payload: data,
  };
};

export const setUserDetails = (data) => {
  return {
    type: SET_USER_DETAILS,
    payload: data,
  };
};

export const deleteUserDetails = () => {
  return {
    type: DELETE_USER_DETAILS,
  };
};
