import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import BackIcon from 'images/Icon-Back.svg';

import LoginImgSmall from 'images/logo.svg';
import HideIcon from 'images/Icon-Hide.svg';
import ShowIcon from 'images/Icon-Show.svg';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import reducer from './reducer';
import saga from './saga';
import { makeSelectChangePasswordError, makeSelectEmail } from './selectors';
import 'animate.css';
import {
  FormTitle,
  LoginForm,
  LogoImageMobile,
  Label,
  ErrorText,
  SubmitButton,
} from './style';
import { PASSWORD_PATTERN, FORM_TYPE } from './constants';
import {
  changePassword,
  clearChangePasswordApiMessage,
  setFormType,
  clearEmail,
} from './actions';
const key = 'login';
export function ChangePasswordForm({
  onUpdatePassword,
  error,
  onClearError,
  email,
  onChangeForm,
  onClearEmail,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const intl = useIntl();
  const [isValidForm, setIsValidForm] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isMatchPassword, setIsMatchPassword] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {},
    // We've added a validate function
    validate() {
      const errors = {};
      // Required
      if (!formik.values.password && formik.touched.password) {
        errors.password = 'Required';
      }
      if (!formik.values.confirmPassword && formik.touched.confirmPassword) {
        errors.confirmPassword = 'Required';
      }
      if (!formik.values.confirmationCode && formik.touched.confirmationCode) {
        errors.confirmPassword = 'Required';
      }
      // Pattern password
      if (
        !PASSWORD_PATTERN.test(formik.values.password) &&
        formik.touched.password
      ) {
        errors.invalidPassword = '';
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
      // is confirm password match
      if (
        formik.values.password !== formik.values.confirmPassword &&
        formik.touched.password &&
        formik.touched.confirmPassword
      ) {
        errors.matched = '';
        setIsMatchPassword(false);
      } else {
        setIsMatchPassword(true);
      }

      if (
        Object.keys(errors).length === 0 &&
        formik.touched.password &&
        formik.touched.confirmPassword &&
        formik.touched.confirmationCode
      ) {
        setIsValidForm(true);
      } else {
        setIsValidForm(false);
      }
      return errors;
    },
    onSubmit: (values) => {
      onUpdatePassword({
        newPassword: values.password,
        confirmationCode: values.confirmationCode,
        email,
        successMessage: intl.formatMessage({
          id: 'boilerplate.containers.LoginPage.success.message',
        }),
      });
    },
  });
  return (
    <LoginForm>
      <FormTitle>
        <button
          type="button"
          onClick={() => {
            onChangeForm(FORM_TYPE.FORGOT_PASSWORD);
            onClearEmail();
          }}
        >
          <img src={BackIcon} alt="" />
        </button>
        <p>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.Change.Password.Title',
          })}
        </p>
      </FormTitle>
      <LogoImageMobile>
        <img src={LoginImgSmall} alt="" />
      </LogoImageMobile>
      <form onSubmit={formik.handleSubmit}>
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.confirmationCode.label',
          })}
        </Label>
        <TextBox
          id="confirmationCode"
          name="confirmationCode"
          placeholder="Nhập mã OTP"
          stylingMode="outlined"
          className="item"
          validationStatus={error ? 'invalid' : 'valid'}
          defaultValue=""
          mode="text"
          showClearButton
          onInput={(e) => {
            formik.touched.confirmationCode = true;
            onClearError();
            formik.handleChange(e.event);
          }}
          onValueChanged={(e) => {
            if (e.value === '') {
              // case clear button
              setIsValidForm(false);
            }
          }}
        />
        {error && (
          <ErrorText>
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.invalid.confirmationCode',
            })}
          </ErrorText>
        )}
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.newPassword.label',
          })}
        </Label>
        <TextBox
          id="password"
          name="password"
          placeholder="Nhập mật khẩu"
          stylingMode="outlined"
          className="item"
          validationStatus={!isValidPassword ? 'invalid' : 'valid'}
          defaultValue=""
          mode={`${isShowPassword ? 'text' : 'password'}`}
          onInput={(e) => {
            formik.touched.password = true;
            formik.handleChange(e.event);
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
        {!isValidPassword && (
          <ErrorText>
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.invalid.newPassword.format',
            })}
          </ErrorText>
        )}
        <Label>
          {intl.formatMessage({
            id: 'boilerplate.containers.LoginPage.confirmPassword.label',
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
            formik.touched.confirmPassword = true;
            formik.handleChange(e.event);
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
              id: 'boilerplate.containers.LoginPage.confirmPassword.notMatch',
            })}
          </ErrorText>
        )}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <SubmitButton
            disabled={!isValidForm}
            type="submit"
            variant="contained"
            color="primary"
          >
            {intl.formatMessage({
              id: 'boilerplate.containers.LoginPage.submit.button',
            })}
          </SubmitButton>
        </div>
      </form>
    </LoginForm>
  );
}

ChangePasswordForm.propTypes = {};

const mapStateToProps = createStructuredSelector({
  error: makeSelectChangePasswordError(),
  email: makeSelectEmail(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdatePassword: (evt) => {
      dispatch(changePassword(evt));
    },
    onClearError: () => {
      dispatch(clearChangePasswordApiMessage());
    },
    onChangeForm: (form) => {
      dispatch(setFormType(form));
    },
    onClearEmail: () => {
      dispatch(clearEmail());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ChangePasswordForm);
