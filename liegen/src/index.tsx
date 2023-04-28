import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/all-styles.scss';
import Game from './components/game/Game';
import Entry from './components/lobby/Entry';
import reportWebVitals from './reportWebVitals';

// This is the extra redux functionality
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Entry />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
