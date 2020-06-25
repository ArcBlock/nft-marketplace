/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getColor } from '@arcblock/ux/lib/Util';

import Language from '@arcblock/www/src/components/language';
import Link from '@arcblock/www/src/components/link';
import BaseLayout from '@arcblock/www/src/components/layouts/default';
import CustomFooter from '@arcblock/www/src/components/custom/footer';

import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Logo from '@arcblock/ux/lib/Logo';
import WechatPrompt from '@arcblock/ux/lib/WechatPrompt';

import CustomHeader from './header';
import { SessionContext } from '../libs/session';

export const PageLogo = ({
  title,
  logoImage,
  logoColor,
  disableHeader,
  darkHeader,
  headerProps,
  disableI18n,
  originalPath,
}) => {
  if (!headerProps && !disableHeader) {
    return null;
  }

  if (headerProps) {
    const logoLink = 'https://www.arcblock.io';
    const devConLink = '/';
    if (logoImage) {
      return (
        <div className="logo">
          <Link to={logoLink} disableI18n={disableI18n}>
            <img className="logo__image" src={logoImage.publicURL || logoImage} alt={title} />
          </Link>
        </div>
      );
    }

    if (title) {
      return (
        <div className="logo">
          <div className="logo-left">
            <Link className="logo__text" to={logoLink} disableI18n={disableI18n} target="_blank">
              <Logo showText={false} />
            </Link>
            <Link className="logo__text" to={devConLink} disableI18n={disableI18n}>
              <span className="logo__title">{title}</span>
            </Link>
          </div>
        </div>
      );
    }
  }

  const logoLink = '/';
  if (logoImage) {
    return (
      <div className="logo">
        <Link to={logoLink} disableI18n={disableI18n}>
          <img className="logo__image" src={logoImage.publicURL || logoImage} alt={title} />
        </Link>
        {!disableI18n && <Language dark={darkHeader} originalPath={originalPath} />}
      </div>
    );
  }

  if (title) {
    return (
      <div className="logo">
        <div className="logo-left">
          <div className="logo__circle" />
          <Link to={logoLink} disableI18n={disableI18n}>
            <div className="logo__text" style={{ color: logoColor }}>
              {title}
            </div>
          </Link>
        </div>
        {!disableI18n && <Language dark={darkHeader} originalPath={originalPath} />}
      </div>
    );
  }

  return null;
};

export const PageHeader = ({
  title,
  logoImage,
  logoColor,
  disableHeader,
  disableLogin,
  darkHeader,
  headerProps,
  locale,
  disableI18n,
  originalPath,
}) => {
  const logo = (
    <PageLogo
      title={title}
      logoImage={logoImage}
      logoColor={logoColor}
      disableHeader={disableHeader}
      disableLogin={disableLogin}
      headerProps={headerProps}
      locale={locale}
      disableI18n={disableI18n}
      originalPath={originalPath}
    />
  );

  if (!headerProps) {
    return logo;
  }

  return (
    <CustomHeader
      dark={darkHeader}
      locale={locale}
      logo={logo}
      title={title}
      disableLogin={disableLogin}
      disableI18n={disableI18n}
      originalPath={originalPath}
      {...headerProps}
    />
  );
};

export const PageFooter = ({ footerProps, disableI18n }) => {
  if (!footerProps) {
    return null;
  }

  return <CustomFooter disableI18n={disableI18n} {...footerProps} />;
};

export default function Layout({ children, location, pageContext }) {
  const { session } = React.useContext(SessionContext);
  const {
    logoColor,
    pageType = 'product',
    disableLogin = false,
    disableHeader = false,
    disableFooter = false,
    darkHeader = false,
    disableI18n = false,
  } = {};

  const { t } = useLocaleContext();

  let links;
  if (session.user) {
    links = [
      {
        text: t('menu.offers'),
        href: '/offers',
      },
      {
        text: t('menu.sell'),
        href: '/offers/create',
      },
      {
        text: t('menu.faq'),
        href: '/faq',
      },
      {
        text: t('menu.orders'),
        href: '/orders',
      },
    ];
  } else {
    links = [
      {
        text: t('menu.offers'),
        href: '/offers',
      },
      {
        text: t('menu.sell'),
        href: '/offers/create',
      },
      {
        text: t('menu.faq'),
        href: '/faq',
      },
    ];
  }

  const header = {
    properties: {},
    links,
  };

  const footer = {
    properties: {},
    links: [
      {
        text: t('footer.source'),
        href: 'https://github.com/ArcBlock/nft-marketplace',
      },
      {
        text: t('footer.abtnode'),
        href: 'https://www.arcblock.io/en/node',
      },
      {
        text: t('footer.blocklets'),
        href: 'https://blocklet.arcblock.io',
      },
      {
        text: t('footer.framework'),
        href: 'https://www.arcblock.io/en/forge-sdk',
      },
    ],
  };

  const title = 'NFT Marketplace';

  return (
    <BaseLayout
      location={location}
      header="default"
      title={title}
      disableLogin={disableLogin}
      disableHeader={!!header || disableHeader}
      disableFooter={!!footer || disableFooter}
      darkHeader={darkHeader}>
      <Div hasBackground={false} pageType={pageType} customHeader={!!header} dark={darkHeader}>
        <WechatPrompt />
        <PageHeader
          title={title}
          logoImage={null}
          logoColor={logoColor}
          disableHeader={disableHeader}
          disableLogin={disableLogin}
          headerProps={header}
          locale={pageContext.locale}
          disableI18n={disableI18n}
          originalPath={pageContext.originalPath}
        />
        {children}
        <PageFooter footerProps={footer} disableI18n={disableI18n} />
      </Div>
    </BaseLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};

const Div = styled.div`
  .header-image {
    position: fixed !important;
    width: 100%;
    height: 100vh;
    min-height: 1024px;
    z-index: -1;
  }

  .logo {
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: ${props => (props.customHeader ? 0 : 24)}px;
    margin-right: ${props => (props.customHeader ? 24 : 8)}px;
    margin-bottom: ${props => (props.customHeader ? 0 : -90)}px;
    position: relative;
    padding-left: ${props => (props.customHeader ? 0 : 24)}px;
    padding-right: ${props => (props.customHeader ? 0 : 24)}px;

    @media screen and (max-width: ${props => props.theme.breakpoints.values.lg}px) {
      margin-left: 0;
    }

    .logo__image {
      width: auto;
      height: 40px;
    }

    .logo__circle {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      border-radius: 50%;
      background: #d8d8d8;
      margin-right: 2vw;
    }

    .logo__text {
      height: 52px;
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 900;
      color: ${props => getColor(props)};
      font-family: Avenir;
      text-transform: uppercase;
      svg {
        width: 45px;
      }
      .logo__title {
        margin-left: 10px;
      }
      @media screen and (max-width: ${props => props.theme.breakpoints.values.sm}px) {
        font-size: 1rem;
        svg {
          width: 30px;
        }
      }
    }

    .logo-left {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.values.md}px) {
    .action-button {
      margin-bottom: 2vw;
    }
  }
`;
