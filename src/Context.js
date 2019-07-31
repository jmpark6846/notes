import React from "react";

export const initialUser = {
  uid: null,
  email: null,
  username: null,
  isLoggedIn: false,
  isLoading: true,
}
export const userContext = React.createContext(initialUser);