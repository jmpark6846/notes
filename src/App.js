import React from "react";
import { Pane, majorScale, minorScale, Heading } from "evergreen-ui";

function App() {
  return (
    <Pane display="flex" height="100%">
      <Pane
        width={240}
        height="100%"
        background="tint1"
        display="flex"
        flexDirection="column"
      >
        <Pane padding={minorScale(4)} background="tint1">
          control panel
        </Pane>
        <Pane padding={minorScale(4)} background="blueTint" flex={1}>
          Page sidebar
        </Pane>
        <Pane padding={minorScale(4)} height={majorScale(7)} background="tint1">
          button  
        </Pane>
      </Pane>
      <Pane flex={1} display="flex" flexDirection="column">
        <Pane padding={minorScale(4)} background="yellowTint">
          breadcumb(needs to be implemented)
        </Pane>
        <Pane padding={minorScale(4)} flex={1}>
          <Pane width={730}  marginX="auto" marginTop={60}>
            <Pane marginBottom={45}>
              <Heading size={900}>Getting Started(title)</Heading>
            </Pane>
            <Pane>this is where a editor goes in</Pane>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default App;
