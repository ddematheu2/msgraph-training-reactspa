// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <NewEventSnippet>
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink as RouterNavLink, Redirect, RouteComponentProps } from 'react-router-dom';
import { useAppContext } from './AppContext';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapter, CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import * as QueryString from "query-string"

interface UserObject {
  userId: CommunicationUserIdentifier,
  credential: AzureCommunicationTokenCredential,
}

export default function CallScreen(props: RouteComponentProps) {
  const params = QueryString.parse(props.location.search);
  const app = useAppContext();
  const [user, setUser] = useState<UserObject>()
  const [adapter, setAdapter] = useState<CallAdapter>();
  const displayName = "Event Attendee";
  const url = params.url ? String(params.url) : "";

  useEffect(() => {
    fetch('https://test-acs-auth.azurewebsites.net/api/ACSTestFunction?')
    .then(response => response.json())
    .then(data => {
        const credential = new AzureCommunicationTokenCredential(data.userToken.token)
        setUser({ 
            userId: {communicationUserId: data.userId.communicationUserId},
            credential: credential
         })
    });
  }, [])

  useEffect(() => {
      if (user && displayName) {
        const createAdapter = async (user: UserObject): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter({
              userId: user?.userId,
              displayName, // Max 256 Characters
              credential: user.credential,
              locator: { meetingLink: url }
            })
          );
        };
        createAdapter(user);
      }
  }, [user]);

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '80vw' }}>
        <CallComposite
          adapter={adapter}
        />
      </div>
    );
  }
  if (user?.credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
  
}
