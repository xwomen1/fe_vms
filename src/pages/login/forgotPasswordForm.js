import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import BackIcon from 'images/Icon-Back.svg';
import { TextBox } from 'devextreme-react/text-box';
import { Alert } from '@material-ui/lab';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectApiMessage,
  makeSelectEmail,
  makeSelectLoading,
} from './selectors';
import {
  clearApiMessage,
  clearEmail,
  forgotPassword,
  setFormType,
} from './actions';
import 'animate.css';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import {
  FormTitle,
  LoginForm,
  Label,
  ErrorText,
  SubmitButton,
  LinkContainer,
  A,
  FormContent,
} from './style';
import { EMAIL_PATTERN, FORM_TYPE } from './constants';

const key = 'login';
export function FormForgotPassword({
  email,
  apiMessage,
  onSendmailForgotpassword,
  onClearEmail,
  onClearApiMessage,
  onChangeForm,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();
  const [isInputFormForgotPassword, setIsInputFormForgotPassword] = useState(
    false,
  );
  const [isValidEmailFormat, setIsValidEmailFormat] = useState(true);

  const forgotPasswordForm = useFormik({
    initialValues: {
      email: '',
    },
    validate() {
      if (!forgotPasswordForm.values.email) {
        setIsInputFormForgotPassword(false);
      } else {
        setIsInputFormForgotPassword(true);
        if (!EMAIL_PATTERN.test(forgotPasswordForm.values.email)) {
          setIsValidEmailFormat(false);
        } else {
          setIsValidEmailFormat(true);
        }
      }
      return {};
    },
    onSubmit: values => {
      const data = {
        email: values.email,
        isResend: false,
      };
      onSendmailForgotpassword(data);
    },
  });

  return (
    <LoginForm>
      <FormTitle style={{ textAlign: 'left' }}>
        <button
          type="button"
          onClick={() => {
            onChangeForm(FORM_TYPE.LOGIN);
            onClearEmail();
          }}
        >
          <img src={BackIcon} alt="" />
        </button>
        <p>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.ForgotPasswordPage.title',
          })}
        </p>
      </FormTitle>
      {email === '' && (
        <React.Fragment>
          <FormContent>
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.ForgotPasswordPage.content',
            })}
          </FormContent>
          <form onSubmit={forgotPasswordForm.handleSubmit}>
            <Label>
              {intl.formatMessage({
                id:
                  'boilerplate.containers.LoginPage.ForgotPasswordPage.emailTitle',
              })}
            </Label>
            <TextBox
              id="email"
              name="email"
              placeholder={intl.formatMessage({
                id: 'boilerplate.containers.LoginPage.inputText',
              })}
              stylingMode="outlined"
              className="item"
              validationStatus={
                apiMessage !== '' || !isValidEmailFormat ? 'invalid' : 'valid'
              }
              defaultValue=""
              mode="text"
              onInput={e => {
                onClearApiMessage();
                forgotPasswordForm.handleChange(e.event);
              }}
            />
            {!isValidEmailFormat && (
              <ErrorText>
                {intl.formatMessage({
                  id:
                    'boilerplate.containers.LoginPage.ForgotPasswordPage.invalid.email',
                })}{' '}
              </ErrorText>
            )}
            {apiMessage !== '' && (
              <Alert severity="error" style={{ marginTop: '16px' }}>
                {apiMessage}
              </Alert>
            )}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <SubmitButton
                disabled={!isInputFormForgotPassword || !isValidEmailFormat}
                variant="contained"
                color="primary"
                type="submit"
              >
                {intl.formatMessage({
                  id:
                    'boilerplate.containers.LoginPage.ForgotPasswordPage.submitbtn',
                })}
              </SubmitButton>
            </div>
          </form>
        </React.Fragment>
      )}
      {/* Resend email */}
      {email !== '' && (
        <React.Fragment>
          <FormContent>
            {intl.formatMessage(
              {
                id:
                  'boilerplate.containers.LoginPage.ForgotPasswordPage.ResendEmailPage.content',
              },
              {
                email: <b>{email}</b>,
                br: (
                  <React.Fragment>
                    <br /> <br />
                  </React.Fragment>
                ),
              },
            )}
          </FormContent>
          <LinkContainer style={{ textAlign: 'left' }}>
            <A
              href="#"
              onClick={() => {
                const data = {
                  email,
                  isResend: true,
                  successMessage: intl.formatMessage({
                    id:
                      'boilerplate.containers.LoginPage.ForgotPasswordPage.ResendEmailPage.resend.email.success.message',
                  }),
                };
                onSendmailForgotpassword(data);
              }}
            >
              {intl.formatMessage({
                id:
                  'boilerplate.containers.LoginPage.ForgotPasswordPage.ResendEmailPage.resend.email',
              })}
            </A>
          </LinkContainer>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <SubmitButton
              variant="contained"
              color="primary"
              onClick={() => {
                onChangeForm(FORM_TYPE.LOGIN);
                // onChangeForm(FORM_TYPE.CHANGE_PASSWORD);
              }}
            >
              {intl.formatMessage({
                id:
                  'boilerplate.containers.LoginPage.ForgotPasswordPage.ResendEmailPage.continue',
              })}
            </SubmitButton>
          </div>
        </React.Fragment>
      )}
    </LoginForm>
  );
}

FormForgotPassword.propTypes = {};

const mapStateToProps = createStructuredSelector({
  locale: makeSelectLocale(), // ok
  loading: makeSelectLoading(), // ok
  apiMessage: makeSelectApiMessage(),
  email: makeSelectEmail(), // ok
});

export function mapDispatchToProps(dispatch) {
  return {
    onSendmailForgotpassword: evt => {
      dispatch(forgotPassword(evt));
    },
    onClearEmail: () => {
      dispatch(clearEmail());
    },
    onClearApiMessage: () => {
      dispatch(clearApiMessage());
    },
    onChangeForm: form => {
      dispatch(setFormType(form));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FormForgotPassword);
