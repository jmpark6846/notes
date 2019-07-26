import React, { Component } from "react";
import { Pane, majorScale, minorScale, Heading, Menu, Text, Button } from "evergreen-ui";

export default class NotePage extends Component {
  render() {
    return (
      <Pane display="flex" height="100%">
        <Pane
          width={240}
          height="100%"
          background="tint1"
          display="flex"
          flexDirection="column"
        >
          <Pane paddingX={minorScale(4)} background="tint1">
            <Menu>
              <Menu.Group>
                <Menu.Item icon="search">검색하기</Menu.Item>
              </Menu.Group>
            </Menu>
          </Pane>
          <Pane paddingX={minorScale(4)} background="blueTint" flex={1} overflowX="hidden" overflowY="auto">
            <Menu>
              <Menu.Group>
              <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
                <Menu.Item><Text>Getting Started</Text></Menu.Item>
              </Menu.Group>
            </Menu>
          </Pane>
          <Pane
            paddingX={minorScale(4)}
            background="tint1"
          >
            <Menu>
              <Menu.Group>
                <Menu.Item icon="edit">새 노트 작성하기</Menu.Item>
              </Menu.Group>
            </Menu>
            {/* <Button margin="auto" width="100%" display="block" height={40} appearance="minimal" iconBefore="edit" background="tint2">노트 추가하기</Button> */}
          </Pane>
        </Pane>
        <Pane flex={1} display="flex" flexDirection="column">
          <Pane padding={minorScale(4)} background="yellowTint">
            breadcumb(needs to be implemented)
          </Pane>
          <Pane padding={minorScale(4)} flex={1}>
            <Pane width={730} marginX="auto" marginTop={60}>
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
}
