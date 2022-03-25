// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, RouteComponentProps } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { findIana } from 'windows-iana';
import { Event, MeetingMessageType } from 'microsoft-graph';
import { AuthenticatedTemplate } from '@azure/msal-react';
import { add, format, getDay, parseISO } from 'date-fns';
import { endOfWeek, startOfWeek } from 'date-fns/esm';

import { getUserWeekCalendar } from './GraphService';
import { Meeting, useAppContext } from './AppContext';
import CalendarDayRow from './CalendarDayRow';
import './Calendar.css';

export default function Calendar(props: RouteComponentProps) {
  const app = useAppContext();

  const [events, setEvents] = useState<Meeting[]>();

  // <ReturnSnippet>
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(weekStart);

  return (
    <></>
  );
  // </ReturnSnippet>
}
