/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import useAsync from 'react-use/lib/useAsync';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import Button from '@arcblock/ux/lib/Button';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';

import Container from '../../components/container';
import AssetDisplay from '../../components/AssetDisplay';

export default function OffersList() {
  const { locale } = useContext(LocaleContext);
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

  return (
    <Div>
      <Container>
        <div className="thumbs">
          {offers.value.map(x => (
            <div className="thumb" key={x._id}>
              <Link to={`${locale}/offers/detail?oid=${x._id}`}>
                <div className="logo-container">
                  <AssetDisplay display={x.nftDisplay} />
                </div>
              </Link>{' '}
              <div className="thumb-bottom">
                <div className="name">
                  <Link to={`${locale}/offers/detail?oid=${x._id}`} title={x.nftTitle}>
                    {x.nftTitle}
                  </Link>
                  <span rounded color="secondary" variant="contained" size="small" className="tag">
                    Buy
                  </span>
                </div>
                <div className="platform-line">
                  <span>1 Seller</span>{' '}
                  <span className="text-secondary">
                    {x.price}
                    <span> ABT</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Div>
  );
}

const Div = styled.div`
  min-height: 84vh;

  .thumbs {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    margin-left: -20px;
    margin-right: -30px;

    .thumb {
      width: 232px;
      margin-left: 24px;
      margin-right: 24px;
      margin-bottom: 24px;

      a {
        cursor: pointer;
        color: #4d559e;
      }

      .logo-container {
        border-radius: 6px;
        height: 314px;
        width: 232px;
        line-height: 314px;
        text-align: center;
        transition: all 0.2s ease-in-out;
        background-color: #8689ab36;

        .nft-display {
          border-radius: 5px;
          transition: filter 0.2s ease-in-out;
          height: 314px;
        }
      }
    }

    .thumb-bottom {
      padding-top: 10px;

      .name {
        display: flex;
        justify-content: space-between;
        font-size: 15px;

        a {
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .tag {
          background-color: #33bfb4;
          flex-shrink: 0;
          height: 22px;
          line-height: 20px;
          font-size: 12px;
          border-radius: 2px;
          padding: 2px 8px;
          color: #fff;
          text-transform: uppercase;
        }
      }

      .platform-line {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-top: 5px;

        .text-secondary {
          color: #8f8f8f;
        }
      }
    }
  }
`;
