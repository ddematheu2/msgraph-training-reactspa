// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { MsalProvider } from '@azure/msal-react'
import { IPublicClientApplication } from '@azure/msal-browser';

import ProvideAppContext from './AppContext';
import ErrorMessage from './ErrorMessage';
import NavBar from './NavBar';
import Welcome from './Welcome';
import NewEvent from './NewEvent';
import 'bootstrap/dist/css/bootstrap.css';
import CallScreen from './CallScreen';
import { RouteComponentProps } from 'react-router-dom';
import Register from './Register';

// <AppPropsSnippet>
type AppProps= {
  pca: IPublicClientApplication
};
// </AppPropsSnippet>

export default function App({ pca }: AppProps) {
  // <ReturnSnippet>
  return(
    <MsalProvider instance={ pca }>
      <ProvideAppContext>
        <Router>
          <NavBar />
          <Container>
            <ErrorMessage />
            <Route exact path="/"
              render={(props: RouteComponentProps) =>
                <Welcome {...props} />
              } />
            <Route exact path="/create-event"
              render={(props: RouteComponentProps) =>
                <NewEvent {...props} />
              } />
            <Route exact path="/newevent"
              render={(props: RouteComponentProps) =>
                <NewEvent {...props} />
              } />
            <Route exact path="/register"
              render={(props: RouteComponentProps) =>
                <Register {...props} />
              } />
            <Route exact path="/join"
              render={(props: RouteComponentProps) =>
                <CallScreen {...props} />
              } />
          </Container>
        </Router>
      </ProvideAppContext>
    </MsalProvider>
  );
  // </ReturnSnippet>
}
