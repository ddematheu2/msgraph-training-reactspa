// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <NewEventSnippet>
import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, Redirect, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Attendee, Event } from 'microsoft-graph';
import { createEvent, getMeeting, createRegistration } from './GraphService';
import { Meeting, useAppContext } from './AppContext';
import { join } from 'path';

export default function NewEvent(props: RouteComponentProps) {
  const app = useAppContext();

  const [subject, setSubject] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [body, setBody] = useState('');
  const [meetingId, setMeetingId] = useState<string|undefined>(undefined)
  const [joinUrl, setjoinUrl] = useState<string|undefined>(undefined)
  const [registration, setRegistration] = useState(false);
  const [formDisabled, setFormDisabled] = useState(true);

  useEffect(() => {
    setFormDisabled(
      subject.length === 0 ||
      start.length === 0 ||
      end.length ===0);
  }, [subject, start, end]);

  const doCreate = async () => {

    const newEvent: Event = {
      subject: subject,
      // Specify the user's time zone so
      // the start and end are set correctly
      start: {
        dateTime: start,
        timeZone: app.user?.timeZone
      },
      end: {
        dateTime: end,
        timeZone: app.user?.timeZone
      },
      // Only add if a body was given
      body: body.length > 0 ? {
        contentType: 'text',
        content: body
      } : undefined,
      allowNewTimeProposals: true,
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness"
    };

    try {
      let event = await createEvent(app.authProvider!, newEvent);
      console.log(event);
      if(event.onlineMeeting?.joinUrl)
      {
        let meeting = await getMeeting(app.authProvider!, event.onlineMeeting?.joinUrl)
        console.log(meeting);
        if(registration)
        {
          let meetingRegistration = await createRegistration(app.authProvider!, meeting.id!)
          console.log(meetingRegistration);
        }
        if(meeting && app.setMeetings)
        {
          const temp = [
            ...app.meetings!,
            {
              meeting: meeting,
              registration: registration ? true : false
            }
          ]
          app.setMeetings(temp)
          setMeetingId(meeting.id!)
          setjoinUrl(meeting.joinWebUrl!)
        }
      }
    } catch (err) {
      app.displayError!('Error creating event', JSON.stringify(err));
    }
  };

  return(
    <>
      <Form>
        <Form.Group>
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text"
            name="subject"
            id="subject"
            className="mb-2"
            value={subject}
            onChange={(ev) => setSubject(ev.target.value) } />
        </Form.Group>
        <Row className="mb-2">
          <Col>
            <Form.Group>
              <Form.Label>Start</Form.Label>
              <Form.Control type="datetime-local"
                name="start"
                id="start"
                value={start}
                onChange={(ev) => setStart(ev.target.value) } />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>End</Form.Label>
              <Form.Control type="datetime-local"
                name="end"
                id="end"
                value={end}
                onChange={(ev) => setEnd(ev.target.value) } />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Body</Form.Label>
          <Form.Control as="textarea"
            name="body"
            id="body"
            className="mb-3"
            style={{ height: '10em' }}
            value={body}
            onChange={(ev) => setBody(ev.target.value) } />
        </Form.Group>
        <Form.Group>
          <Form.Check type="checkbox" label="Enable Registration" onChange={() => {setRegistration(!registration)}}/>
        </Form.Group>
        <br/>
        <Button color="primary"
          className="me-2"
          disabled={formDisabled}
          onClick={() => doCreate()}>Create</Button>
        <RouterNavLink to="/calendar"
          className="btn btn-secondary"
          exact>Cancel</RouterNavLink>
      </Form>
      <br/>
      {meetingId && registration && <button><RouterNavLink to={"/register?meeting=" + meetingId} className="nav-link" exact>Register for Event</RouterNavLink></button>}
      {meetingId && !registration && <button><RouterNavLink to={"/join?url=" + joinUrl} className="nav-link" exact>Join Event</RouterNavLink></button>}
    </>
  );
}
// </NewEventSnippet>
