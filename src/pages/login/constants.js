// eslint-disable-next-line no-control-regex,no-useless-escape
const rEmail =
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const rPassword =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\^$*.\\[\\]{}\\(\\)?\\-“!@#%&/,><\\’:;|_~`])\\S{8,99}$';
export const EMAIL_PATTERN = new RegExp(rEmail);
export const PASSWORD_PATTERN = new RegExp(rPassword);

export const PHONE_PATTERN = new RegExp(
  '^(\\+[0-9]+[\\- \\.]*)?(\\([0-9]+\\)[\\- \\.]*)?([0-9][0-9\\- \\.]+[0-9])$',
);

export const FORM_TYPE = {
  LOGIN: 'LOGIN_FORM',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD_FORM',
  CHANGE_TMP_PASSWORD: 'CHANGE_TMP_PASSWORD_FORM',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD_FORM',
};

export const ACCOUNT_TYPE = {
  LOCAL: 'LOCAL',
  AD: 'AD_LDAP',
};

export const FORGOT_PASSWORD_VIN3S_DATA = {
  redirectUrl: 'http://localhost:3000/login/oauth2/code/auth0',
  state: 'aa',
};

export const LOGIN = 'boilerplate/Login/LOGIN';
export const LOGIN_SUCCESS = 'boilerplate/Login/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'boilerplate/Login/LOGIN_ERROR';

export const LOADING = 'boilerplate/Login/LOADING';

export const FORGOT_PASSWORD = 'boilerplate/Login/FORGOT_PASSWORD';
export const FORGOT_PASSWORD_SUCCESS =
  'boilerplate/Login/FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'boilerplate/Login/FORGOT_PASSWORD_ERROR';

export const CLEAR_EMAIL = 'boilerplate/Login/CLEAR_EMAIL';
export const CLEAR_API_MESSAGE = 'boilerplate/Login/CLEAR_API_MESSAGE';
export const CLEAR_LOGIN_ERROR_MESSAGE =
  'boilerplate/Login/CLEAR_LOGIN_ERROR_MESSAGE';

export const RE_SEND_EMAIL = 'boilerplate/Login/RE_SEND_EMAIL';
export const LOGOUT = 'boilerplate/Login/LOGOUT';
export const LOGOUT_SUCCES = 'boilerplate/Login/LOGOUT_SUCCES';
export const LOGOUT_ERROR = 'boilerplate/Login/LOGOUT_ERROR';

export const CHANGE_TMP_PASSWORD = 'boilerplate/Login/CHANGE_TMP_PASSWORD';
export const CHANGE_TMP_PASSWORD_SUCCESS =
  'boilerplate/Login/CHANGE_TMP_PASSWORD_SUCCESS';
export const CHANGE_TMP_PASSWORD_ERROR =
  'boilerplate/Login/CHANGE_TMP_PASSWORD_ERROR';
export const CLEAR_FIRST_LOGIN_API_MESSAGE =
  'boilerplate/Login/CLEAR_FIRST_LOGIN_API_MESSAGE';
export const SET_FORM_TYPE = 'boilerplate/Login/SET_FORM_TYPE';

export const UPDATE_PASSWORD = 'boilerplate/Login/UPDATE_PASSWORD';
export const UPDATE_PASSWORD_SUCCESS =
  'boilerplate/Login/UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_ERROR = 'boilerplate/Login/UPDATE_PASSWORD_ERROR';
export const CLEAR_UPDATE_PASSWORD_API_MESSAGE =
  'boilerplate/Login/CLEAR_UPDATE_PASSWORD_API_MESSAGE';

export const SET_USERNAME = 'boilerplate/Login/SET_USERNAME';
