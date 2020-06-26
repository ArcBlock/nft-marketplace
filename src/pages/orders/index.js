/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import useAsync from 'react-use/lib/useAsync';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import Tabs from '@arcblock/ux/lib/Tabs';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';

import Container from '../../components/container';
import OffersList from '../../components/my/offers';
import OrdersList from '../../components/my/orders';

export default function MyProfile() {
  const { t } = useContext(LocaleContext);
  const { api } = useContext(SessionContext);
  const [currentTab, setCurrentTab] = useState('orders');

  const state = useAsync(async () => {
    const [{ data: offers }, { data: orders }] = await Promise.all([
      api.get('/api/my/offers'),
      api.get('/api/my/orders'),
    ]);
    return { offers, orders };
  });

  const onTabChange = newTab => {
    setCurrentTab(newTab);
  };

  const tabs = [
    { label: t('my.orders'), value: 'orders' },
    { label: t('my.offers'), value: 'offers' },
  ];

  const renders = {
    offers: OffersList,
    orders: OrdersList,
  };

  const TabComponent = renders[currentTab] || renders.basic;

  if (!state.value || state.loading || state.loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Div>
      <Container>
        <Typography component="h2" variant="h5" className="page-header" color="textPrimary">
          {t('my.title')}
        </Typography>
        <Tabs tabs={tabs} current={currentTab} onChange={onTabChange} />
        <div className="page-content">
          <TabComponent {...state.value} />
        </div>
      </Container>
    </Div>
  );
}

const Div = styled.div`
  min-height: 84vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-content {
    margin-top: 16px;
  }
`;
