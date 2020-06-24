/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/IconButton';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import Link from '@arcblock/www/src/components/link';
import Language from '@arcblock/www/src/components/language';

import { Wrapper, Div } from '@arcblock/www/src/components/layouts/headers/default';
import {
  Wrapper as MobileWrapper,
  Div as MobileDiv,
} from '@arcblock/www/src/components/layouts/headers/mobile';
import { DropdownDiv, renderDropdownItem } from '@arcblock/www/src/components/layouts/headers/util';
import LoginButton from './LoginButton';

const MenuDropdown = ({ links, dark, onRedirect }) => (
  <DropdownDiv className="menu-item__dropdown" dark={dark}>
    <ul className="dropdown-items">
      {links.map(x => (
        <li key={x.href} className="dropdown-item">
          <Link
            to={x.href}
            absolute={x.absolute}
            onClick={onRedirect}
            className="dropdown-item__text">
            {renderDropdownItem(x.text)}
          </Link>
        </li>
      ))}
    </ul>
  </DropdownDiv>
);

const MenuItems = ({ dark, links, locale, onRedirect, disableI18n }) => (
  <ul className={`menu-items menu-items--${locale}`}>
    {links.map(x => {
      if (Array.isArray(x.items) && x.items.length) {
        return (
          <li key={x.href} className="menu-item menu-item--has-dropdown">
            <span className="menu-item__text">{x.text}</span>
            <MenuDropdown links={x.items} dark={dark} onRedirect={onRedirect} />
          </li>
        );
      }

      return (
        <li key={x.href} className="menu-item">
          <Link
            to={x.href}
            onClick={onRedirect}
            absolute={x.absolute}
            disableI18n={disableI18n}
            className="menu-item__text">
            {x.text}
          </Link>
        </li>
      );
    })}
  </ul>
);

export default function CustomHeader({
  logo,
  links,
  properties,
  sticky,
  dark,
  locale,
  disableI18n,
}) {
  const { t, originalPath } = React.useContext(LocaleContext);
  const [width, setWidth] = useState(959);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setWidth(
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    );
  }, []);

  if (width >= 960) {
    return (
      <Wrapper sticky={sticky} dark={dark} customHeader>
        <Div sticky={sticky} dark={dark} customHeader>
          {logo}
          <MenuItems
            links={links}
            properties={properties}
            dark={dark}
            locale={locale}
            disableI18n={disableI18n}
          />
          <div className="user">
            {!disableI18n && <Language dark={dark} originalPath={originalPath} />}
            <LoginButton
              locale={locale}
              btnSize="small"
              btnColor={dark ? 'primary' : 'default'}
              signInText={t('menu.login')}
              signOutText={t('menu.logout')}
              className="login-button"
            />
          </div>
        </Div>
      </Wrapper>
    );
  }

  return (
    <MobileWrapper sticky={sticky} dark={dark} isOpen={open}>
      <MobileDiv sticky={sticky || open} dark={dark} style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div className="menu-top">
          {logo}
          <div className="menu-top__right">
            {!disableI18n && <Language dark={dark} originalPath={originalPath} />}
            <LoginButton
              locale={locale}
              btnSize="small"
              btnColor={dark ? 'primary' : 'default'}
              signInText={t('menu.login')}
              signOutText={t('menu.logout')}
              className="login-button"
            />
            <Button className="menu-top__trigger" onClick={() => setOpen(!open)}>
              <MenuIcon />
            </Button>
          </div>
        </div>
        {open && (
          <MenuItems
            links={links}
            properties={properties}
            dark={dark}
            locale={locale}
            disableI18n={disableI18n}
            onRedirect={() => setOpen(false)}
          />
        )}
      </MobileDiv>
    </MobileWrapper>
  );
}

CustomHeader.propTypes = {
  locale: PropTypes.string.isRequired,
  links: PropTypes.array,
  sticky: PropTypes.bool,
  dark: PropTypes.bool,
  disableI18n: PropTypes.bool,
  logo: PropTypes.any,
  properties: PropTypes.any,
};

CustomHeader.defaultProps = {
  sticky: false,
  dark: false,
  disableI18n: false,
  logo: null,
  links: [],
  properties: {},
};
