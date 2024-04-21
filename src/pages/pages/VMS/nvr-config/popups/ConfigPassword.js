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
// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../../Loading';
import { getErrorMessage } from '../../../Common/function';
import { useStyles } from '../../../styled';
import {
  password_form,
  initValues,
  apiUrl,
} from '../../Mocdata/camera';
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
    ...password_form,
  ]);
  const form_list = [
    {
      tab: 'Thay đổi mật khẩu',
      data: password_form,
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

  // const fetchDataSource = () => {
  //   setLoading(true);
  //   getApi(`${apiUrl}/${id}`)
  //     .then((response) => {
  //       const setData = response.data;

  //       setData.area = {
  //         id: response?.data?.areaId,
  //         name: response?.data?.areaName,
  //       }
  //       setDetail(setData);
  //     })
  //     .catch((err) => {
  //       showError(err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

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
    resolver: validationSchema(validation),
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
    // if (id) {
    //   fetchDataSource();
    // }
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
                    {data.data.map((item) => {
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
                      if (item.type == 'Slider') {
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
            {id ? 'Đồng ý' : 'Thêm'}
          </Button>
          <Button
            // onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            {'Tải file báo cáo'}
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
