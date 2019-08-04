import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userContext } from "../Context";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <userContext.Consumer>
      {({ isLoggedIn, isLoading }) => (
        <Route
          {...rest}
          render={props =>
            isLoggedIn ? (
              <Component {...props} />
            ) : isLoading ? (
              <LoadingScreen />
            ) : (
              <Redirect to="/signin" />
            )
          }
        />
      )}
    </userContext.Consumer>
  );
}
 
export default ProtectedRoute;
