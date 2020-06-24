import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QRCode from 'qrcode.react';

export default function AlertDialog({ url, ...rest }) {
  return (
    <Dialog open {...rest}>
      <DialogTitle style={{ textAlign: 'center' }}>
        你也可以请朋友扫描下面的二维码领取赠票
      </DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <DialogContentText style={{ textAlign: 'center' }}>
          <Typography component="h2" variant="h5" color="textPrimary">
            你有一张价值 100 ABT的区块链门票待领取
          </Typography>
        </DialogContentText>
        <DialogContentText style={{ textAlign: 'center' }}>
          <Typography component="p" variant="body1" color="textSecondary">
            该门票为 ArcBlock DevCon 2020 贵宾票，持有该票将享有：畅听 ArcBlock DevCon2020
            所有演讲、免费获取 ArcBlock 新书以及 ABT 空投等多项权益。
          </Typography>
        </DialogContentText>
        <DialogContentText style={{ textAlign: 'center' }}>
          <QRCode size={256} renderAs="svg" level="M" value={url} />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  url: PropTypes.any.isRequired,
};

AlertDialog.defaultProps = {};
