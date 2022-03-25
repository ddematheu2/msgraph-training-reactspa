// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <WelcomeSnippet>
import {
  Button,
  Container,
  Table
} from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './AppContext';
import CalendarDayRow from './CalendarDayRow';
import { isToday, startOfWeek } from 'date-fns';

export default function Welcome(props: RouteComponentProps) {
  const app = useAppContext();
  console.log(app.meetings?.length)
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <Container fluid>
        <h1>Welcome to Contoso Events</h1>
        <p className="lead">
          This sample shows you how to leverage Graph and ACS to schedule Teams powered events and join them within your platform.
        </p>
        <AuthenticatedTemplate>
          <div>
            <h4>Welcome {app.user?.displayName || ''}!</h4>
            <p>Use the navigation bar at the top of the page create an event.</p>
          </div>
          { app.meetings && app.meetings && <Table size="sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
                <CalendarDayRow
                timeFormat={app.user?.timeFormat!}
                events={app.meetings}
                />
            </tbody>
          </Table> }
          {app.meetings?.length! <= 0 && <div style={{textAlign:'center'}}>No events yet! Check back later!</div>}
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Button color="primary" onClick={app.signIn!}>Click here to sign in</Button>
        </UnauthenticatedTemplate>
      </Container>
    </div>
  );
}
// </WelcomeSnippet>
