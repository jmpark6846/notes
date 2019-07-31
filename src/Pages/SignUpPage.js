import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Pane, TextInput, Heading, Button, Text } from "evergreen-ui";

import firebase from "../db";

class SignUpPage extends Component {
  state = {
    email: "",
    password: "",
    username: "",
    errorMessage: ""
  };
  _handleSignup = async () => {
    try {
      let { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      await user.updateProfile({
        displayName: this.state.username
      });
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
          paddingX={50}
          elevation={3}
          width={400}
          border="default"
        >
          <Heading size={600} marginBottom={20} textAlign="center">
            회원가입
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
            marginBottom={10}
            value={this.state.password}
            required
          />
          <TextInput
            name="username"
            onChange={this._handleChange}
            placeholder="이름"
            marginBottom={10}
            width="100%"
            value={this.state.username}
            required
          />

          <Pane intent="danger" padding={10}>
            <Text color="red">{this.state.errorMessage}</Text>
          </Pane>
          <Pane display="flex" justifyContent="flex-end" marginTop={20}>
            <Button
              marginRight={10}
              onClick={() => this.props.history.push("/signin")}
            >
              돌아가기
            </Button>
            <Button
              appearance="primary"
              intent="none"
              onClick={this._handleSignup}
            >
              가입하기
            </Button>
          </Pane>
        </Pane>
      </Pane>
    );
  }
}

export default withRouter(SignUpPage);
