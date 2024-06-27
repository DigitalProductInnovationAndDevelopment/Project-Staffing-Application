import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './state/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import FullScreenLoader from './pages/FullScreenLoader.js';
import {SnackbarProvider} from "notistack";


// run this code only if you want to completely sweep the redux persist store
/* 
const resetStore = async () => {
  await persistor.purge(); // Clear persisted state
};
resetStore();
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullScreenLoader />} persistor={persistor}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <App />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
