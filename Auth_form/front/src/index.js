import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import configureStore from './confStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import {BrowserRouter as Router} from 'react-router-dom';


const store =  configureStore();
const persistor = persistStore(store);
// persistor это локал стор 

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading = {null} persistor = {persistor}> 
        <Router>
          <App />
        </Router>
      </PersistGate>  
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
