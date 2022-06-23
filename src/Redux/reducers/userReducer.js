/* eslint-disable import/no-anonymous-default-export */
import {
  DELETE_USER_DETAILS,
  SET_USER_DETAILS,
  SET_VERIFIED_MOBILE_NUMBER,
} from "../actions/types";

import { getUserFromLocalStorage } from "../../utils/setLocalStorage";

const initialState = {
  mobileNumberIsVerified: false,
  verifiedMobileNumber: "",
  countryCode: "",
  userDetails: getUserFromLocalStorage(),
  myOrder: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  let actionState = state;
  switch (type) {
    case "MY_ORDER_LIST_UPDATE_ADD":
      actionState.myOrder = payload;
      return actionState;
    case "MY_ORDER_LIST_UPDATE_ADD_RESET":
      actionState.myOrder = null;
      return actionState;
    case SET_VERIFIED_MOBILE_NUMBER:
      return {
        ...state,
        mobileNumberIsVerified: true,
        verifiedMobileNumber: payload.mobileNumber,
        countryCode: payload.countryCode,
      };

    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: payload,
      };

    case DELETE_USER_DETAILS:
      return {
        mobileNumberIsVerified: false,
        verifiedMobileNumber: "",
        countryCode: "",
        userDetails: {},
      };
    default:
      return actionState;
  }
};
