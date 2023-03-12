import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.scss';
import Game from './components/Game';
import reportWebVitals from './reportWebVitals';
import App2 from './App2';

// This is the extra redux functionality
import store from "./store";
import { Provider } from "react-redux";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Game />
      {/* <App2 /> */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
