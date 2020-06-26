/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import useAsync from 'react-use/lib/useAsync';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';

import Container from '../../components/container';
import AssetDisplay from '../../components/AssetDisplay';

export default function OffersList() {
  const { locale } = useContext(LocaleContext);
  const { api, session } = useContext(SessionContext);
  const offers = useAsync(async () => {
    const { data } = await api.get('/api/offers');
    return data;
  });

  if (!offers.value || offers.loading || session.loading) {
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
            <Link key={x._id} to={`/${locale}/offers/detail?oid=${x._id}`}>
              <div className="thumb">
                <div className="logo-container">
                  <AssetDisplay display={x.nftDisplay} />
                </div>
                <div className="thumb-bottom">
                  <div className="name">
                    <span title={x.nftTitle}>{x.nftTitle}</span>
                    <span
                      rounded
                      color="secondary"
                      variant="contained"
                      size="small"
                      className="tag">
                      Buy
                    </span>
                  </div>
                  <div className="platform-line">
                    <Typography component="span" className="stock">
                      1 Seller
                    </Typography>
                    <Typography component="span" color="textSecondary" className="price">
                      <strong>{x.price}</strong>
                      <span> {session.token.symbol}</span>
                    </Typography>
                  </div>
                </div>
              </div>
            </Link>
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
      margin-bottom: 32px;

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
          color: #33bfb4;
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
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-top: 5px;

        span {
          font-size: 12px;
        }
      }
    }
  }
`;
