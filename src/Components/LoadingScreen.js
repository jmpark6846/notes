import React from "react";
import { Pane, Spinner } from "evergreen-ui";

export default function LoadingScreen() {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={400}
    >
      <Spinner />
    </Pane>
  );
}
