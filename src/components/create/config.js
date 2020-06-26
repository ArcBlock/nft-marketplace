/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

import Alert from '@arcblock/ux/lib/Alert';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { formatError } from '../../libs/util';

export default function ConfigForm({ onSave, disabled, ...rest }) {
  const { t } = useContext(LocaleContext);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      operation: 'sell',
      price: 1,
      title: '',
      description: '',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setCurrent] = useState(null);

  const onSubmit = async data => {
    setError('');
    setLoading(true);
    try {
      await onSave(data);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  // FIXME: the operation is not implemented yet

  return (
    <Div className="form-wrapper" {...rest}>
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          style={{ display: 'none' }}
          label={t('create.form.operation')}
          placeholder={t('create.form.operationPlaceholder')}
          disabled={loading}
          error={errors.operation && !!errors.operation.message}
          inputRef={register({
            validate: value => !!value.trim() || t('create.form.operationRequired'),
          })}
          inputProps={{
            name: 'operation',
            onFocus: () => setCurrent('operation'),
          }}
          helperText={errors.operation ? errors.operation.message : ''}
          margin="normal"
        />
        <TextField
          variant="outlined"
          label={t('create.form.price')}
          placeholder={t('create.form.pricePlaceholder')}
          disabled={loading}
          error={errors.price && !!errors.price.message}
          inputRef={register({
            validate: value => Number(value.trim()) > 0 || t('create.form.priceRequired'),
          })}
          inputProps={{ name: 'price', onFocus: () => setCurrent('price') }}
          InputProps={{
            endAdornment: <InputAdornment position="end">ABT</InputAdornment>,
          }}
          helperText={errors.price ? errors.price.message : ''}
          margin="normal"
          autoFocus
        />
        <TextField
          variant="outlined"
          label={t('create.form.title')}
          placeholder={t('create.form.titlePlaceholder')}
          disabled={loading}
          error={errors.title && !!errors.title.message}
          inputRef={register({
            validate: value => !!value.trim() || t('create.form.titleRequired'),
          })}
          inputProps={{ name: 'title', onFocus: () => setCurrent('title') }}
          helperText={errors.title ? errors.title.message : ''}
          margin="normal"
        />
        <TextField
          variant="outlined"
          multiline
          label={t('create.form.description')}
          placeholder={t('create.form.descriptionPlaceholder')}
          disabled={loading}
          error={errors.description && !!errors.description.message}
          inputRef={register({
            validate: value => !!value.trim() || t('create.form.descriptionRequired'),
          })}
          inputProps={{ name: 'description', onFocus: () => setCurrent('description') }}
          helperText={errors.description ? errors.description.message : ''}
          margin="normal"
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={disabled || loading}
          size="large"
          color="primary"
          variant="contained"
          className="form-submit">
          {t('create.form.submit')} {loading && <CircularProgress size={16} />}
        </Button>
        {!!error && (
          <Alert type="error" variant="icon" error={error}>
            {error}
          </Alert>
        )}
      </form>
    </Div>
  );
}

ConfigForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ConfigForm.defaultProps = {
  disabled: false,
};

const Div = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;

  .form {
    flex: 1;
    display: flex;
    flex-direction: column;

    .form-submit {
      margin-top: 24px;
      box-shadow: none;
    }
  }
`;
