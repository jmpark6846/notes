import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import withSizes from "react-sizes";
import { compose } from "recompose";

import { Pane, TextInput, Heading, Button, Text } from "evergreen-ui";

import firebase from "../db";
import { MOBILE_WIDTH } from "../common";

class SignInPage extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: ""
  };
  _handleSignin = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password);
      this.props.history.push("/");
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: error.message });
    }
  };

  _handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Pane background="tint1" height="100%" paddingTop={50}>
        <Pane
          background="white"
          marginX="auto"
          paddingY={30}
          paddingX={this.props.isMobile ? 15 : 50}
          elevation={3}
          width={this.props.isMobile ? "calc(100% - 30px)" : 400}
          border="default"
        >
          <Heading size={600} marginBottom={20} textAlign="center">
            로그인
          </Heading>
          <TextInput
            name="email"
            onChange={this._handleChange}
            placeholder="이메일"
            marginBottom={10}
            width="100%"
            value={this.state.email}
            required
          />
          <TextInput
            name="password"
            onChange={this._handleChange}
            placeholder="비밀번호"
            width="100%"
            type="password"
            value={this.state.password}
            required
          />
          <Pane intent="danger" padding={10}>
            <Text color="red">{this.state.errorMessage}</Text>
          </Pane>
          <Pane display="flex" justifyContent="flex-end" marginTop={20}>
            <Button
              marginRight={10}
              onClick={() => this.props.history.push("/signup")}
            >
              회원가입
            </Button>
            <Button
              appearance="primary"
              intent="none"
              onClick={this._handleSignin}
            >
              로그인
            </Button>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default compose(
  withSizes(({ width }) => ({ isMobile: width < MOBILE_WIDTH })),
  withRouter
)(SignInPage);
