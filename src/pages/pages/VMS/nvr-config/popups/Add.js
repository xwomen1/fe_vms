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
  Checkbox,
  FormControlLabel,
  Box,
  Tab,
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
import { format_form, initValues, apiUrl } from '../../Mocdata/camera';
import TableCustom from 'components/TableCustom';
import styled from 'styled-components';
import { IconBroadCast } from 'components/Custom/Icon/ListIcon';
import { MapPin } from 'tabler-icons-react';
import TreeSelect from 'components/TreeSelect';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
  ValidationRule,
} from 'devextreme-react/data-grid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactMapGL, { Marker, Popup } from '@goongmaps/goong-map-react';

export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState(format_form);
  const validation = {};
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
      if(item.type=='TreeSelect'){
        validation[item.name] = yup.object().nullable().required('Trường này bắt buộc nhập');
      }
    }
  });

  const schema = validationSchema(validation);
  const fetchDataSource = () => {
    setLoading(true);
    getApi(`${apiUrl}/${id}`)
      .then((response) => {
        const setData = response.data;

        // setData.area = {
        //   id: response?.data?.areaId,
        //   name: response?.data?.areaName,
        // };
        
        if(setData?.latitude && setData?.longitude){
          setLat(setData.latitude);
          setLng(setData.longitude);
          setViewport({
            longitude: setData.longitude,
            latitude: setData.latitude,
            zoom: 14,
          })
        }
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
    format_form.map((item, index) => {
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
      dataField: 'proxiedURL',
      caption: 'Proxied URL',
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
            {form.map((item) => {
              if (item.type == 'TreeSelect') {
                return (
                  <Grid item xs={item.width}>
                    <FormControl error={errors[item.name]} fullWidth>
                      <FormLabel required={item?.require}>{item.label}</FormLabel>
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
                              searchEnabled
                              // hasItemsExpr={(node) => !node?.isParent}
                              parentIdExpr="parentID"
                              hasItemsExpr="isParent"
                              loadData={(node) =>
                                new Promise((resolve, reject) => {
                                  // let url = SAP_API.ROOT_ZONES + '?parentId=a59d4cd5-eacf-40b5-afc5-98fad93fb2f8';
                                  let url = item.url;
                                  console.log(node);
                                  if (node?.key) {
                                    url = item.url + '&parentID='+node?.key;
                                  }
                                  getApi(url)
                                    .then((ret) => {
                                      resolve(ret.data);
                                    })
                                    .catch((err) => reject(err));
                                })
                                
                              }
                              error={errors[item.name]}
                              helperText={errors[item.name]?.message}
                            />
                        )}
                      />
                      {errors[item.name] && (
                        <FormHelperText style={{ color: '#f44336' }}>
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
                    <FormControl error={errors[item.name]} fullWidth>
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
                            helperText={errors[item.name]?.message}
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
                    <FormControl error={errors[item.name]} fullWidth>
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
                            getOptionSelected={(option, selected) =>
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
                          />
                        )}
                      />
                      {errors[item.name] && (
                        <FormHelperText style={{ color: '#f44336' }}>
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
                    <FormControl error={errors[item.name]} fullWidth>
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
                                onChange={(e) => {
                                  props.onChange(e.target.checked);
                                }}
                              />
                            }
                            label={item.label}
                            // labelPlacement="start"
                          />
                        )}
                      />
                      {errors[item.name] && (
                        <FormHelperText style={{ color: '#f44336' }}>
                          {errors[item.name]?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                );
              }
            })}
            {viewport && (
              <Grid item xs={12}>
                <ReactMapGL
                  {...viewport}
                  width="100%"
                  height="30vh"
                  onViewportChange={setViewport}
                  goongApiAccessToken={GOONG_MAP_KEY}
                  onClick={(location) => {
                    setLat(location.lngLat[1]);
                    setLng(location.lngLat[0]);
                    setValue('latitude', location.lngLat[1]);
                    setValue('longitude', location.lngLat[0]);
                  }}
                >
                  {lat && lng && (
                    <Marker
                      latitude={parseFloat(lat)}
                      longitude={parseFloat(lng)}
                      offsetLeft={-20}
                      offsetTop={-20}
                    >
                      <div
                      // style={{transform: `scale(0.08)`}}
                      // style={{zoom: '8%'}}
                      >
                        <MapPin size={48} strokeWidth={2} color={'#bf40ba'} />
                      </div>
                    </Marker>
                  )}
                </ReactMapGL>
              </Grid>
            )}
            <Grid item xs={12}>
              <h3> Kênh </h3>
              <TableCustomWrap>
                <Controller
                  control={control}
                  name="streams"
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
                        allowUpdating: true,
                        allowDeleting: true,
                        useIcons: true,
                        newRowPosition: 'last',
                      }}
                      pagingProps={{ enabled: true, pageSize: 20 }}
                      onInitNewRow={(e) => {
                        e.data = {
                          name: null,
                          proxiedURL: null,
                          type: null,
                          url: null
                        };
                      }}
                    >
                      {React.Children.toArray(
                        channelCol.map((defs) => (
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
          
          </Grid>
        </PerfectScrollbar>
        <DialogActions style={{ marginTop: 36 }}>
          <Button onClick={onClose} variant="contained">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            {id ? 'Lưu' : 'Thêm'}
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
