import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { act } from '@testing-library/react';

it('renders without crashing', () => {
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<App />, div);  
  })
  
  ReactDOM.unmountComponentAtNode(div);
});


test('sidebar 100% on left', () => {
  
})
