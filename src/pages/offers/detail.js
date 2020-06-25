/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useAsync from 'react-use/lib/useAsync';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Tag from '@arcblock/ux/lib/Tag';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';
import { parseQuery } from '../../libs/util';

import Container from '../../components/container';
import AssetDisplay from '../../components/AssetDisplay';
import InfoRow from '../../components/InfoRow';

export default function OfferDetail({ location }) {
  const query = parseQuery(location.search);

  const { t } = useContext(LocaleContext);
  const { api, session } = useContext(SessionContext);
  const offer = useAsync(async () => {
    const { data } = await api.get(`/api/offers/${query.oid}`);
    return data;
  });

  if (offer.loading || session.loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  console.log({ session, offer });

  return (
    <Div>
      <Container>
        <Typography component="h2" variant="h4" className="page-header">
          {t('detail.title')}
        </Typography>
        <Grid container spacing={5} className="offer-header">
          <Grid item xs={12} sm={6} md={3} className="offer-display">
            <AssetDisplay display={offer.value.nftDisplay} />
          </Grid>
          <Grid item xs={12} sm={6} md={9} className="offer-summary">
            <Typography component="h2" variant="h5" className="offer-title">
              {offer.value.title}
              <Tag>NFT</Tag>
            </Typography>
            <Typography component="div" className="offer-description">
              {offer.value.description}
            </Typography>
            <Typography component="div" className="offer-meta">
              <Typography component="span">
                <Button color="secondary" className="offer-action" variant="contained">
                  Buy
                </Button>
                <strong>
                  {offer.value.price} {session.token.symbol}
                </strong>
              </Typography>
              <Typography component="span" className="offer-stats">
                1 Seller
              </Typography>
            </Typography>
          </Grid>
          <Grid item md={12} className="offer-details">
            <InfoRow name="Address">{offer.value.assetDid}</InfoRow>
            <InfoRow name="Owner">{offer.value.ownerDid}</InfoRow>
            <InfoRow name="Creator">{offer.value.issuerDid}</InfoRow>
            <InfoRow name="Created At">{offer.value.issuanceDate}</InfoRow>
            <InfoRow name="Listed At">{offer.value.createdAt}</InfoRow>
            <InfoRow name="Platform">{offer.value.issuerName}</InfoRow>
            <InfoRow name="Types">
              {offer.value.nftTypes.map(x => (
                <Tag key={x} className="offer-badge">
                  {x}
                </Tag>
              ))}
            </InfoRow>
          </Grid>
        </Grid>
      </Container>
    </Div>
  );
}

OfferDetail.propTypes = {
  location: PropTypes.object.isRequired,
};

const Div = styled.div`
  min-height: 84vh;

  .page-header {
    margin-bottom: 32px;
    font-weight: bold;
  }

  .offer-display {
  }

  .offer-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .offer-title {
      font-weight: bold;
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      span {
        margin-left: 8px;
      }
    }

    .offer-description {
      flex-grow: 1;
      margin-bottom: 24px;
    }

    .offer-meta {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .offer-action {
        margin-right: 24px;
        box-shadow: none;
        border-radius: 3px;
      }
    }
  }

  .offer-details {
    .offer-badge {
      margin-right: 8px;
    }
  }
`;
