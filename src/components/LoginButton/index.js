/* eslint-disable object-curly-newline */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Avatar from '@material-ui/core/Avatar';

import Button from '@arcblock/ux/lib/Button';
import { mergeProps } from '@arcblock/ux/lib/Util';

import { withSession } from '../../libs/session';

/**
 * DID:Connect component that can be used to allow user to login and display user profile
 * TODO: this component remains a class component now because hook component will crash gatsby build
 */
class LoginButton extends React.Component {
  constructor(props) {
    const newProps = mergeProps(props, LoginButton, []);
    super(newProps);
    this.state = { anchorEl: null, open: false };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.session.user && !this.props.session.user) {
      setTimeout(() => {
        this.setState({ anchorEl: null, open: false });
      });
    }
  }

  render() {
    const {
      signInText,
      signOutText,
      btnSize,
      btnColor,
      btnVariant,
      className,
      session,
      ...rest
    } = this.props;
    const { user, loading, login } = session || {};
    const { anchorEl, open } = this.state;

    if (!user) {
      const button = (
        <Button
          disableRipple
          onClick={login}
          variant={btnVariant}
          color={btnColor}
          className={`login-button ${className}`.trim()}
          disabled={loading}
          size={btnSize}>
          {signInText}
        </Button>
      );

      return <Container {...rest}>{button}</Container>;
    }

    return (
      <ClickAwayListener onClickAway={() => this.setState({ open: false, anchorEl: null })}>
        <Container {...rest}>
          <IconButton
            className="avatar-button"
            onClick={e => this.setState({ anchorEl: e.currentTarget, open: !open })}
            disableRipple>
            <Avatar className="user-avatar" variant="circle" src={user.avatar} alt={user.name} />
          </IconButton>
          {anchorEl && open && (
            <Popper open disablePortal anchorEl={anchorEl} placement="bottom-end">
              <UserProfile>
                <Avatar
                  className="user-avatar"
                  variant="circle"
                  src={user.avatar}
                  alt={user.name}
                />
                <Typography className="user-name">{user.name}</Typography>
                <Button
                  className="user-logout"
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    session.logout();
                  }}>
                  {signOutText}
                </Button>
              </UserProfile>
            </Popper>
          )}
        </Container>
      </ClickAwayListener>
    );
  }
}

LoginButton.propTypes = {
  session: PropTypes.object,
  className: PropTypes.string,
  signInText: PropTypes.string,
  signOutText: PropTypes.string,
  btnSize: PropTypes.string,
  btnColor: PropTypes.string,
  btnVariant: PropTypes.string,
};

LoginButton.defaultProps = {
  session: {},
  className: '',
  signInText: 'Sign In',
  signOutText: 'Sign Out',
  btnSize: 'medium',
  btnColor: 'default',
  btnVariant: 'outlined',
};

LoginButton.contextTypes = {
  session: PropTypes.object,
};

const Container = styled.div`
  .avatar-button {
    border: none;
    background-color: transparent;
    outline: none !important;
    cursor: pointer;
    width: 48px;
    height: 48px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
  }
`;

const UserProfile = styled.div`
  margin-top: 5px;
  width: 200px;
  height: 260px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.1), -2px -2px 6px 0 rgba(0, 0, 0, 0.1);
  z-index: 99999;

  .user-avatar {
    width: 64px;
    height: 64px;
  }

  .user-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.83px;
    color: #6e6e6e;
    text-transform: capitalize;
    margin-top: 24px;
  }

  .user-name {
    font-size: 20px;
    font-weight: 900;
    text-align: center;
    color: #222222;
    margin: 8px 0 24px;
  }

  .user-did {
    margin: 0 0 16px;
  }

  .user-logout {
  }
`;

export default withSession(LoginButton);
