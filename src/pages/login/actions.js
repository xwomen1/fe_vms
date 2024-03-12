import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOADING,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_SUCCESS,
  CLEAR_EMAIL,
  CLEAR_API_MESSAGE,
  RE_SEND_EMAIL,
  CLEAR_LOGIN_ERROR_MESSAGE,
  LOGOUT,
  CHANGE_TMP_PASSWORD,
  CHANGE_TMP_PASSWORD_ERROR,
  CHANGE_TMP_PASSWORD_SUCCESS,
  CLEAR_FIRST_LOGIN_API_MESSAGE,
  SET_FORM_TYPE,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_ERROR,
  CLEAR_UPDATE_PASSWORD_API_MESSAGE,
  SET_USERNAME,
  LOGOUT_SUCCES,
  LOGOUT_ERROR,
} from './constants';

export function login(data) {
  return {
    type: LOGIN,
    data,
  };
}

export function loginSuccess(userData, userMenus) {
  return {
    type: LOGIN_SUCCESS,
    userData,
    userMenus,
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error,
  };
}

export function loading(isLoading) {
  return {
    type: LOADING,
    isLoading,
  };
}

export function forgotPassword(data) {
  return {
    type: FORGOT_PASSWORD,
    data,
  };
}

export function forgotPasswordSuccess(email) {
  return {
    type: FORGOT_PASSWORD_SUCCESS,
    email,
  };
}

export function forgotPasswordError(error) {
  return {
    type: FORGOT_PASSWORD_ERROR,
    error,
  };
}

export function clearEmail() {
  return {
    type: CLEAR_EMAIL,
  };
}

export function clearApiMessage() {
  return {
    type: CLEAR_API_MESSAGE,
  };
}

export function reSendEmail(email) {
  return {
    type: RE_SEND_EMAIL,
    email,
  };
}

export function clearLoginErrorMessage() {
  return {
    type: CLEAR_LOGIN_ERROR_MESSAGE,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCES,
  };
}

export function logoutError() {
  return {
    type: LOGOUT_ERROR,
  };
}

export function changeTmpPassword(data) {
  return {
    type: CHANGE_TMP_PASSWORD,
    data,
  };
}

export function changeTmpPasswordSuccess(email) {
  return {
    type: CHANGE_TMP_PASSWORD_SUCCESS,
    email,
  };
}

export function changeTmpPasswordError(error) {
  return {
    type: CHANGE_TMP_PASSWORD_ERROR,
    error,
  };
}

export function clearFirstLoginApiMessage() {
  return {
    type: CLEAR_FIRST_LOGIN_API_MESSAGE,
  };
}

export function setFormType(form) {
  return {
    type: SET_FORM_TYPE,
    form,
  };
}

export function changePassword(data) {
  return {
    type: UPDATE_PASSWORD,
    data,
  };
}

export function changePasswordSuccess() {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
  };
}

export function changePasswordError(error) {
  return {
    type: UPDATE_PASSWORD_ERROR,
    error,
  };
}

export function clearChangePasswordApiMessage() {
  return {
    type: CLEAR_UPDATE_PASSWORD_API_MESSAGE,
  };
}

export function setUsername(username) {
  return {
    type: SET_USERNAME,
    username,
  };
}
