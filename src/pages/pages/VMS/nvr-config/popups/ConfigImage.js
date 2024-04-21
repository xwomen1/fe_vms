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
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
import Switch from '@mui/material/Switch';
import DatePicker from 'components/DatePicker';

// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../../Loading';
import { getErrorMessage } from '../../../Common/function';
import { useStyles } from '../../../styled';
import {
  image_img_form,
  image_ODS_form,
  initValues,
  apiUrl,
} from '../../NVRConfig/Mocdata/camera';
import TableCustom from 'components/TableCustom';
import styled from 'styled-components';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
  ValidationRule,
} from 'devextreme-react/data-grid';
import Slider from '@mui/material/Slider';
export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState([
    ...image_img_form,
    ...image_ODS_form,
  ]);
  const listlevel = [
    {
      id: '1',
      name: 'Rất thấp',
    },
    {
      id: '2',
      name: 'Thấp',
    },
    {
      id: '3',
      name: 'Trung bình',
    },
    {
      id: '4',
      name: 'Cao',
    },
    {
      id: '5',
      name: 'Rất cao',
    },
  ]
  const form_list = [
    // {
    //   tab: 'Hình ảnh',
    //   data: image_img_form,
    // },
    {
      tab: 'ODS',
      data: image_ODS_form,
    },
  ];
  const [validation, setValidation] = useState(null);
  const [tab, setTab] = useState(`1`);
  useEffect(() => {
    const validation = {};
    form.map((item) => {
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
    setValidation(validation);
  }, [form]);

  const fetchDataSource = () => {
    setLoading(true);
    getApi(`https://sbs.basesystem.one/ivis/vms/api/v0/datamockup/osd
    `)
      .then((response) => {
        const setData = response.data;

        setData.area = {
          id: response?.data?.areaId,
          name: response?.data?.areaName,
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
    // setError,
    // setValue,
    reset,
    // clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initValues,
    resolver: validationSchema(validation),
  });

  useEffect(() => {
    form.map((item, index) => {
      if (item.type == 'VAutocomplete' && item.url) {
        getApi(item.url)
          .then((response) => {
            let newForm = [...form];
            newForm[index].data = response;
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
      name: values?.deviceName,
      areaId: values?.area?.id,
      areaName: values?.area?.name,
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

  // let timeout = useMemo(() => undefined, []);
  // const channelCol = [
  //   // {
  //   //   caption: 'STT',
  //   //   cellRender: (props) => (<p> {props?.rowIndex + 1} </p>),
  //   //   width: '40',
  //   // },
  //   {
  //     dataField: 'name',
  //     caption: 'Channel Name',
  //     required: true,
  //   },
  //   {
  //     dataField: 'url',
  //     caption: 'Channel URL',
  //     required: true,
  //   },
  //   {
  //     dataField: 'type',
  //     caption: 'Stream Type',
  //     required: true,
  //   },
  // ];
  return (
    <div>
      <form className={classes.modal}>
        {loading && <Loading />}

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
              return (
                <TabPanel value={`${id + 1}`}>
                  <Grid container spacing={2}>
                    <Grid item xs = {6}>
eh
                    </Grid>
                    <Grid item xs={6} > 
                    <Grid container spacing={2}>
                    {data.data.map((item) => {
                         if (item.type == 'Labells') {
                          return (
                            <Grid item xs={6} style={{float:'left'}}>
                            <div >
                            <h4>{item.label} </h4>
                            </div>
                            </Grid>
                           
                          );
                        }
                        if (item.type == 'Switch') {
                          return (
                            <Grid item xs={6} style={{float:'left', marginTop: 15}}>
                             <div>
                      <Switch 
                      //  onChange={(e) => handleCheck(e,data.peripheralID,"statusActive")}
                      // checked={convertboolleanactive(data?.statusActive)}
                      />
                      </div>
                            </Grid>
                            // </Grid>
                           
                          );
                        }
                        if (item.type == 'Text') {
                          return (
                            <div style={{width:'10%'}}>
                              {item.label} 
                              </div>
                          );
                        }
                      if (item.type == 'TextField') {
                        return (
                          <Grid item xs={6} style={{float:'left', marginTop: 10}}>
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
                          <Grid item xs={item.width} style={{float:'left', marginTop: 10}}>
                            <FormControl error={errors[item.name]} fullWidth>
                              <FormLabel required={item?.require}>
                                {item.label}
                              </FormLabel>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <VAutocomplete
                                  value={props.value
                                  }
                                  fullWidth
                                  //  placeholder={'Chọn'}
                                  // style={{ backgroundColor: handlecolor(sensorlevelList.filter(x => x.sensorName == 'Cảm biến mở cửa')[0]?.level) }}
                                  noOptionsText="Không có dữ liệu"
                                  getOptionLabel={(option) => option['name']}
                                  firstIndex={1}
                                  getOptionSelected={(option, selected) =>
                                    option['id'] == selected['id']
                                  }
                                  loadData={(page, keyword) => {
                                    return {
                                      data: item.data,
                                      totalCount: item.data.length,
                                    };
                                  }}
                                  onChange={(e, value) => {
                                    props.onChange(value)
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
                      if (item.type == 'DatePicker') {
                        return (
                          <Grid item xs={item.width} style={{float:'left', marginTop: 10}}>
                     <FormControl error={errors[item.name]} fullWidth >
                            <FormLabel required={item?.require}></FormLabel>
                            <Controller
                              control={control}
                              name={item.name}
                              render={(props) => (
                                <DatePicker
                                  variant="inline"
                                  fullWidth
                                  // disableToolbar
                                  placeholder="chọn ngày"
                                  inputVariant="outlined"
                                  value={props.value||null}
                                  onChange={(e, value) => {
                                    // setngaysinh(
                                    //   new Date(
                                    //     new Date(new Date(e.setHours(0)).setMinutes(0)).setSeconds(0),
                                    //   ).setMilliseconds(0),
                                    // );
                                    props.onChange(e);
                                    // setCheckfilter(true);
                                  }}
                                  inputProps={{
                                    style: {
                                      height: 5,
                                    },
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
                      if (item.type == 'Slider') {
                        return (
                          <Grid item xs={6}>
                            <FormControl error={errors[item.name]} fullWidth>
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
                      if (item.type == 'Datagrid') {
                        return (
                          <div style={{backgroundColor: "#EEEEEE",height:40, width: '45%', color:'grey'}}>
                          <b style={{ position: 'absolute', left:54, top: 143}}>{item.label}</b> 
                            {/* <TableCustomWrap>
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
                                      allowUpdating: true,
                                      allowDeleting: true,
                                      useIcons: true,
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
                            </TableCustomWrap> */}
                          </div>
                        );
                      }
                      if (item.type == 'Checkbox') {
                        return (
                          <Grid item xs={6}style={{float:'left', width:'50%'}}>
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
                    </Grid>
                
                    </Grid>
                   
                  </Grid>
                </TabPanel>
              );
            })}
          </TabContext>
        )}

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

// const TableCustomWrap = styled.div`
//   .dx-datagrid-nodata {
//     display: none;
//   }
//   .dx-visibility-change-handler {
//     min-height: auto !important;
//   }
//   .dx-fileuploader-files-container {
//     height: 0px;
//     padding: 0px !important;
//   }
// `;

export default Add;
