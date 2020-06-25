/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

import Container from '@material-ui/core/Container';

export default function CustomizedContainer({ children, ...rest }) {
  return <Div {...rest}>{children}</Div>;
}

const Div = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;

  @media (min-width: ${props => props.theme.breakpoints.values.sm}px) {
    padding-left: 0;
    padding-right: 0;
  }
`;
