// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <CalendarDayRowSnippet>
import React from 'react';
import { Event, OnlineMeeting } from 'microsoft-graph';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Meeting, useAppContext } from './AppContext';

type CalendarDayRowProps = {
  timeFormat: string,
  events: Meeting[],
};

interface FormatMap {
  [key: string] : string;
}

// date-fns format strings are slightly
// different than the ones returned by Graph
const formatMap: FormatMap = {
  "h:mm tt": "h:mm a",
  "hh:mm tt": "hh:mm a"
};

// Helper function to format Graph date/time in the user's
// preferred format
function formatDateTime(dateTime: string | undefined, timeFormat: string) {
  if (dateTime !== undefined) {
    const parsedDate = parseISO(dateTime);
    return format(parsedDate, formatMap[timeFormat] || timeFormat);
  }
}

export default function CalendarDayRow(props: CalendarDayRowProps) {
  const app = useAppContext();
  console.log(props.events)
  return (
    <React.Fragment>
      {props.events.map(
        function(event: Meeting, index: Number) {
          return (
            <tr key={event.meeting.id}>
              <td className="calendar-view-timespan">
                {event.meeting.startDateTime && event.meeting.endDateTime && <div>{formatDateTime(event.meeting.startDateTime, props.timeFormat)} - {formatDateTime(event.meeting.endDateTime, props.timeFormat)}</div>}
              </td>
              <td>
                <div className="calendar-view-subject">{event.meeting.subject}</div>
              </td>
              <td>
                {event.registration && <button onClick={() => {app.setSelected!(index)}}><RouterNavLink to={"/register?meeting=" + event.meeting.id} className="nav-link" exact>Register</RouterNavLink></button>}
                {!event.registration && <button onClick={() => {app.setSelected!(index)}}><RouterNavLink to={"/join?url=" + event.meeting.joinWebUrl} className="nav-link" exact>Join</RouterNavLink></button>}
              </td>
            </tr>
          )
        }
      )}
    </React.Fragment>
  );
}
// </CalendarDayRowSnippet>
