import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import SelectIcon from '@material-ui/icons/CheckBox';
import SettingsIcon from '@material-ui/icons/Settings';
import FundIcon from '@material-ui/icons/Redeem';
import CompleteIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Auth from '@arcblock/did-react/lib/Auth';
import { LocaleContext } from '@arcblock/ux/lib/Locale/context';

import { SessionContext } from '../../libs/session';
import Container from '../../components/container';
import ConfigForm from '../../components/create/config';

// eslint-disable-next-line react/prop-types
function ColorStepIcon({ icon, active, completed }) {
  const icons = {
    1: <SelectIcon className="step-icon" />,
    2: <SettingsIcon className="step-icon" />,
    3: <FundIcon className="step-icon" />,
    4: <CompleteIcon className="step-icon" />,
  };

  const classNames = ['step-icon-w'];
  if (active) {
    classNames.push('step-icon-w--active');
  }
  if (completed) {
    classNames.push('step-icon-w--completed');
  }

  return <div className={classNames.join(' ')}>{icons[String(icon)]}</div>;
}

export default function CreateOffer() {
  const { session, api } = useContext(SessionContext);
  const [offerId, setOfferId] = useState(null);
  const [isProofRequired, setProofRequired] = useState(false);
  const { t, locale } = useContext(LocaleContext);
  const [activeStep, setActiveStep] = useState(0);
  const [params, setParams] = useState({
    assetDid: '',
    title: '',
    description: '',
    price: 0,
    operation: 'sell',
  });

  useEffect(() => {
    if (session.initialized && !session.user) {
      session.login();
    }
  }, [session.initialized]);

  const onNext = () => {
    setActiveStep(activeStep + 1);
  };

  const onBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderSelect = () => {
    const onSelectSuccess = result => {
      setTimeout(() => {
        setOfferId(result.oid);
        if (result.proof) {
          setProofRequired(true);
        } else {
          setActiveStep(activeStep + 1);
        }
      }, 1000);
    };

    const onProofSuccess = () => {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
      }, 1000);
    };

    if (isProofRequired) {
      return (
        <Auth
          disableClose
          key="proof"
          className="stepper-auth"
          responsive={false}
          action="prove_nft"
          checkFn={api.get}
          checkTimeout={10 * 60 * 1000}
          onSuccess={onProofSuccess}
          extraParams={{ oid: offerId }}
          locale={locale}
          messages={{
            title: t('create.proof.title'),
            scan: t('create.proof.scan'),
            confirm: t('create.proof.confirm'),
            success: t('create.proof.success'),
          }}
        />
      );
    }

    return (
      <Auth
        disableClose
        key="select"
        className="stepper-auth"
        responsive={false}
        action="select_nft"
        checkFn={api.get}
        checkTimeout={10 * 60 * 1000}
        onSuccess={onSelectSuccess}
        extraParams={{}}
        locale={locale}
        messages={{
          title: t('create.select.title'),
          scan: t('create.select.scan'),
          confirm: t('create.select.confirm'),
          success: t('create.select.success'),
        }}
      />
    );
  };

  const renderConfig = () => {
    const onSave = data => {
      setParams({ ...params, ...data });
      setActiveStep(activeStep + 1);
    };

    return <ConfigForm onSave={onSave} />;
  };

  const renderAuthorize = () => {
    const onAuthSuccess = () => {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
      }, 1000);
    };

    return (
      <Auth
        key="authorize"
        disableClose
        className="stepper-auth"
        responsive={false}
        action="authorize_nft"
        checkFn={api.get}
        checkTimeout={10 * 60 * 1000}
        onSuccess={onAuthSuccess}
        extraParams={Object.assign({ oid: offerId }, params)}
        locale={locale}
        messages={{
          title: t('create.authorize.title'),
          scan: t('create.authorize.scan'),
          confirm: t('create.authorize.confirm'),
          success: t('create.authorize.success'),
        }}
      />
    );
  };

  const renderComplete = () => (
    <div style={{ textAlign: 'center' }}>
      <img className="stepper-icon" src="/images/celebrate.png" alt="Congratulations" />
      <Typography component="h2" variant="h5" className="stepper-tip">
        {t('create.congratulation')}
      </Typography>
      <Button
        rounded
        variant="contained"
        color="primary"
        size="large"
        className="action-button"
        component={Link}
        to={`/${locale}/offers`}>
        {t('create.redirectButton')}
      </Button>
      <Button
        rounded
        variant="contained"
        color="primary"
        size="large"
        className="action-button"
        style={{ marginLeft: 32 }}
        onClick={() => window.location.reload()}>
        {t('create.listMore')}
      </Button>
    </div>
  );

  const steps = [
    {
      label: t('create.steps.select'),
      content: renderSelect,
    },
    {
      label: t('create.steps.config'),
      content: renderConfig,
    },
    {
      label: t('create.steps.authorize'),
      content: renderAuthorize,
    },
    {
      label: t('create.steps.complete'),
      content: renderComplete,
    },
  ];

  if (!session.user) {
    return (
      <Div>
        <Container style={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
        </Container>
      </Div>
    );
  }

  return (
    <Div>
      <Container>
        <Typography component="h2" variant="h4" className="header">
          {t('create.title')}
        </Typography>
        <Paper className="stepper">
          <Stepper className="stepper-progress" alternativeLabel activeStep={activeStep}>
            {steps.map(({ label }) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="stepper-content">{steps[activeStep].content()}</div>
          <div className="stepper-actions">
            <Button rounded disabled={activeStep === 0} onClick={onBack} className="step-button">
              {t('common.back')}
            </Button>
            <Button
              rounded
              variant="contained"
              color="primary"
              onClick={onNext}
              className="step-button">
              {activeStep === steps.length - 1 ? t('common.finish') : t('common.next')}
            </Button>
          </div>
        </Paper>
      </Container>
    </Div>
  );
}

const Div = styled.div`
  min-height: 84vh;

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  .stepper {
    padding: 24px;
    height: auto;
    min-height: 640px;
    display: flex;
    flex-direction: column;
    box-shadow: none;

    .stepper-progress {
      padding: 0;
      flex: 0;
      margin-bottom: 24px;

      .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
        margin-top: 8px;
      }

      .MuiStepConnector-alternativeLabel {
        top: 24px;
      }

      .MuiStepConnector-lineHorizontal {
        height: 3px;
        border: none;
        background-color: #eaeaf0;
        border-radius: 1px;
      }

      .step-icon-w {
        background-color: ${props => props.theme.colors.minor};
        z-index: 1;
        color: ${props => props.theme.colors.white};
        width: 50px;
        height: 50px;
        display: flex;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        .step-icon {
          font-size: 30px;
        }
      }

      .step-icon-w--active {
        background-color: ${props => props.theme.colors.blue};
      }

      .step-icon-w--completed {
        background-color: ${props => props.theme.colors.secondary};
      }
    }

    .stepper-content {
      padding: 0 64px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;

      .stepper-auth {
        padding: 0;

        .auth-title {
          margin-bottom: 16px;
        }
      }

      .stepper-tip {
        text-align: center;
        margin-bottom: 16px;
      }

      .action-button {
        box-shadow: none;
      }
    }

    .stepper-actions {
      flex: 0;
      text-align: right;
      padding: 0 64px;
      display: none;
      .step-button {
        margin-right: 8px;
      }
    }
  }
`;
