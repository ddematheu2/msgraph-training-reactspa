// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <NewEventSnippet>
import { useEffect, useMemo, useState } from 'react';
import { NavLink as RouterNavLink, Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Attendee, Event } from 'microsoft-graph';
import { createEvent } from './GraphService';
import { useAppContext } from './AppContext';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapter, CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export default function CallScreen(props: RouteComponentProps) {
  const app = useAppContext();
  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNCIsIng1dCI6IlJDM0NPdTV6UENIWlVKaVBlclM0SUl4Szh3ZyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjk5Yzc2N2QxLWE2ZTEtNDBkYy1hMDdmLTRhZjMzYzc5ZmNkZF8wMDAwMDAxMC01ODUzLWNiZDUtNzFiZi1hNDNhMGQwMDEyNDUiLCJzY3AiOjE3OTIsImNzaSI6IjE2NDgwNjY5NjMiLCJleHAiOjE2NDgxNTMzNjMsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiI5OWM3NjdkMS1hNmUxLTQwZGMtYTA3Zi00YWYzM2M3OWZjZGQiLCJpYXQiOjE2NDgwNjY5NjN9.DFBlxn8gN9xTkFQyjyUtOdO7eaHMe5ROz0sUPdUYeI5REHQyIRq3vlpB7SquzfrA_k1XTV_Q3qshNF042acemFl7JqV9wFp1SY3ysGVOGJh88_j_C13tmaPulBXXFdSRZ2WC_gGQJWVQWtqxs1tfUUdQoFLFWYEE_sm51S7tIAhWsxSmzDVxGsPYNhujhiXMBV0vYc0rtUO89fYniU04OL2VbP3WrYDMRmqX9rquiNRSzBHe8mxdZaKi4GKAnFA36g4_arHwyLyX1MR6lzlW4S02jldETCPMaBNzBhNR1t3q6ARfVkuJY_N1Ol2xMJ-BwlacV1tiMz9czbu47KJ0uQ";
  const locator = app.curEvent?.onlineMeeting?.joinUrl;
  const displayName = app.user?.displayName;
  const userId = {communicationUserId:"8:acs:99c767d1-a6e1-40dc-a07f-4af33c79fcdd_00000010-5853-cbd5-71bf-a43a0d001245"};

  const [adapter, setAdapter] = useState<CallAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      if (!!credential && locator && displayName) {
        const callLocator = isTeamsMeetingLink(locator)
          ? { meetingLink: locator }
          : { groupId: locator };
        const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter({
              userId: userId,
              displayName: displayName, // Max 256 Characters
              credential,
              locator: callLocator
            })
          );
        };
        createAdapter(credential);
      }
    })();
  }, [props, credential]);

  useEffect(() => {
    return () => {
      (async () => {
        if (!adapter) {
          return;
        }
        await adapter.leaveCall().catch((e) => {
          console.error('Failed to leave call', e);
        });
        adapter.dispose();
      })();
    };
  }, [adapter]);

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '100vw' }}>
        <CallComposite
          adapter={adapter}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
  
}
