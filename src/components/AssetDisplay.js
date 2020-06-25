import React from 'react';
import PropTypes from 'prop-types';
import pako from 'pako';
import { fromBase64 } from '@arcblock/forge-util';

const getNFTDisplay = display => {
  try {
    if (display.type === 'svg_gzipped' && display.content) {
      const buffer = pako.ungzip(fromBase64(display.content), {});
      return Buffer.from(buffer).toString('utf8');
    }

    return `Unsupported display protocol: ${display.type}`;
  } catch (err) {
    return null;
  }
};

export default function AssetDisplay({ display }) {
  const nftDisplay = getNFTDisplay(display);

  return <div className="nft-display" dangerouslySetInnerHTML={{ __html: nftDisplay }} />;
}

AssetDisplay.propTypes = {
  display: PropTypes.object.isRequired,
};

AssetDisplay.defaultProps = {};
