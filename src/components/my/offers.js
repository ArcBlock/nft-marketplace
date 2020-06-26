/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Typography from '@material-ui/core/Typography';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';

import AssetDisplay from '../AssetDisplay';

export default function OffersList({ offers }) {
  const { session } = useContext(SessionContext);
  const { locale } = useContext(LocaleContext);

  if (offers.length === 0) {
    return (
      <Typography>
        No offers yet, go <Link to={`/${locale}/offers/create`}>here</Link> to create one
      </Typography>
    );
  }

  return (
    <Div>
      {offers.map(x => (
        <div className="thumb" key={x._id}>
          <div className="logo-container">
            <AssetDisplay display={x.nftDisplay} />
          </div>
          <div className="thumb-bottom">
            <div className="name">
              <span title={x.nftTitle}>{x.nftTitle}</span>
              <span rounded color="secondary" variant="contained" size="small" className="tag">
                {x.status}
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
      ))}
    </Div>
  );
}

OffersList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Div = styled.div`
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
`;
