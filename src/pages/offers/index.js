import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import useAsync from 'react-use/lib/useAsync';

import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import SelectIcon from '@material-ui/icons/CheckBox';
import SettingsIcon from '@material-ui/icons/Settings';
import FundIcon from '@material-ui/icons/Redeem';
import CompleteIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Auth from '@arcblock/did-react/lib/Auth';
import Button from '@arcblock/ux/lib/Button';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';

import Container from '../../components/container';

export default function OffersList() {
  const { api } = useContext(SessionContext);
  const offers = useAsync(async () => {
    const { data } = await api.get('/api/offers');
    return data;
  });

  if (offers.loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return <Container>Offers List</Container>;
}
