/* eslint-disable default-param-last */
/* eslint-disable prefer-exponentiation-operator */
/* eslint-disable no-restricted-properties */
/* eslint-disable radix */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';

import Swal from 'sweetalert2';
import QueryString from 'query-string';
import moment from 'moment';
import Cookies from 'js-cookie';
import { callApi } from './requestUtils';
import {
  ACCESS_CONTROL_API_SRC,
  SAP_SRC,
  API_FILE,
} from '../containers/apiUrl';

function tradeAuthMode(arr, type) {
  const abc = arr && arr.find((i) => i.idIcon === type);
  if (abc) {
    switch (abc.idView) {
      case 'view1':
        return 1;
      case 'view2':
        return 2;
      case 'view3':
        return 3;
      default:
        return 0;
    }
  }
  return 0;
}

function foundAuthMode(number) {
  if (number) {
    switch (number) {
      case 1:
        return 'view1';
      case 2:
        return 'view2';
      case 3:
        return 'view3';
      default:
        return 0;
    }
  }
  return 0;
}
export const showErrorCustom = (
  callback,
  callbackFail,
  text,
  type,
  showConfirm,
  showCancel,
  colorConfirm,
  colorCancel,
  confirmText,
  cancelText,
  confirmClassCustom,
  cancelClassCustom,
) => {
  Swal.fire({
    text,
    icon: type,
    showCloseButton: true,
    focusConfirm: false,
    showConfirmButton: showConfirm,
    showCancelButton: showCancel,
    confirmButtonColor: colorConfirm,
    cancelButtonColor: colorCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonClass: confirmClassCustom || 'btn btn-detail-import-user',
    cancelButtonClass: cancelClassCustom || 'btn-stop-import-user',
    customClass: {
      header: 'icon-warning',
      content: 'content-class',
      actions: 'sweet-alert-btn-transform',
      closeButton: 'close-secondary',
    },
    // preConfirm() {
    //   return new Promise((resolve, reject) => {
    //     resolve({
    //       value: true,
    //     });
    //   });
    // },
  }).then((res) => {
    if (res.value) {
      callback();
    } else {
      callbackFail();
    }
  });
};
function showAlertError(error, intl) {
  return Swal.fire({
    title: intl
      ? intl.formatMessage({ id: 'app.title.error' })
      : 'Có lỗi xảy ra',
    text: error,
    icon: 'error',
    showCancelButton: false,
    showCloseButton: true,
    showConfirmButton: true,
    focusConfirm: true,
    confirmButtonColor: '#00554A',
    confirmButtonText: intl
      ? intl.formatMessage({ id: 'app.button.OK' })
      : 'Đồng ý',
    customClass: {
      content: 'content-class',
    },
  });
}
function showAlertConfirm(options, intl) {
  const defaultProps = {
    title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
    imageWidth: 213,
    showCancelButton: true,
    showCloseButton: true,
    showConfirmButton: true,
    focusCancel: true,
    reverseButtons: true,
    confirmButtonText: intl
      ? intl.formatMessage({ id: 'app.button.OK' })
      : 'Đồng ý',
    cancelButtonText: intl
      ? intl.formatMessage({ id: 'app.button.cancel' })
      : 'Hủy',
    customClass: {
      content: 'content-class',
      confirmButton: 'swal-btn-confirm',
    },
  };
  return Swal.fire({ ...defaultProps, ...options });
}

function showAlertSuccess(title, intl) {
  return Swal.fire({
    text: title,
    icon: 'success',
    showCancelButton: false,
    showCloseButton: true,
    showConfirmButton: true,
    focusConfirm: true,
    confirmButtonColor: '#00554A',
    confirmButtonText: intl
      ? intl.formatMessage({ id: 'app.button.OK' })
      : 'Đồng ý',
    customClass: {
      content: 'content-class',
    },
  });
}
function dateTimeFormat(date, time) {
  const d = moment(date).format('YYYY-MM-DD');
  const t = moment(time).format('HH:mm:ss.SSS');
  return `${d}T${t}`;
}

function convertDatetime(v) {
  return moment(v).format('HH:mm DD/MM/YYYY');
}

export function cvMiliToHHMMSS(v) {
  return moment(v).format('HH:mm:ss DD/MM/YYYY');
}

async function createChildrenAreaTree(
  parent,
  type,
  level,
  allowSelectParentLevel,
) {
  // level: 1 = zone, 2 = block, 3 = floor, 4 = unit

  const checkParent = parent && parent.itemData;

  let data;

  const fetchCamera = async (v, parentId) => {
    const params = utils.queryString({
      index: 1,
      pageSize: 500,
      areaId: v.areaId,
      zoneId: v.zoneId,
      blockId: v.blockId,
      floorId: v.floorId,
      type: 'CAMERA',
      isFilterTree: true,
    });
    const fc = await callApi(`devices?${params}`, 'GET');
    // const fc = await callApi(`${DEVICE_API_SRC}/devices?${params}`, 'GET');
    if (fc.code === 200) {
      return fc.data.data.map((i) => ({
        id: `cameraId_${v.blockId ? 'blockId_' : ''}${
          v.zoneId ? 'zoneId_' : ''
        }${v.floorId ? 'floorId' : ''}${i.id}`,
        cameraId: i.id,
        name: i.name,
        hasItems: false,
        code: i.code,
        parentId,
        type: i.type,
        status: i.status,
        fullItem: i,
      }));
    }
    return [];
  };

  if (checkParent && checkParent.type === 'zone') {
    const params = utils.queryString({
      page: 1,
      limit: 100,
      zoneCode: checkParent.code,
    });
    const fetchBlock = await callApi(`${SAP_SRC}/blocks?${params}`, 'GET');
    data =
      (fetchBlock &&
        fetchBlock.rows.map((i) => ({
          id: `blockId_${i.blockId}`,
          blockId: i.blockId,
          zoneId: i.zoneId,
          areaId: i.areaId,
          name: i.blockName,
          hasItems: allowSelectParentLevel || !(level && level === 2),
          code: i.blockCode,
          parentId: checkParent.id,
          type: 'block',
          level: 2,
        }))) ||
      [];
    if (type === 'CAMERA') {
      const a = await fetchCamera(
        { areaId: checkParent.areaId, zoneId: checkParent.zoneId },
        checkParent.id,
      );
      data = await data.concat(a);
    }
  } else if (checkParent && checkParent.type === 'block') {
    const params = utils.queryString({
      page: 1,
      limit: 100,
      blockId: checkParent.blockId,
    });
    const fetchFloors = await callApi(`${SAP_SRC}/floors?${params}`, 'GET');
    data =
      (fetchFloors &&
        fetchFloors.rows.map((i) => ({
          id: `floorId_${i.floorId}`,
          floorId: i.floorId,
          blockId: i.blockId,
          areaId: i.areaId,
          zoneId: i.zoneId,
          name: i.floorName,
          hasItems: !(level && level === 3),
          parentId: checkParent.id,
          type: 'floor',
          level: 3,
        }))) ||
      [];
    if (type === 'CAMERA') {
      const a = await fetchCamera(
        {
          blockId: checkParent.blockId,
          areaId: checkParent.areaId,
          zoneId: checkParent.zoneId,
        },
        checkParent.id,
      );
      data = await data.concat(a);
    }
  } else if (checkParent && checkParent.type === 'floor') {
    const params = utils.queryString({
      page: 1,
      limit: 100,
      floorId: checkParent.floorId,
    });
    const fetchUnit = await callApi(`${SAP_SRC}/units?${params}`, 'GET');
    data =
      (fetchUnit &&
        fetchUnit.rows.map((i) => ({
          id: `unitId_${i.unitId}`,
          unitId: i.unitId,
          floorId: i.floorId,
          blockId: i.blockId,
          areaId: i.areaId,
          zoneId: i.zoneId,
          name: i.unitName,
          hasItems: !(level && level === 4),
          parentId: checkParent.id,
          type: 'unit',
          level: 4,
        }))) ||
      [];
    if (type === 'CAMERA') {
      const a = await fetchCamera(
        {
          floorId: checkParent.floorId,
          blockId: checkParent.blockId,
          areaId: checkParent.areaId,
          zoneId: checkParent.zoneId,
        },
        checkParent.id,
      );
      data = await data.concat(a);
    }
  } else {
    data = [];
  }
  if (!checkParent) {
    const fetchZones = await callApi(`${SAP_SRC}/zones`, 'GET');
    data =
      (fetchZones &&
        fetchZones.map((i) => ({
          id: `zoneId_${i.zoneId}`,
          zoneId: i.zoneId,
          areaId: i.areaId,
          parentId: i.parentId,
          name: i.zoneName,
          hasItems: !(level && level === 1),
          code: i.zoneCode,
          type: 'zone',
          expanded: true,
          level: 1,
        }))) ||
      [];
  }
  return data;
}
function makeid(length) {
  const result = [];
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  return result.join('');
}

async function createChildrenDropDownTree(
  parent,
  api,
  elementTotal,
  dataDefault,
  allUrlApi,
) {
  const checkParent = parent && parent.itemData;
  let data;

  if (checkParent) {
    try {
      const parentId = parent.itemData.id;
      const apiEndpoint = api.includes('/children-lv1')
        ? `${api}?parentId=${parentId}`
        : `${api}/children-lv1?parentId=${parentId}`;

      const fetchAllGroupUser = await callApi(
        `${allUrlApi || ACCESS_CONTROL_API_SRC}/${apiEndpoint}`,
        'GET',
      );

      const arrAllGroup = fetchAllGroupUser.data || [];
      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          parentId: parentId,
          name: i.name,
          hasItems: i.isParent,
          pathOfTrees: i.pathOfTrees || [],
          total: (elementTotal && i[elementTotal]) || 0,
          expanded: dataDefault?.pathOfTrees?.find((e) => e === i.id) || false,
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  }

  if (!checkParent) {
    try {
      const apiEndpoint = api.includes('/children-lv1')
        ? api
        : `${api}/children-lv1`;

      const fetchAllGroupUser = await callApi(
        `${allUrlApi || ACCESS_CONTROL_API_SRC}/${apiEndpoint}`,
        'GET',
      );

      const arrAllGroup = fetchAllGroupUser.data || [];
      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          name: i.name,
          hasItems: i.isParent,
          totalUser: i[elementTotal] || 0,
          expanded: true,
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  } 

  return data || [];
}


async function createChildrenGroupUser(
  parent,
  api,
  elementTotal,
  allUrlApi,
  params,
) {
  const checkParent = parent && parent.itemData;
  // console.log('parent', parent);
  let data;

  if (checkParent) {
    const pathOfTreeLocalStorage = localStorage.getItem(`path-tree-of-${api}`);
    const convertPathOfTree = pathOfTreeLocalStorage
      ? JSON.parse(pathOfTreeLocalStorage)
      : [];
    try {
      const fetchAllGroupUser = await callApi(
        params
          ? `${allUrlApi || ACCESS_CONTROL_API_SRC}/${
              api || 'user-groups'
            }/children-lv1?parentId=${parent.itemData.id}&${params}`
          : `${allUrlApi || ACCESS_CONTROL_API_SRC}/${
              api || 'user-groups'
            }/children-lv1?parentId=${parent.itemData.id}`,
        'GET',
      );
      const arrAllGroup = fetchAllGroupUser.data || [];
      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          categoryId: parent.itemData.id,
          name: i.name,
          hasItems: i.isParent,
          total: i[elementTotal] || 0,
          expanded:
            convertPathOfTree?.pathOfTrees?.find((e) => e === i.id) || false,
          level: i.pathOfTrees?.length || 0,
          pathOfTrees: i.pathOfTrees,
          type: api,
          ...i
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  }



  // if (!checkParent) {
  //   try {
  //     const fetchAllGroupUser = await callApi(
  //       `${ACCESS_CONTROL_API_SRC}/user-groups/children-lv1`,
  //       'GET',
  //     );
  //     const arrAllGroup = fetchAllGroupUser.data || [];
  //     data =
  //       [
  //         {
  //           id: 1,
  //           name: 'All Group',
  //           expanded: true,
  //           hasItems: true,
  //         },
  //       ].concat(
  //         arrAllGroup?.map(i => ({
  //           id: i.id,
  //           categoryId: 1,
  //           name: i.name,
  //           hasItems: i.isParent,
  //           totalUser: i.totalUser || 0,
  //           // expanded: true,
  //         })),
  //       ) || [];
  //   } catch (error) {
  //     utils.showToastErrorCallApi(error);
  //   }
  // }

  return data || [];
}

async function createChildrenGroupLocal(
  parent,
  api,
  elementTotal,
  allUrlApi,
  params,
) {
  const checkParent = parent && parent.itemData;
  // console.log('parent', parent);
  let data;

  if (checkParent) {
    const pathOfTreeLocalStorage = localStorage.getItem(`path-tree-of-${api}`);
    const convertPathOfTree = pathOfTreeLocalStorage
      ? JSON.parse(pathOfTreeLocalStorage)
      : [];
    try {
      const fetchAllGroupUser = await callApi(
        params
          ? `${allUrlApi || ACCESS_CONTROL_API_SRC}/?parentId=${parent.itemData.id}&${params}`
          : `${allUrlApi || ACCESS_CONTROL_API_SRC}/?parentId=${parent.itemData.id}`,
        'GET',
      );
      const arrAllGroup = fetchAllGroupUser.data || [];
      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          categoryId: parent.itemData.id,
          name: i.name,
          hasItems: i.isParent,
          total: i[elementTotal] || 0,
          expanded:
            convertPathOfTree?.pathOfTrees?.find((e) => e === i.id) || false,
          level: i.pathOfTrees?.length || 0,
          pathOfTrees: i.pathOfTrees,
          type: api,
          ...i,
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  }
return data || [];
}
async function createChildrenDropDownTreeAutoShowData(
  parent,
  api,
  elementTotal = 0,
  dataCheck,
  params,
) {
  const checkParent = parent && parent.itemData;

  let data;

  if (checkParent) {
    try {
      const fetchAllGroupUser = await callApi(
        params
          ? `${ACCESS_CONTROL_API_SRC}/${
              api || 'user-groups'
            }/children-lv1?parentId=${parent.itemData.id}&${params}`
          : `${ACCESS_CONTROL_API_SRC}/${
              api || 'user-groups'
            }/children-lv1?parentId=${parent.itemData.id}`,
        'GET',
      );
      const arrAllGroup = fetchAllGroupUser.data || [];

      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          parentId: parent.itemData.id,
          name: i.name,
          hasItems: i.isParent,
          total: i[elementTotal] || 0,
          expanded:
            dataCheck?.find((e) => e?.pathOfTrees?.find((o) => o === i.id)) ||
            false,
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  }

  if (!checkParent) {
    try {
      const fetchAllGroupUser = await callApi(
        params
          ? `${ACCESS_CONTROL_API_SRC}/${
              api || 'user-groups'
            }/children-lv1?${params}`
          : `${ACCESS_CONTROL_API_SRC}/${api || 'user-groups'}/children-lv1`,
        'GET',
      );
      const arrAllGroup = fetchAllGroupUser.data || [];
      data =
        arrAllGroup?.map((i) => ({
          id: i.id,
          name: i.name,
          hasItems: i.isParent,
          totalUser: i[elementTotal] || 0,
          expanded: true,
        })) || [];
    } catch (error) {
      utils.showToastErrorCallApi(error);
    }
  }

  return data || [];
}

export {
  showAlertError,
  showAlertConfirm,
  showAlertSuccess,
  dateTimeFormat,
  tradeAuthMode,
  foundAuthMode,
  createChildrenAreaTree,
  makeid,
  convertDatetime,
  createChildrenDropDownTree,
  createChildrenGroupUser,
  createChildrenDropDownTreeAutoShowData,
  createChildrenGroupLocal,
};
const utils = {
  queryString(dto) {
    return QueryString.stringify(dto);
  },
  createArray(number) {
    return [...new Array(number)];
  },
  convertStringToArray(str) {
    const converPath = str.split(/[_]+/).map((i) => i.trim());
    return converPath;
  },

  createFakeData(number, obj) {
    const newDto = {
      list: [...new Array(number)].map((item, index) => ({
        ...obj,
        id: index + 1,
      })),
      totalCount: number,
      totalPage: 1,
      loading: true,
    };
    return newDto;
  },

  showAlertDelete(title, html, callback) {
    return Swal.fire({
      title,
      html,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#00554A',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không',
    }).then((result) => callback(result));
  },
  showToast(text, icon = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    return Toast.fire({
      icon,
      title: text,
    });
  },
  showToastErrorCallApi(error, icon = 'error') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    return Toast.fire({
      icon,
      title: error.response?.data?.message || 'Error',
    });
  },
  searchLocal(searchLabel, searchList, searchValue) {
    const textSearch = searchValue ? searchValue.trim() : '';
    if (searchValue) {
      const results = searchList.filter(
        (e) =>
          e[searchLabel] &&
          e[searchLabel]
            .toString()
            .toLowerCase()
            .replace('-', '')
            .search(
              textSearch
                ? textSearch.toString().toLowerCase().replace('-', '')
                : '',
            ) !== -1,
      );
      return results || [];
    }
    return searchList || [];
  },
  genStatusCamera(v) {
    switch (v) {
      case 'ONLINE':
        return {
          color: '#32D74B',
          text: 'Trực tuyến',
        };
      default:
        return {
          color: 'rgba(60, 60, 67, 0.6)',
          text: 'Không khả dụng',
        };
    }
  },
  makeid,
};

export const uniqueElements = (arr, ele) => {
  const newArr = arr
    .map((v) => v[ele])
    .map((v, i, array) => array.indexOf(v) === i && i)
    .filter((v) => arr[v])
    .map((v) => arr[v]);
  return newArr;
};

export const checkObject = (data) => {
  try {
    JSON.parse(data);
    return JSON.parse(data);
  } catch (error) {
    if (data) {
      // this.showNotify('warning', _gui.alertVerifyObject);
      return false;
    }
    return {};
  }
};

export const validationSchema = (data) => {
  const useYupValidationResolver = (d) =>
    useCallback(
      async (data) => {
        try {
          const values = await d.validate(data, {
            abortEarly: false,
          });

          return {
            values,
            errors: {},
          };
        } catch (errors) {
          return {
            values: {},
            errors: errors.inner.reduce(
              (allErrors, currentError) => ({
                ...allErrors,
                [currentError.path]: {
                  type: currentError.type ?? 'validation',
                  message: currentError.message,
                },
              }),
              {},
            ),
          };
        }
      },
      [d],
    );
  const aaa = useMemo(
    () =>
      yup.object({
        ...data,
      }),
    [],
  );
  return useYupValidationResolver(aaa);
};

export const buildUrlWithToken = (url) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    return `${url}?token=${token}`;
  }
  return url;
};

export const clearLoginData = (reload = false) => {
  window.localStorage.setItem('token', '');
  window.localStorage.setItem('userData', '');
  window.localStorage.setItem('userInfo', '');
  window.localStorage.setItem('username', '');
  Cookies.remove('expired_time');
  Cookies.remove('refresh_token');
  // window.location = '/';
  if (reload) {
    window.location.reload();
  }
};

export const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const count = seconds + minutes * 60 + hours * 3600;
  return count;
};

export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
};

export const getImageUrlFromMinio = (url = '') => {
  const token = window.localStorage.getItem('token');
  if (token) {
    let path = url;
    if (url.includes('http')) {
      const split = url.split('/');
      path = split.splice(3, 3).join('/');
    }
    return buildUrlWithToken(API_FILE.DOWNLOAD_FILE_API(path));
  }
  return '';
};

export const convertTimeToMinute = (time) => {
  const res = (time / 1440) * 100;
  return res;
};

export const getAttrFromTinyMceContent = (str, node, attr) => {
  let result;
  const res = [];
  const regex = new RegExp(`<${node} .*?${attr}="(.*?)"`, 'gi');
  // eslint-disable-next-line no-cond-assign
  while ((result = regex.exec(str))) {
    res.push(result[1]);
  }
  return res;
};

export const removeTokenInSrc = (src) => src.split('?token=')[0] || '';

export const removeTokenBeforeUploadTinyMceContent = (content) => {
  const imgSrcInContent = getAttrFromTinyMceContent(content, 'img', 'src');
  let newContent = content;
  imgSrcInContent.forEach((src) => {
    const newSrc = removeTokenInSrc(src);
    newContent = newContent.replace(src, newSrc);
  });

  return newContent;
};

// export const addTokenToViewTinyMceContent = content => {
//   const imgSrcInContent = getAttrFromTinyMceContent(content, 'img', 'src');
//   let newContent = content;
//   imgSrcInContent.forEach(src => {
//     const newSrc = buildUrlWithToken(src);
//     newContent = newContent.replace(src, newSrc);
//   });

//   return newContent;
// };

export const getUniqueArr = (arr, comp) => {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
};

export const getParam = (params) => {
  const converPath = params.substring(1);
  const obj = Object.fromEntries(new URLSearchParams(converPath));
  return obj;
};

export const checkSortTable = (arrSortSaveLocal, arrSortDefault) => {
  const result = arrSortSaveLocal.reduce((finalList, item) => {
    const found = arrSortDefault.find((i) => i.key === item.key);
    if (item) {
      finalList.push(found);
    }
    return finalList;
  }, []);
  return result;
};

export default utils;
