import React from 'react';
import PropTypes from 'prop-types';
import BaseInfoRow from '@arcblock/ux/lib/InfoRow';

export default function InfoRow({ name, layout, children, ...rest }) {
  return (
    <BaseInfoRow {...rest} name={name} layout={layout} nameWidth={120}>
      {children}
    </BaseInfoRow>
  );
}

InfoRow.propTypes = {
  name: PropTypes.any.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.any,
};

InfoRow.defaultProps = {
  children: null,
  layout: 'horizontal',
};
