import { unloadMenu } from 'containers/Menu/actions';
import Cookies from 'js-cookie';
import { call, put, takeLatest } from 'redux-saga/effects';
import { METHODS } from '../../utils/requestUtils';
import { showSuccess } from '../../utils/toast-utils';
import { API_IAM } from '../apiUrl';
import {
  changePasswordError,
  changePasswordSuccess,
  changeTmpPasswordError,
  changeTmpPasswordSuccess,
  forgotPasswordError,
  forgotPasswordSuccess,
  loading,
  loginError,
  loginSuccess,
  logoutError,
  logoutSuccess,
  reSendEmail,
} from './actions';
import {
  ACCOUNT_TYPE,
  CHANGE_TMP_PASSWORD,
  FORGOT_PASSWORD,
  LOGIN,
  LOGOUT,
  UPDATE_PASSWORD,
} from './constants';
const axios = require('axios');

export function* getUserData(action) {
  yield put(loading(true));
  let url = '';
  switch (action.data.accountType) {
    case ACCOUNT_TYPE.CUSTOMER:
      url = API_IAM.LOGIN_API.CUSTOMER;
      break;
    case ACCOUNT_TYPE.AD:
      url = API_IAM.LOGIN_API.AD;
      break;
    default:
      url = API_IAM.LOGIN_API.LOCAL;
      break;
  }
  const axiosConfig = {
    method: 'post',
    url,
    data: {
      username: action.data.username,
      password: action.data.password,
    },
  };
  try {
    const loginData = yield call(axios, axiosConfig);
    window.localStorage.setItem('token', loginData.access_token);
    Cookies.set('refresh_token', loginData.refresh_token);
    Cookies.set('expired_time', Date.now() + loginData.expires_in * 1000);
    const userMenu = null;
    window.localStorage.setItem('username', action.data.username);
    yield put(loginSuccess(loginData, userMenu));
  } catch (err) {
    yield put(loginError(err));
  }
}

export function* sendMailForgotPassword(action) {
  yield put(loading(true));
  const axiosConfig = {
    method: 'post',
    url: API_IAM.FORGOT_PASSWORD_API,
    data: {
      email: action.data.email,
    },
  };
  try {
    yield call(axios, axiosConfig);
    if (action.data.isResend) {
      showSuccess(action.data.successMessage);
      yield put(reSendEmail(action.data.email));
    } else {
      yield put(forgotPasswordSuccess(action.data.email));
    }
  } catch (err) {
    yield put(forgotPasswordError(err));
  }
}

export function* changeTmpPassword(action) {
  yield put(loading(true));
  const axiosConfig = {
    method: 'PUT',
    url: API_IAM.CHANGE_TMP_PASSWORD,
    data: action.data,
  };
  try {
    yield call(axios, axiosConfig);
    showSuccess(action.data.successMessage);
    yield put(changeTmpPasswordSuccess(action.data.email));
  } catch (err) {
    yield put(changeTmpPasswordError(err));
  }
}

export function* updatePassword(action) {
  yield put(loading(true));
  const axiosConfig = {
    method: 'post',
    url: API_IAM.CONFIRM_FORGOT_PASSWORD_API,
    data: {
      email: action.data.email,
      confirmationCode: action.data.confirmationCode,
      newPassword: action.data.newPassword,
    },
  };
  try {
    yield call(axios, axiosConfig);
    showSuccess(action.data.successMessage);
    yield put(changePasswordSuccess());
  } catch (err) {
    yield put(changePasswordError(err));
  }
}

/**
 * Đăng xuất, logout
 */
export function* logout() {
  const axiosConfig = {
    method: 'post',
    url: API_IAM.LOGOUT_API,
    data: {
      refreshToken: Cookies.get('refresh_token'),
    },
  };
  try {
    const response = yield call(axios, axiosConfig);
    window.localStorage.removeItem('userData');
    yield put(logoutSuccess(response.data));
    yield put(unloadMenu());
  } catch (err) {
    yield put(logoutError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* login() {
  yield takeLatest(LOGIN, getUserData);
  yield takeLatest(FORGOT_PASSWORD, sendMailForgotPassword);
  yield takeLatest(CHANGE_TMP_PASSWORD, changeTmpPassword);
  yield takeLatest(UPDATE_PASSWORD, updatePassword);
  yield takeLatest(LOGOUT, logout);
}
