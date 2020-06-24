/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

export default function HTML({ headComponents, body, postBodyComponents }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="/icons/css/all.css" />
        {headComponents}
      </head>
      <body>
        <div id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  headComponents: PropTypes.any.isRequired,
  body: PropTypes.any.isRequired,
  postBodyComponents: PropTypes.any.isRequired,
};
