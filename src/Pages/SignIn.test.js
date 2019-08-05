import React from "react";
import { render, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router} from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import SignInPage from "./SignInPage";

afterEach(cleanup)

test('matches snapshot ', () => {
  const { asFragment } = render(<Router><SignInPage /></Router>)
  expect(asFragment()).toMatchSnapshot()
})


test('should fire post request when click signin button', () => {
  const { queryByPlaceholderText } = render(<Router><SignInPage /></Router>)
  const emailInputElement = queryByPlaceholderText("이메일")
  const passwordInputElement = queryByPlaceholderText("비밀번호")

  emailInputElement.value = "test@test.test"
  fireEvent.change(emailInputElement)

  passwordInputElement.value = "password"
  fireEvent.change(passwordInputElement)

  fireEvent.click(("로그인"))
})
