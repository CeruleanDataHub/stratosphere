import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "./auth0-spa";
import DenimAdmin from './DenimAdmin';
import config from './auth_config.json';
import { createBrowserHistory } from "history";

import './index.css';

const onRedirectCallback = appState => {
    createBrowserHistory().push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
};

ReactDOM.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <DenimAdmin />
    </Auth0Provider>, 
document.getElementById('root'));

