import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userContext } from "../App";

function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <userContext.Consumer>
      {({ isLoggedIn }) => (
        <Route
          {...rest}
          render={props =>
            isLoggedIn ? <Component {...props} /> : <Redirect to="/signin" />
          }
        />
      )}
    </userContext.Consumer>
  );
}

export default ProtectedRoute;
