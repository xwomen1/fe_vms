import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';

import LoginImgSmall from 'images/logo.svg';
import HideIcon from 'images/Icon-Hide.svg';
import ShowIcon from 'images/Icon-Show.svg';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectApiMessage,
  makeSelectCurrentUser,
  makeSelectEmail,
  makeSelectErrorLoginMessage,
  makeSelectFirstLoginAPIMessage,
  makeSelectFormType,
  makeSelectIsFirstLogin,
  makeSelectLoading,
  makeSelectUsername,
} from './selectors';
import { makeSelectUserMenu } from '../Menu/selectors';
import {
  clearEmail,
  clearLoginErrorMessage,
  forgotPassword,
  login,
  changeTmpPassword,
  setFormType,
  clearFirstLoginApiMessage,
} from './actions';
import 'animate.css';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import {
  FormTitle,
  LoginForm,
  LogoImageMobile,
  Label,
  ErrorText,
  SubmitButton,
} from './style';
import { PASSWORD_PATTERN } from './constants';

const key = 'login';

export function ChangeTmpPassword({
  onChangeTmpPassword,
  firstLoginAPIMessage,
  username,
  onClearApiMessage,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();

  // first login variables
  const [isValidFirstLoginForm, setIsValidFirstLoginForm] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isMatchPassword, setIsMatchPassword] = useState(true);
  const [isShowTmpPassword, setIsShowTmpPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const firstLoginForm = useFormik({
    initialValues: {},
    // We've added a validate function
    validate() {
      const errors = {};
      // Required
      if (
        !firstLoginForm.values.temporaryPassword &&
        firstLoginForm.touched.temporaryPassword
      ) {
        errors.temporaryPassword = 'Required';
      }

      if (
        !firstLoginForm.values.newPassword &&
        firstLoginForm.touched.newPassword
      ) {
        errors.newPassword = 'Required';
      }

      if (
        !firstLoginForm.values.confirmPassword &&
        firstLoginForm.touched.confirmPassword
      ) {
        errors.confirmPassword = 'Required';
      }

      // Pattern password
      if (firstLoginForm.touched.newPassword) {
        if (!PASSWORD_PATTERN.test(firstLoginForm.values.newPassword)) {
          errors.invalidPassword = '';
          setIsValidPassword(false);
        } else {
          setIsValidPassword(true);
        }
      }

      // is confirm password match
      if (
        firstLoginForm.values.newPassword !==
          firstLoginForm.values.confirmPassword &&
        firstLoginForm.touched.newPassword &&
        firstLoginForm.touched.confirmPassword
      ) {
        errors.matched = '';
        setIsMatchPassword(false);
      } else {
        setIsMatchPassword(true);
      }

      if (
        Object.keys(errors).length === 0 &&
        firstLoginForm.touched.newPassword &&
        firstLoginForm.touched.confirmPassword &&
        firstLoginForm.touched.temporaryPassword
      ) {
        setIsValidFirstLoginForm(true);
      } else {
        setIsValidFirstLoginForm(false);
      }
      return errors;
    },
    onSubmit: (values) => {
      onChangeTmpPassword({
        curPassword: values.temporaryPassword,
        newPassword: values.newPassword,
        token: username,
      });
    },
  });
  return (
    <LoginForm>
      <FormTitle>
        <p>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.FirstLoginForm.Title',
          })}
        </p>
      </FormTitle>
      <LogoImageMobile>
        <img src={LoginImgSmall} alt="" />
      </LogoImageMobile>
      <form onSubmit={firstLoginForm.handleSubmit}>
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.FirstLoginForm.CurrentPassword',
          })}
        </Label>
        <TextBox
          id="temporaryPassword"
          name="temporaryPassword"
          placeholder="Nhập mật khẩu hiện tại"
          stylingMode="outlined"
          className="item"
          defaultValue=""
          mode={`${isShowTmpPassword ? 'text' : 'password'}`}
          onInput={(e) => {
            onClearApiMessage();
            firstLoginForm.touched.temporaryPassword = true;
            firstLoginForm.handleChange(e.event);
          }}
        >
          <TextBoxButton
            name="icon"
            location="after"
            options={{
              icon: `${isShowTmpPassword ? ShowIcon : HideIcon}`,
              onClick: () => {
                setIsShowTmpPassword(!isShowTmpPassword);
              },
              stylingMode: 'text',
            }}
          />
        </TextBox>
        {firstLoginAPIMessage && (
          <ErrorText>
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.FirstLoginForm.Invalid.CurrentPassword',
            })}
          </ErrorText>
        )}
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.UpdatePasswordPage.newPassword.label',
          })}
        </Label>
        <TextBox
          id="newPassword"
          name="newPassword"
          placeholder="Nhập mật khẩu"
          stylingMode="outlined"
          className="item"
          validationStatus={!isValidPassword ? 'invalid' : 'valid'}
          defaultValue=""
          mode={`${isShowNewPassword ? 'text' : 'password'}`}
          onInput={(e) => {
            firstLoginForm.touched.newPassword = true;
            firstLoginForm.handleChange(e.event);
          }}
        >
          <TextBoxButton
            name="icon"
            location="after"
            options={{
              icon: `${isShowNewPassword ? ShowIcon : HideIcon}`,
              onClick: () => {
                setIsShowNewPassword(!isShowNewPassword);
              },
              stylingMode: 'text',
            }}
          />
        </TextBox>
        {!isValidPassword && (
          <ErrorText>
            {intl.formatMessage({
              id: 'boilerplate.containers.UpdatePasswordPage.invalid.newPassword.format',
            })}
          </ErrorText>
        )}
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.UpdatePasswordPage.confirmPassword.label',
          })}
        </Label>
        <TextBox
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          stylingMode="outlined"
          className="item"
          validationStatus={!isMatchPassword ? 'invalid' : 'valid'}
          defaultValue=""
          mode={`${isShowConfirmPassword ? 'text' : 'password'}`}
          onInput={(e) => {
            firstLoginForm.touched.confirmPassword = true;
            firstLoginForm.handleChange(e.event);
          }}
        >
          <TextBoxButton
            name="icon"
            location="after"
            options={{
              icon: `${isShowConfirmPassword ? ShowIcon : HideIcon}`,
              onClick: () => {
                setIsShowConfirmPassword(!isShowConfirmPassword);
              },
              stylingMode: 'text',
            }}
          />
        </TextBox>
        {!isMatchPassword && (
          <ErrorText>
            {intl.formatMessage({
              id: 'boilerplate.containers.UpdatePasswordPage.confirmPassword.notMatch',
            })}
          </ErrorText>
        )}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <SubmitButton
            disabled={!isValidFirstLoginForm}
            type="submit"
            variant="contained"
            color="primary"
          >
            {intl.formatMessage({
              id: 'boilerplate.containers.UpdatePasswordPage.submit.button',
            })}
          </SubmitButton>
        </div>
      </form>
    </LoginForm>
  );
}

ChangeTmpPassword.propTypes = {};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  errorLogin: makeSelectErrorLoginMessage(),
  userMenus: makeSelectUserMenu(),
  locale: makeSelectLocale(),
  loading: makeSelectLoading(),
  apiMessage: makeSelectApiMessage(),
  email: makeSelectEmail(),
  isFirstLogin: makeSelectIsFirstLogin(),
  firstLoginAPIMessage: makeSelectFirstLoginAPIMessage(),
  formType: makeSelectFormType(),
  username: makeSelectUsername(),
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
      dispatch(clearFirstLoginApiMessage());
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
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ChangeTmpPassword);
