// eslint-disable-next-line no-param-reassign
import axios, { CancelToken } from 'axios';
import { getErrorMessage } from 'containers/Common/function';
import Swal from 'sweetalert2';
import qs from 'qs';
// import Cookies from 'js-cookie';
import { API_IAM } from '../containers/apiUrl';
// import history from './history';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};
async function getToken() {
  const token = window.localStorage.getItem('token');
  return token && token.length ? `bearer ${token}` : '';
}
axios.interceptors.request.use(async (config) => {
  // const token = `Bearer ${await getToken()}`;
  // config.headers.Authorization = token;
  const URLS_DO_NOT_NEED_TOKEN = [
    API_IAM.LOGIN_API,
    API_IAM.FORGOT_PASSWORD_API.CUSTOMER,
    API_IAM.FORGOT_PASSWORD_API.LOCAL,
    API_IAM.CONFIRM_FORGOT_PASSWORD_API,
  ]; // Login, Forgot and Reset password
  if (!URLS_DO_NOT_NEED_TOKEN.includes(config.url)) {
    const token = await getToken();
    config.headers.Authorization = token;
  }
  if (!config.headers['X-TenantID'])
    // config.headers['X-TenantID'] = process.env.AREA_ID;
  config.headers['Accept-Language'] = localStorage.getItem('lng');
  if (!config.paramsSerializer) {
    config.paramsSerializer = (p) => qs.stringify(p, { arrayFormat: 'comma' });
  }
  return config;
});

export const showError = (err, callback) => {
  const message = getErrorMessage(err);
  Swal.fire({
    // title: 'Có lỗi xảy ra/Something went wrong',
    text: message,
    icon: 'error',
    // imageWidth: 213,
    showCancelButton: false,
    showCloseButton: false,
    showConfirmButton: true,
    focusConfirm: true,
    confirmButtonColor: '#40a574',
    confirmButtonText: 'Đóng',
    customClass: {
      content: 'content-class',
    },
  }).then(() => {
    if (callback) {
      callback();
    }
  });
};

axios.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

// axios.defaults.withCredentials = true;

export function callApi(url, method, data = {}) {
  return axios({
    method,
    url,
    data,
  });
}

export function callApiWithConfig(url, method, data = {}, config) {
  return axios({
    method,
    url,
    data,
    ...config,
  });
}

export function callApiExportFile(
  url,
  method,
  data = {},
  progressCb,
  cancelDownload,
  params,
) {
  return axios({
    method,
    onDownloadProgress: progressCb || null,
    cancelToken: cancelDownload
      ? new CancelToken((cancel) => cancelDownload(cancel))
      : null,
    url,
    responseType: 'blob',
    data,
    params,
  });
}

export function getApi(url, params = {}, other) {
  return axios.get(url, {
    params,
    ...other,
  });
}

export function getApiWithHeader(
  url,
  params = {},
  headers = {},
  arrayFormat = 'comma',
) {
  return axios.get(url, {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat }),
    headers,
  });
}

export function postApi(url, payload = {}, other) {
  return axios.post(url, payload, other);
}
export function putApi(url, payload) {
  return axios.put(url, payload);
}
export function patchApi(url, payload) {
  return axios.patch(url, payload);
}
export function delApi(url, params = {}, other) {
  return axios.delete(url, {
    params,
    ...other,
  });
}
export const getApiCustom = (
  { url, params, arrayFormat },
  callBack,
  callbackFailed,
) => {
  try {
    getApi(url, params, arrayFormat)
      .then((res) => res)
      .then((res) => {
        if (res?.code === 200) {
          callBack(res?.data);
        } else {
          callBack(res);
        }
      })
      .catch((e) => callbackFailed(e));
  } catch (error) {
    throw Error();
  }
};
export const getApiCustomWithHeader = (
  { url, params, headers, arrayFormat },
  callBack,
) => {
  try {
    getApiWithHeader(url, params, headers, arrayFormat)
      .then((res) => res)
      .then((res) => {
        callBack(res);
      });
  } catch (error) {
    throw Error();
  }
};
export const putApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    putApi(url, payload)
      .then((res) => res)
      .then((res) => res?.code === 200 && callback(res));
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error);
    } else {
      throw Error();
    }
  }
};
export const patchApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    patchApi(url, payload)
      .then((res) => res)
      .then((res) => res?.code === 200 && callback())
      .catch((e) => callbackFailed(e));
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error);
    } else {
      throw Error();
    }
  }
};
export const delApiCustom = ({ url, params, arrayFormat }, callback) => {
  try {
    delApi(url, params, arrayFormat)
      .then((res) => res)
      .then((res) => [200, 204].indexOf(res?.code) != -1 && callback());
  } catch (error) {
    throw Error();
  }
};
export const postApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    postApi(url, payload)
      .then((res) => res)
      .then(
        (res) =>
          (res?.code === 200 || res?.code === 201) && callback(res?.data),
      )
      .catch((e) => callbackFailed(e));
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error);
    } else {
      throw Error();
    }
  }
};
