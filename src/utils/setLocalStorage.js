export const setUserInLocalStorage = (userDetails) => {
  const strinfifiedUserDetails = JSON.stringify(userDetails);
  localStorage.setItem("baqala-user", strinfifiedUserDetails);
};

export const getUserFromLocalStorage = () => {
  const data = localStorage.getItem("baqala-user");
  const userDetails = JSON.parse(data);
  return userDetails === null ? {} : userDetails;
};

export const deleteUserFromLocalStorage = () => {
  localStorage.removeItem("baqala-user");
  return;
};
