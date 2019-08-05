import React from "react";
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Sidebar from "./Sidebar";

afterEach(cleanup)

test('matches snapshot ', () => {
  const { asFragment } = render(<Sidebar noteList={[]}/>)
  expect(asFragment()).toMatchSnapshot()
})

