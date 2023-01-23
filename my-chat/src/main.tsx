import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import './resets.css';
import './styles/style.scss';
import './styles/variables.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
