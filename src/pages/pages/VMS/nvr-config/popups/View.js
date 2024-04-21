import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Tab,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../../Loading';
import { getErrorMessage } from '../../../Common/function';
import { useStyles } from '../../../styled';
import { GOONG_MAP_KEY } from 'containers/apiUrl';
import {
  format_form,
  initValues,
  apiUrl,
  network_TCP_form,
  network_DDNS_form,
  network_port_form,
  network_Nat_form,
  image_img_form,
  image_ODS_form,
  video_video_form,
  video_audio_form,
} from '../../Mocdata/camera';
import TableCustom from 'components/TableCustom';
import styled from 'styled-components';
import { IconBroadCast } from 'components/Custom/Icon/ListIcon';
import { MapPin } from 'tabler-icons-react';
import Slider from '@mui/material/Slider';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactMapGL, { Marker, Popup } from '@goongmaps/goong-map-react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import TreeSelect from 'components/TreeSelect';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
  ValidationRule,
} from 'devextreme-react/data-grid';
export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState([
    ...format_form,
    ...network_TCP_form,
    ...network_DDNS_form,
    ...network_port_form,
    ...network_Nat_form,
    ...image_img_form,
    ...image_ODS_form,
    ...video_video_form,
    ...video_audio_form,
  ]);
  const form_list = [
    {
      tab: 'Camera',
      type: 'only',
      data: format_form,
    },
    {
      tab: 'Network',
      type: 'multi',
      data: [
        {
          tab: 'TCP/IP',
          data: network_TCP_form,
        },
        {
          tab: 'DDNS',
          data: network_DDNS_form,
        },
        {
          tab: 'Port',
          data: network_port_form,
        },
        {
          tab: 'NAT',
          data: network_Nat_form,
        },
      ],
    },
    {
      tab: 'Hình ảnh',
      type: 'multi',
      data: [
        {
          tab: 'Hình ảnh',
          data: image_img_form,
        },
        {
          tab: 'ODS',
          data: image_ODS_form,
        },
      ],
    },
    {
      tab: 'Video',
      type: 'multi',
      data: [
        {
          tab: 'Video',
          data: video_video_form,
        },
        {
          tab: 'Audio',
          data: video_audio_form,
        },
      ],
    },
  ];
  const validation = {};
  const [tab, setTab] = useState(`1`);
  // --- Map
  const [viewport, setViewport] = React.useState({
    longitude: 105.83416,
    latitude: 21.027763,
    zoom: 14,
  });
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  format_form.map((item) => {
    if (item.require) {
      if (item.type == 'TextField') {
        validation[item.name] = yup
          .string()
          .nullable()
          .trim()
          .required('Trường này bắt buộc nhập');
      }
      if (item.type == 'VAutocomplete') {
        validation[item.name] = yup
          .object()
          .nullable()
          .required('Trường này bắt buộc nhập');
      }
    }
  });

  const schema = validationSchema(validation);
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${apiUrl}/${id}`)
      .then((response) => {
        const setData = response.data;

        setData.area = {
          id: response?.data?.areaId,
          name: response?.data?.areaName,
        };
        setDetail(setData);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: schema,
  });

  useEffect(() => {
    form.map((item, index) => {
      if (item.type == 'VAutocomplete' && item.url) {
        getApi(item.url)
          .then((response) => {
            let newForm = [...form];
            newForm[index].data = response.data;
            setForm(newForm);
          })
          .catch((err) => {
            showError(err);
          });
      }
    });
    if (id) {
      fetchDataSource();
    }
  }, [id]);
  const setDetailFormValue = () => {
    reset(detail);
    console.log(detail);
  };

  useEffect(() => {
    if (detail) {
      setDetailFormValue();
    }
  }, [detail]);
  useEffect(() => {
    reset({ ...initValues, ...filter });
  }, [filter]);
  const onSubmit = (values) => {
    setLoading(true);
    // const params = {};
    // for(let i=0 ; values.length; i++){
    //   if(values[format_form[i].name]){
    //     params[item.name] = values[item.name]
    //   }
    // }
    const params = {
      ...values,
    };

    console.log(values);
    if (id) handleUpdate(params);
    else handleAdd(params);
  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(apiUrl, params)
      .then(() => {
        showSuccess('Thêm mới thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleUpdate = (params) => {
    setLoading(true);
    putApi(`${apiUrl}/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload();
        onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let timeout = useMemo(() => undefined, []);
  const channelCol = [
    // {
    //   caption: 'STT',
    //   cellRender: (props) => (<p> {props?.rowIndex + 1} </p>),
    //   width: '40',
    // },
    {
      dataField: 'name',
      caption: 'Channel Name',
      required: true,
    },
    {
      dataField: 'url',
      caption: 'Channel URL',
      required: true,
    },
    {
      dataField: 'type',
      caption: 'Stream Type',
      required: true,
    },
  ];
  return (
    <div>
      <form className={classes.modal}>
        {loading && <Loading />}

        <PerfectScrollbar
          style={{
            height: '100%',
            maxHeight: 'calc(100vh - 205px)',
            overflowX: 'hidden',
            width: '100%',
          }}
        >
          <Grid container spacing={2}>
            {tab && (
              <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(vl, idx) => {
                      setTab(idx);
                    }}
                  >
                    {form_list.map((text, id) => (
                      <Tab label={text.tab} value={`${id + 1}`} />
                    ))}
                  </TabList>
                </Box>

                {form_list.map((data, id) => {
                  if (data.type == 'only') {
                    return (
                      <TabPanel value={`${id + 1}`}>
                        <Grid container spacing={2}>
                          {data.data.map((item) => {
                            if (item.type == 'TreeSelect') {
                              return (
                                <Grid item xs={item.width}>
                                  <FormControl
                                    error={errors[item.name]}
                                    fullWidth
                                  >
                                    <FormLabel required={item?.require}>
                                      {item.label}
                                    </FormLabel>
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={(props) => (
                                        <TreeSelect
                                          showClearButton={false}
                                          value={props.value}
                                          onValueChanged={(newVal) => {
                                            // formik.setFieldValue('area', newVal);
                                            props.onChange(newVal);
                                          }}
                                          placeholder={item.placeholder}
                                          keyExpr="id"
                                          displayExpr="name"
                                          // searchEnabled
                                          // hasItemsExpr={(node) => !node?.isParent}
                                          // parentIdExpr="parentId"
                                          hasItemsExpr="isParent"
                                          loadData={(node) =>
                                            new Promise((resolve, reject) => {
                                              // let url = SAP_API.ROOT_ZONES + '?parentId=a59d4cd5-eacf-40b5-afc5-98fad93fb2f8';
                                              let url = item.url;
                                              console.log(node);
                                              if (node?.key) {
                                                url =
                                                  item.url +
                                                  '?parentId=' +
                                                  node?.key;
                                              }
                                              getApi(url)
                                                .then((ret) => {
                                                  resolve(ret.data);
                                                })
                                                .catch((err) => reject(err));
                                            })
                                          }
                                          error={errors[item.name]}
                                          helperText={
                                            errors[item.name]?.message
                                          }
                                          disabled
                                        />
                                      )}
                                    />
                                    {errors[item.name] && (
                                      <FormHelperText
                                        style={{ color: '#f44336' }}
                                      >
                                        {errors[item.name]?.message}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                              );
                            }
                            if (item.type == 'TextField') {
                              return (
                                <Grid item xs={item.width}>
                                  <FormControl
                                    error={errors[item.name]}
                                    fullWidth
                                  >
                                    <FormLabel required={item?.require}>
                                      {item.label}
                                    </FormLabel>
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={(props) => (
                                        <TextField
                                          autoComplete="off"
                                          inputProps={{ maxLength: 50 }}
                                          fullWidth
                                          placeholder={item.placeholder}
                                          value={props.value}
                                          onChange={(e) => {
                                            props.onChange(e.target.value);
                                          }}
                                          variant="outlined"
                                          size="small"
                                          error={errors[item.name]}
                                          helperText={
                                            errors[item.name]?.message
                                          }
                                          disabled
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Grid>
                              );
                            }
                            if (item.type == 'VAutocomplete') {
                              return (
                                <Grid item xs={item.width}>
                                  <FormControl
                                    error={errors[item.name]}
                                    fullWidth
                                  >
                                    <FormLabel required={item?.require}>
                                      {item.label}
                                    </FormLabel>
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={(props) => (
                                        <VAutocomplete
                                          value={props.value}
                                          fullWidth
                                          placeholder={item.placeholder}
                                          noOptionsText="Không có dữ liệu"
                                          getOptionLabel={(option) =>
                                            option[item.option.value]
                                          }
                                          firstIndex={1}
                                          getOptionSelected={(
                                            option,
                                            selected,
                                          ) =>
                                            option[item.option.key] ==
                                            selected[item.option.key]
                                          }
                                          loadData={(page, keyword) => {
                                            return {
                                              data: item.data,
                                              totalCount: item.data.length,
                                            };
                                          }}
                                          onChange={(e, value) => {
                                            props.onChange(value);
                                          }}
                                          disabled
                                        />
                                      )}
                                    />
                                    {errors[item.name] && (
                                      <FormHelperText
                                        style={{ color: '#f44336' }}
                                      >
                                        {errors[item.name]?.message}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                              );
                            }
                            if (item.type == 'Slider') {
                              return (
                                <Grid item xs={item.width}>
                                  <FormControl
                                    error={errors[item.name]}
                                    fullWidth
                                  >
                                    <FormLabel required={item?.require}>
                                      {item.label}
                                    </FormLabel>
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={(props) => (
                                        <Slider
                                          aria-label={item.label}
                                          value={props.value}
                                          onChange={(e) => {
                                            props.onChange(e.target.value);
                                          }}
                                          onChangeCommitted={() => {}}
                                          disabled
                                        />
                                      )}
                                    />
                                    {errors[item.name] && (
                                      <FormHelperText
                                        style={{ color: '#f44336' }}
                                      >
                                        {errors[item.name]?.message}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                              );
                            }
                            if (item.type == 'Checkbox') {
                              return (
                                <Grid item xs={item.width}>
                                  <FormControl
                                    error={errors[item.name]}
                                    fullWidth
                                  >
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      render={(props) => (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              style={{ marginLeft: '5px' }}
                                              checked={props.value}
                                              color="primary"
                                              disabled
                                            />
                                          }
                                          label={item.label}
                                          // labelPlacement="start"
                                        />
                                      )}
                                    />
                                    {errors[item.name] && (
                                      <FormHelperText
                                        style={{ color: '#f44336' }}
                                      >
                                        {errors[item.name]?.message}
                                      </FormHelperText>
                                    )}
                                  </FormControl>
                                </Grid>
                              );
                            }
                            if (item.type == 'Datagrid') {
                              return (
                                <Grid item xs={12}>
                                  <h3> {item.label} </h3>
                                  <TableCustomWrap>
                                    <Controller
                                      control={control}
                                      name={item.name}
                                      defaultValue=""
                                      render={(props) => (
                                        <TableCustom
                                          hideTable={false}
                                          data={props.value}
                                          onRowRemoving={(e) => {
                                            console.log(e);
                                          }}
                                          scrolling={{ mode: 'virtual' }}
                                          editing={{
                                            mode: 'cell',
                                            allowAdding: false,
                                            allowUpdating: false,
                                            allowDeleting: false,
                                            useIcons: false,
                                            newRowPosition: 'last',
                                          }}
                                          pagingProps={{
                                            enabled: false,
                                            pageSize: 20,
                                          }}
                                          onInitNewRow={(e) => {
                                            e.data = item?.default;
                                          }}
                                        >
                                          {React.Children.toArray(
                                            item.colume.map((defs) => (
                                              <Column {...defs}>
                                                {defs?.requied && (
                                                  <ValidationRule type="required" />
                                                )}
                                              </Column>
                                            )),
                                          )}
                                        </TableCustom>
                                      )}
                                    />
                                  </TableCustomWrap>
                                </Grid>
                              );
                            }
                            
                          })}
                        </Grid>
                      </TabPanel>
                    );
                  } else {
                    return (
                      <>
                        {data.data.map((it) => (
                          <TabPanel value={`${id + 1}`}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <h3>{it.tab}</h3>
                              </Grid>
                              {it.data.map((item) => {
                                if (item.type == 'TreeSelect') {
                                  return (
                                    <Grid item xs={item.width}>
                                      <FormControl
                                        error={errors[item.name]}
                                        fullWidth
                                      >
                                        <FormLabel required={item?.require}>
                                          {item.label}
                                        </FormLabel>
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          render={(props) => (
                                            <TreeSelect
                                              showClearButton={false}
                                              value={props.value}
                                              onValueChanged={(newVal) => {
                                                // formik.setFieldValue('area', newVal);
                                                props.onChange(newVal);
                                              }}
                                              placeholder={item.placeholder}
                                              keyExpr="id"
                                              displayExpr="name"
                                              // searchEnabled
                                              // hasItemsExpr={(node) => !node?.isParent}
                                              // parentIdExpr="parentId"
                                              hasItemsExpr="isParent"
                                              loadData={(node) =>
                                                new Promise(
                                                  (resolve, reject) => {
                                                    // let url = SAP_API.ROOT_ZONES + '?parentId=a59d4cd5-eacf-40b5-afc5-98fad93fb2f8';
                                                    let url = item.url;
                                                    console.log(node);
                                                    if (node?.key) {
                                                      url =
                                                        item.url +
                                                        '?parentId=' +
                                                        node?.key;
                                                    }
                                                    getApi(url)
                                                      .then((ret) => {
                                                        resolve(ret.data);
                                                      })
                                                      .catch((err) =>
                                                        reject(err),
                                                      );
                                                  },
                                                )
                                              }
                                              error={errors[item.name]}
                                              helperText={
                                                errors[item.name]?.message
                                              }
                                              disabled
                                            />
                                          )}
                                        />
                                        {errors[item.name] && (
                                          <FormHelperText
                                            style={{ color: '#f44336' }}
                                          >
                                            {errors[item.name]?.message}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Grid>
                                  );
                                }
                                if (item.type == 'TextField') {
                                  return (
                                    <Grid item xs={item.width}>
                                      <FormControl
                                        error={errors[item.name]}
                                        fullWidth
                                      >
                                        <FormLabel required={item?.require}>
                                          {item.label}
                                        </FormLabel>
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          render={(props) => (
                                            <TextField
                                              autoComplete="off"
                                              inputProps={{ maxLength: 50 }}
                                              fullWidth
                                              placeholder={item.placeholder}
                                              value={props.value}
                                              onChange={(e) => {
                                                props.onChange(e.target.value);
                                              }}
                                              variant="outlined"
                                              size="small"
                                              error={errors[item.name]}
                                              helperText={
                                                errors[item.name]?.message
                                              }
                                              disabled
                                            />
                                          )}
                                        />
                                      </FormControl>
                                    </Grid>
                                  );
                                }
                                if (item.type == 'VAutocomplete') {
                                  return (
                                    <Grid item xs={item.width}>
                                      <FormControl
                                        error={errors[item.name]}
                                        fullWidth
                                      >
                                        <FormLabel required={item?.require}>
                                          {item.label}
                                        </FormLabel>
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          render={(props) => (
                                            <VAutocomplete
                                              value={props.value}
                                              fullWidth
                                              placeholder={item.placeholder}
                                              noOptionsText="Không có dữ liệu"
                                              getOptionLabel={(option) =>
                                                option[item.option.value]
                                              }
                                              firstIndex={1}
                                              getOptionSelected={(
                                                option,
                                                selected,
                                              ) =>
                                                option[item.option.key] ==
                                                selected[item.option.key]
                                              }
                                              loadData={(page, keyword) => {
                                                return {
                                                  data: item.data,
                                                  totalCount: item.data.length,
                                                };
                                              }}
                                              onChange={(e, value) => {
                                                props.onChange(value);
                                              }}
                                              disabled
                                            />
                                          )}
                                        />
                                        {errors[item.name] && (
                                          <FormHelperText
                                            style={{ color: '#f44336' }}
                                          >
                                            {errors[item.name]?.message}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Grid>
                                  );
                                }
                                if (item.type == 'Slider') {
                                  return (
                                    <Grid item xs={item.width}>
                                      <FormControl
                                        error={errors[item.name]}
                                        fullWidth
                                      >
                                        <FormLabel required={item?.require}>
                                          {item.label}
                                        </FormLabel>
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          render={(props) => (
                                            <Slider
                                              aria-label={item.label}
                                              value={props.value}
                                              onChange={(e) => {
                                                props.onChange(e.target.value);
                                              }}
                                              onChangeCommitted={() => {}}
                                              disabled
                                            />
                                          )}
                                        />
                                        {errors[item.name] && (
                                          <FormHelperText
                                            style={{ color: '#f44336' }}
                                          >
                                            {errors[item.name]?.message}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Grid>
                                  );
                                }
                                if (item.type == 'Checkbox') {
                                  return (
                                    <Grid item xs={item.width}>
                                      <FormControl
                                        error={errors[item.name]}
                                        fullWidth
                                      >
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          render={(props) => (
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  style={{ marginLeft: '5px' }}
                                                  checked={props.value}
                                                  color="primary"
                                                  disabled
                                                />
                                              }
                                              label={item.label}
                                              // labelPlacement="start"
                                            />
                                          )}
                                        />
                                        {errors[item.name] && (
                                          <FormHelperText
                                            style={{ color: '#f44336' }}
                                          >
                                            {errors[item.name]?.message}
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                    </Grid>
                                  );
                                }
                                if (item.type == 'Datagrid') {
                                  return (
                                    <Grid item xs={12}>
                                      <h3> {item.label} </h3>
                                      <TableCustomWrap>
                                        <Controller
                                          control={control}
                                          name={item.name}
                                          defaultValue=""
                                          render={(props) => (
                                            <TableCustom
                                              hideTable={false}
                                              data={props.value}
                                              onRowRemoving={(e) => {
                                                console.log(e);
                                              }}
                                              scrolling={{ mode: 'virtual' }}
                                              editing={{
                                                mode: 'cell',
                                                allowAdding: true,
                                                allowUpdating: false,
                                                allowDeleting: false,
                                                useIcons: false,
                                                newRowPosition: 'last',
                                              }}
                                              pagingProps={{
                                                enabled: true,
                                                pageSize: 20,
                                              }}
                                              onInitNewRow={(e) => {
                                                e.data = item?.default;
                                              }}
                                            >
                                              {React.Children.toArray(
                                                item.colume.map((defs) => (
                                                  <Column {...defs}>
                                                    {defs?.requied && (
                                                      <ValidationRule type="required" />
                                                    )}
                                                  </Column>
                                                )),
                                              )}
                                            </TableCustom>
                                          )}
                                        />
                                      </TableCustomWrap>
                                    </Grid>
                                  );
                                }
                              })}
                            </Grid>
                          </TabPanel>
                        ))}
                      </>
                    );
                  }
                })}
              </TabContext>
            )}
          </Grid>
        </PerfectScrollbar>
        <DialogActions style={{ marginTop: 36 }}>
          <Button onClick={onClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

const TableCustomWrap = styled.div`
  .dx-datagrid-nodata {
    display: none;
  }
  .dx-visibility-change-handler {
    min-height: auto !important;
  }
  .dx-fileuploader-files-container {
    height: 0px;
    padding: 0px !important;
  }
`;

export default Add;
