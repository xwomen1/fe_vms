import axios from 'axios'
import qs from 'qs'

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
}

async function getToken() {
  if (typeof window === 'undefined') return ''
  const token = window.localStorage.getItem('accessToken')

  return token && token.length ? `Bearer ${token}` : ''
}

axios.interceptors.request.use(async config => {
  const token = await getToken()
  config.headers.Authorization = token
  config.withCredentials = false

  // config.headers['Accept-Language'] = localStorage.getItem('lng');
  // if (!config.paramsSerializer) {
  //   config.paramsSerializer = (p) => qs.stringify(p, { arrayFormat: 'comma' });
  // }

  if (config.status === 401) {
    // alert("You are not authorized");
  }

  return config
})

axios.interceptors.response.use(
  response => (response?.data?.data ? response?.data : response),
  error => {
    if (error.response?.status === 401 && !window?.location?.pathname?.includes('login')) {
      window?.localStorage?.clear()
      window?.location?.reload()

      // const pathNameLogin =
      //   window?.location?.protocol + '//' + window?.location?.host + '/login'
      // window.location.replace(pathNameLogin)

    }

    return Promise.reject(error)
  }
)

axios.defaults.withCredentials = false

export function callApi(url, method, data = {}) {
  return axios({
    method,
    url,
    data
  })
}

export function callApiWithConfig(url, method, data = {}, config) {
  return axios({
    method,
    url,
    data,
    ...config
  })
}

export function callApiExportFile(url, method, data = {}, progressCb, cancelDownload, params) {
  return axios({
    method,
    onDownloadProgress: progressCb || null,
    cancelToken: cancelDownload ? new CancelToken(cancel => cancelDownload(cancel)) : null,
    url,
    responseType: 'blob',
    data,
    params
  })
}

export function getApi(url, params = {}, other) {
  return axios.get(url, {
    params,
    ...other
  })
}

export function getApiWithHeader(url, params = {}, headers = {}, arrayFormat = 'comma') {
  return axios.get(url, {
    params,
    paramsSerializer: p => qs.stringify(p, { arrayFormat }),
    headers
  })
}

export function postApi(url, payload = {}, other) {
  return axios.post(url, payload, {
    ...other

    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    // withCredentials: true ,

  })
}

export function putApi(url, payload, other) {
  return axios.put(url, payload, {
    ...other
  })
}

export function patchApi(url, payload, config) {
  return axios.patch(url, payload, config)
}

export function delApi(url, params = {}, other) {
  return axios.delete(url, {
    params,
    ...other
  })
}

export const getApiCustom = ({ url, params, arrayFormat }, callBack, callbackFailed) => {
  try {
    getApi(url, params, arrayFormat)
      .then(res => res)
      .then(res => {
        if (res?.code === 200) {
          callBack(res?.data)
        } else {
          callBack(res)
        }
      })
      .catch(e => callbackFailed(e))
  } catch (error) {
    throw Error()
  }
}

export const getApiCustomWithHeader = ({ url, params, headers, arrayFormat }, callBack) => {
  try {
    getApiWithHeader(url, params, headers, arrayFormat)
      .then(res => res)
      .then(res => {
        callBack(res)
      })
  } catch (error) {
    throw Error()
  }
}

export const putApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    putApi(url, payload)
      .then(res => res)
      .then(res => res?.code === 200 && callback(res))
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error)
    } else {
      throw Error()
    }
  }
}

export const patchApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    patchApi(url, payload)
      .then(res => res)
      .then(res => res?.code === 200 && callback())
      .catch(e => callbackFailed(e))
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error)
    } else {
      throw Error()
    }
  }
}

export const delApiCustom = ({ url, params, arrayFormat }, callback) => {
  try {
    delApi(url, params, arrayFormat)
      .then(res => res)
      .then(res => [200, 204].indexOf(res?.code) != -1 && callback())
  } catch (error) {
    throw Error()
  }
}

export const postApiCustom = ({ url, payload }, callback, callbackFailed) => {
  try {
    postApi(url, payload)
      .then(res => res)
      .then(res => (res?.code === 200 || res?.code === 201) && callback(res?.data))
      .catch(e => callbackFailed(e))
  } catch (error) {
    if (callbackFailed) {
      callbackFailed(error)
    } else {
      throw Error()
    }
  }
}
