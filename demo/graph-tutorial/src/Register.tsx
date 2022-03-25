// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <NewEventSnippet>
import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, Redirect, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Attendee, Event } from 'microsoft-graph';
import { registerAttendee} from './GraphService';
import { Registrants, useAppContext } from './AppContext';
import * as QueryString from "query-string"

export default function Register(props: RouteComponentProps) {
  const app = useAppContext();
  const params = QueryString.parse(props.location.search);
  const [email, setEmail] = useState('');
  const [formDisabled, setFormDisabled] = useState(true);
  const [registered , setRegistered] = useState<Registrants | undefined>();

  useEffect(() => {
    setFormDisabled(
      email.length === 0 )
  }, [email]);

  const register = async () => {
    if(app.meetings)
    {
      let registration = await registerAttendee(app.authProvider!, email, String(params.meeting));

      if(registration)
      {
        let registrant = {
          email: email,
          joinUrl: registration.joinWebUrl
        }
        console.log(registrant)
        setRegistered(registrant);
        //app.setRegistrants!(...app.registrants!, registrant)
      }
    } 
  };

  if(registered){
    //setFormDisabled(true)
  }

  return(
    <>
      <Form>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="text"
            name="email"
            id="email"
            className="mb-2"
            value={email}
            onChange={(ev) => setEmail(ev.target.value) } />
        </Form.Group>
        <Button color="primary"
          className="me-2"
          disabled={formDisabled}
          onClick={() => register()}>Register</Button>
        <RouterNavLink to="/"
          className="btn btn-secondary"
          exact>Cancel</RouterNavLink>
      </Form>
      <br/>
      <div>
        {registered && <button><RouterNavLink to={"/join?url=" + registered.joinUrl} className="nav-link" exact>Join Event</RouterNavLink></button>}
      </div>
    </>
  );
}
// </NewEventSnippet>
