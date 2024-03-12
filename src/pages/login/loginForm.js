/* eslint-disable jsx-a11y/anchor-is-valid */
import { Alert } from '@material-ui/lab';
import { FormLabel, Link } from '@material-ui/core';
import 'animate.css';
import SelectBox from 'devextreme-react/select-box';
import { Button as TextBoxButton, TextBox } from 'devextreme-react/text-box';
import { useFormik } from 'formik';
import HideIcon from 'images/Icon-Hide.svg';
import Dropdown from 'images/Icon-Selectbox.svg';
import ShowIcon from 'images/Icon-Show.svg';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getApi } from 'utils/requestUtils';
import { API_IAM } from '../apiUrl';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import { makeSelectUserMenu } from '../Menu/selectors';
// import logoviettel from 'images/viettellogo1.png';
import logoviettel from 'images/ivinewlogo.png';
import {
  changeTmpPassword,
  clearApiMessage,
  clearEmail,
  clearLoginErrorMessage,
  forgotPassword,
  login,
  setFormType,
  setUsername,
} from './actions';
import { ACCOUNT_TYPE, FORM_TYPE } from './constants';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectApiMessage,
  // makeSelectCurrentUser,
  makeSelectEmail,
  makeSelectErrorLoginMessage,
  makeSelectFirstLoginAPIMessage,
  makeSelectIsFirstLogin,
  makeSelectLoading,
} from './selectors';
import {
  FormTitle,
  Label,
  LinkContainer,
  LoginForm,
  LogoImageMobile,
  SubmitButton,
} from './style';
const key = 'login';
const DropdownIcon = () => <img src={Dropdown} alt="" />;

export function FormLogin({
  onClickLogin,
  errorLogin,
  onClearErrorLoginMessage,
  onChangeForm,
  onSetUsername,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.LOCAL);
  const [isValidFormLogin, setIsValidFormLogin] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  useEffect(() => {
    function storageEventHandler(event) {
      if (event.key == 'userData' && !event.oldValue) {
        window.location.reload();
      }
    }
    window.addEventListener('storage', storageEventHandler);
    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };

  }, []);

  const loginForm = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    // We've added a validate function
    validate() {
      const errors = {};
      // Add the touched to avoid the validator validating all fields at once
      if (!loginForm.values.username) {
        errors.email = 'Required';
      }
      if (!loginForm.values.password) {
        errors.password = 'Required';
      }
      if (Object.keys(errors).length === 0) {
        setIsValidFormLogin(true);
      } else {
        setIsValidFormLogin(false);
      }
      return errors;
    },
    onSubmit: (values) => {
      onSetUsername(values.username);
      onClickLogin({
        accountType,
        password: values.password,
        username: values.username,
      });
    },
  });

  const redirectToForgotpasswordForCustomer = async () => {
    const response = await getApi(API_IAM.FORGOT_PASSWORD_API);
    window.open(response, '_blank');
  };

  const handleClickForgotPassword = () => {
    switch (accountType) {
      case ACCOUNT_TYPE.LOCAL:
        onChangeForm(FORM_TYPE.FORGOT_PASSWORD);
        break;
      case ACCOUNT_TYPE.CUSTOMER:
        redirectToForgotpasswordForCustomer();
        break;
      default:
        break;
    }
  };

  return (
    <LoginForm>
      <FormTitle>
        {/* <p>
          <img src={logoviettel} alt="logo" style={{maxWidth: '200px',marginLeft: '15px'}}/>
        </p> */}
        <p>
          
        </p>

      </FormTitle>

      <form onSubmit={loginForm.handleSubmit}>

        <div
          style={{display: 'none'}}
        >
          <SelectBox
            items={[
              {
                id: ACCOUNT_TYPE.LOCAL,
                name: intl.formatMessage(messages.accountTypeLocal),
              },
            ]}
            dropDownButtonRender={DropdownIcon}
            width="100%"
            displayExpr="name"
            valueExpr="id"
            className="item"
            defaultValue={ACCOUNT_TYPE.LOCAL}
            onValueChanged={(e) => {
              setAccountType(e.value);
            }}
            disabled
          />
        </div>

        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.username',
          })} *
        </Label>
        <TextBox
          id="username"
          name="username"
          placeholder={intl.formatMessage(messages.usernamePlaceHolder)}
          stylingMode="outlined"
          className="item"
          validationStatus={errorLogin ? 'invalid' : 'valid'}
          defaultValue=""
          mode="text"
          showClearButton
          onInput={(e) => {
            onClearErrorLoginMessage();
            loginForm.handleChange(e.event);
          }}
          onValueChanged={(e) => {
            if (e.value === '') {
              // case clear button
              setIsValidFormLogin(false);
            }
          }}
        />
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.password',
          })} *
        </Label>
        <TextBox
          id="password"
          name="password"
          placeholder={intl.formatMessage(messages.passwordPlaceHolder)}
          stylingMode="outlined"
          className="item"
          validationStatus={errorLogin ? 'invalid' : 'valid'}
          defaultValue=""
          mode={`${isShowPassword ? 'text' : 'password'}`}
          onInput={(e) => {
            onClearErrorLoginMessage();
            loginForm.handleChange(e.event);
          }}
        >
          <TextBoxButton
            name="icon"
            location="after"
            options={{
              icon: `${isShowPassword ? ShowIcon : HideIcon}`,
              onClick: () => {
                setIsShowPassword(!isShowPassword);
              },
              stylingMode: 'text',
            }}
          />
        </TextBox>
        {errorLogin && (
          <Alert severity="error" style={{ marginTop: '16px' }}>
            {errorLogin}
          </Alert>
        )}
        <div style={{ marginTop: '44px', textAlign: 'center' }}>
          <SubmitButton
            disabled={!isValidFormLogin}
            type="submit"
            variant="contained"
            color="primary"
          >
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.submitbtn',
            })}
          </SubmitButton>
        </div>
      </form>
      {accountType != ACCOUNT_TYPE.AD && (
        <LinkContainer>
          <Link
            variant="body1"
            href="#"
            onClick={() => {
              handleClickForgotPassword();
            }}
          >
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.link.forgotPassword',
            })}
          </Link>
        </LinkContainer>
      )}
    </LoginForm>
  );
}

FormLogin.propTypes = {};

const mapStateToProps = createStructuredSelector({
  // currentUser: makeSelectCurrentUser(),
  errorLogin: makeSelectErrorLoginMessage(),
  userMenus: makeSelectUserMenu(),
  locale: makeSelectLocale(),
  loading: makeSelectLoading(),
  apiMessage: makeSelectApiMessage(),
  email: makeSelectEmail(),
  isFirstLogin: makeSelectIsFirstLogin(),
  firstLoginAPIMessage: makeSelectFirstLoginAPIMessage(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onClickLogin: (evt) => {
      dispatch(login(evt));
    },
    onSendmailForgotpassword: (evt) => {
      dispatch(forgotPassword(evt));
    },
    onClearEmail: () => {
      dispatch(clearEmail());
    },
    onClearApiMessage: () => {
      dispatch(clearApiMessage());
    },
    onClearErrorLoginMessage: () => {
      dispatch(clearLoginErrorMessage());
    },
    onChangeTmpPassword: (data) => {
      dispatch(changeTmpPassword(data));
    },
    onChangeForm: (form) => {
      dispatch(setFormType(form));
    },
    onSetUsername: (username) => {
      dispatch(setUsername(username));
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FormLogin);
