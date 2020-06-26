/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tag from '@arcblock/ux/lib/Tag';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import InfoRow from '../InfoRow';

export default function OrdersList({ orders }) {
  const { locale } = useContext(LocaleContext);

  if (orders.length === 0) {
    return (
      <Typography>
        No orders yet, go <Link to={`/${locale}/orders`}>here</Link> to find some thing interesting!
      </Typography>
    );
  }

  return (
    <Div>
      <Grid container spacing={5}>
        {orders.map(x => (
          <Grid item md={6} sm={12} key={x._id}>
            <Paper className="order">
              <InfoRow name="Address">{x.assetDid}</InfoRow>
              <InfoRow name="Offer">{x.offerId}</InfoRow>
              <InfoRow name="Status">
                <Tag>{x.status}</Tag>
              </InfoRow>
              <InfoRow name="Price">{x.amount}</InfoRow>
              <InfoRow name="Created At">{x.createdAt}</InfoRow>
              <InfoRow name="Token Input Tx">{x.tokenInputHash}</InfoRow>
              <InfoRow name="Token Output Tx">{x.tokenOutputHash}</InfoRow>
              <InfoRow name="Asset Output Tx">{x.assetOutputHash}</InfoRow>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Div>
  );
}

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Div = styled.div`
  .order {
    padding: 16px;
  }
`;
