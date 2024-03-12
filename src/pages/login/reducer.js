import produce from 'immer';
import { showSuccess } from 'utils/toast-utils';
// import { showError } from 'utils/toast-utils';
import { clearLoginData } from 'utils/utils';
import { getErrorMessage } from '../Common/function';
import {
  CHANGE_TMP_PASSWORD_ERROR,
  CHANGE_TMP_PASSWORD_SUCCESS,
  CLEAR_API_MESSAGE,
  CLEAR_EMAIL,
  CLEAR_FIRST_LOGIN_API_MESSAGE,
  CLEAR_LOGIN_ERROR_MESSAGE,
  CLEAR_UPDATE_PASSWORD_API_MESSAGE,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_SUCCESS,
  FORM_TYPE,
  LOADING,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT_SUCCES,
  RE_SEND_EMAIL,
  SET_FORM_TYPE,
  SET_USERNAME,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_ERROR,
  UPDATE_PASSWORD_SUCCESS,
} from './constants';
// The initial state of the App
export const initialState = {
  // currentUser: { token: '', id: '', name: '', avatarUrl: '', error: '' },
  error: '',
  loading: false,
  firstLogin: { isFirstLogin: false, apiMessage: '', username: '' },
  forgotPassword: { apiMessage: '', email: '' },
  changePassword: { apiMessage: '', error: '' },
  authState: !!window.localStorage.getItem('token'),
  formType: FORM_TYPE.LOGIN,
};

const loginReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOADING:
        draft.loading = action.isLoading;
        break;
      case LOGIN_ERROR:
        // draft.currentUser.error = getErrorMessage(action.error);
        draft.loading = false;
        if (
          action.error?.response?.status === 403 &&
          action.error.response.data.error === 'CHANGE_PASSWORD_REQUIRED'
        ) {
          draft.formType = FORM_TYPE.CHANGE_TMP_PASSWORD;
        } else {
          // showError(action.error);
          const err = getErrorMessage(action.error);
          draft.error = err;
        }
        break;
      case LOGIN_SUCCESS: {
        draft.forgotPassword.email = '';
        draft.authState = true;
        draft.loading = false;
        // draft.currentUser = {
        //   id: action.userData.iat,
        //   token: `Bearer ${action.access_token}`,
        //   name: 'Nguyễn Văn A',
        //   avatarUrl: '',
        //   error: '',
        // };
        // let userHasMenu = false;
        // if (action.userMenus && action.userMenus.data) {
        //   if (
        //     action.userMenus.data.find(
        //       item =>
        //         process.env.SMC_DEFAULT_PATH + item.functionUrl ==
        //         window.location.pathname,
        //     ) &&
        //     window.location.pathname != `/login`
        //   ) {
        //     userHasMenu = true;
        //     window.location.reload();
        //     break;
        //   }
        //   for (let i = 0; i < action.userMenus.data.length; i++) {
        //     if (
        //       action.userMenus.data[i].functionUrl &&
        //       action.userMenus.data[i].functionUrl != '#'
        //     ) {
        //       userHasMenu = true;
        //       window.location =
        //         process.env.SMC_DEFAULT_PATH +
        //         action.userMenus.data[i].functionUrl;
        //       break;
        //     }
        //   }
        // }
        // if (!userHasMenu) {
        //   // window.location.reload();
        // }
        break;
      }
      case FORGOT_PASSWORD:
        draft.forgotPassword.apiMessage = '';
        break;
      case FORGOT_PASSWORD_SUCCESS:
        draft.loading = false;
        draft.forgotPassword.apiMessage = 'FORGOT_PASSWORD_SUCCESS';
        draft.forgotPassword.email = action.email;
        break;
      case FORGOT_PASSWORD_ERROR:
        draft.forgotPassword.apiMessage = getErrorMessage(action.error);
        draft.loading = false;
        break;
      case CLEAR_EMAIL:
        draft.loading = false;
        draft.forgotPassword.apiMessage = '';
        draft.forgotPassword.email = '';
        break;
      case CLEAR_API_MESSAGE:
        draft.loading = false;
        draft.forgotPassword.apiMessage = '';
        break;
      case RE_SEND_EMAIL:
        draft.loading = false;
        draft.forgotPassword.apiMessage = 'RE_SEND_EMAIL_SUCCESS';
        draft.forgotPassword.email = action.email;
        break;
      case CLEAR_LOGIN_ERROR_MESSAGE:
        draft.error = '';
        break;
      case LOGOUT_SUCCES:
        clearLoginData();
        draft.authState = false;
        break;
      case CHANGE_TMP_PASSWORD_SUCCESS:
        draft.loading = false;
        draft.formType = FORM_TYPE.LOGIN;
        showSuccess('Cập nhật mật khẩu thành công');
        break;
      case CHANGE_TMP_PASSWORD_ERROR:
        draft.firstLogin.apiMessage = getErrorMessage(action.error);
        draft.loading = false;
        break;
      case CLEAR_FIRST_LOGIN_API_MESSAGE:
        draft.loading = false;
        draft.firstLogin.apiMessage = '';
        break;
      case SET_FORM_TYPE:
        draft.loading = false;
        draft.formType = action.form;
        break;
      case UPDATE_PASSWORD:
        draft.loading = false;
        break;
      case UPDATE_PASSWORD_SUCCESS:
        draft.loading = false;
        draft.formType = FORM_TYPE.LOGIN;
        // draft.changePassword.apiMessage = 'UPDATE_PASSWORD_SUCCESS';
        draft.forgotPassword.email = '';
        draft.forgotPassword.apiMessage = '';
        draft.changePassword.apiMessage = '';
        draft.changePassword.error = '';
        break;
      case UPDATE_PASSWORD_ERROR:
        draft.loading = false;
        draft.changePassword.error = getErrorMessage(action.error);
        break;
      case CLEAR_UPDATE_PASSWORD_API_MESSAGE:
        draft.changePassword.error = '';
        break;
      case SET_USERNAME:
        draft.firstLogin.username = action.username;
        break;
      default:
        draft.loading = false;
        break;
    }
  });

export default loginReducer;
