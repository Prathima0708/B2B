import React, { createContext, useReducer } from "react";

export const AdminContext = createContext();

const initialState = {
  // adminInfo: Cookies.get('adminInfo')
  //   ? JSON.parse(Cookies.get('adminInfo'))
  //   : null,
  adminInfo: {
    image:
      "https://external-preview.redd.it/6ihEzDJBAovC5HbmhxCuJU3NR8qeuWWvlYZ_QDwyLOA.jpg?auto=webp&s=94b6dfdffd2de8d996c816a80034166f546297ea",
    email: "bq@gmail.com",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, adminInfo: action.payload };

    case "USER_LOGOUT":
      return {
        ...state,
        adminInfo: null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
