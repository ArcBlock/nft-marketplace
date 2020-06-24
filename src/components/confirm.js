import React from 'react';
import PropTypes from 'prop-types';

import Button from '@arcblock/ux/lib/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmDialog({
  title,
  description,
  cancel,
  confirm,
  color,
  params: initialParams,
  onCancel,
  onConfirm,
}) {
  const [params, setParams] = React.useState(initialParams);
  const [open, setOpen] = React.useState(true);

  const onCallback = cb => {
    setOpen(false);
    if (typeof cb === 'function') {
      cb(params);
    }
  };

  const t = typeof title === 'function' ? title() : title;
  const d = typeof description === 'function' ? description(params, setParams) : description;

  return (
    <Dialog open={open}>
      <DialogTitle>{t}</DialogTitle>
      <DialogContent>
        <DialogContentText>{d}</DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 24px' }}>
        <Button onClick={() => onCallback(onCancel)} color="default" rounded>
          {cancel}
        </Button>
        <Button
          onClick={() => onCallback(onConfirm)}
          color={color}
          variant="outlined"
          autoFocus
          rounded>
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  title: PropTypes.any.isRequired,
  description: PropTypes.any.isRequired, // can be a function that renders different content based on params
  cancel: PropTypes.string,
  color: PropTypes.string,
  confirm: PropTypes.string,
  params: PropTypes.object, // This object holds states managed in the dialog
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmDialog.defaultProps = {
  onCancel: () => {},
  cancel: 'Cancel',
  confirm: 'Confirm',
  color: 'danger',
  params: {},
};
