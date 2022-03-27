import React from 'react';
import ReactDOM from 'react-dom';
import { WalletProvider } from '@tezos-contrib/react-wallet-provider';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider name="teztok-8bidou-demo" clientType="beacon">
        <App />
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
