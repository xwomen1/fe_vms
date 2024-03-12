import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUser = state => state.login || initialState;
const selectError = state => state.error || initialState.currentUser.error;

const makeSelectCurrentUser = () =>
  createSelector(
    selectUser,
    userState => userState.currentUser,
  );
const makeSelectError = () =>
  createSelector(
    selectError,
    errorState => errorState,
  );
const makeSelectLoading = () =>
  createSelector(
    selectUser,
    nvrState => nvrState.loading,
  );
const makeSelectApiMessage = () =>
  createSelector(
    selectUser,
    userState => userState.forgotPassword.apiMessage,
  );
const makeSelectErrorLoginMessage = () =>
  createSelector(
    selectUser,
    userState => userState.error,
  );
const makeSelectEmail = () =>
  createSelector(
    selectUser,
    userState => userState.forgotPassword.email,
  );
const makeSelectAuthState = () =>
  createSelector(
    selectUser,
    userState => userState.authState,
  );
const makeSelectIsFirstLogin = () =>
  createSelector(
    selectUser,
    userState => userState.firstLogin.isFirstLogin,
  );
const makeSelectFirstLoginAPIMessage = () =>
  createSelector(
    selectUser,
    userState => userState.firstLogin.apiMessage,
  );
const makeSelectFormType = () =>
  createSelector(
    selectUser,
    userState => userState.formType,
  );
const makeSelectChangePasswordError = () =>
  createSelector(
    selectUser,
    state => state.changePassword.error,
  );
const makeSelectUsername = () =>
  createSelector(
    selectUser,
    state => state.firstLogin.username,
  );

export {
  makeSelectCurrentUser,
  makeSelectError,
  makeSelectLoading,
  makeSelectApiMessage,
  makeSelectEmail,
  makeSelectErrorLoginMessage,
  makeSelectAuthState,
  makeSelectIsFirstLogin,
  makeSelectFirstLoginAPIMessage,
  makeSelectFormType,
  makeSelectChangePasswordError,
  makeSelectUsername,
};
