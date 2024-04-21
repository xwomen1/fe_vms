import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
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
import CustomTable from 'components/Custom/table/CustomTable';
import { useStyles } from '../../../styled';
import '../CSS/App.css'
import utils from 'utils/utils';
import {
  store_schudule_form,
  store_quality_form,
  network_port_form,
  network_Nat_form,
  initValues,
  apiUrl,
  nvrList,
  initValueFilter,
} from '../../NVRConfig/constants';
import TableCustom from 'components/TableCustom';
import useUrlState from '@ahooksjs/use-url-state';
import styled from 'styled-components';
import {
  Column,
  Item,
  RequiredRule,
  Toolbar,
  ValidationRule,
} from 'devextreme-react/data-grid';
import Slider from '@mui/material/Slider';
import LabelInput from 'components/TextInput/element/LabelInput';
import Daily from '../../Mocdata/Daily';

import { TextArea } from 'devextreme-react';
const dataDailyDefault = [
  {
    label: '',
    value: 1,
  },
  {
    label: 'Thứ 2',
    StringValue: 'MONDAY',
    value: 2,
  },
  {
    label: 'Thứ 3',
    StringValue: 'TUESDAY',
    value: 3,
  },
  {
    label: 'Thứ 4',
    StringValue: 'WEDNESDAY',
    value: 4,
  },
  {
    label: 'Thứ 5',
    StringValue: 'THURSDAY',
    value: 5,
  },
  {
    label: 'Thứ 6',
    StringValue: 'FRIDAY',
    value: 6,
  },
  {
    label: 'Thứ 7',
    StringValue: 'SATURDAY',
    value: 7,
  },
  {
    label: 'CN',
    StringValue: 'SUNDAY',
    value: 8,
  },
];


export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);
  const [deviceList, setDeviceList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState([
    ...store_schudule_form,
    ...store_quality_form
  ]);
  useEffect(() => {
    fetchDataListDevice(valueFilter);
  }, [valueFilter]);
  const fetchDataListDevice = async (valueFilter) => {
    setLoading(true);
    console.log(nvrList);
    setDeviceList(nvrList.row[0]);
    try {
      setDeviceList(nvrList.row[0]);
    } finally {
      setLoading(false);
    }

  };
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
    { label: 'Option 4', value: 4 },
    { label: 'Option 5', value: 5 },
  ];
  const form_list = [
    {
      tab: 'Lịch ghi',
      data: store_schudule_form,
    },
    {
      tab: 'Chất lượng ghi',
      data: store_quality_form,
    },
  ];
  const [validation, setValidation] = useState(null);
  const [tab, setTab] = useState(`1`);
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault);
  const [dataDaily, setDataDaily] = useState([]);
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
    postApi(`${apiUrl}/get-config/batch`, [...id.map(x => x.id)])
      .then((response) => {
        const setData = response.data;
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
    if (id && id.length > 0) {
      const params = {
        cameraIDs: id.map(x => x.id),
        ...values,
      };
      handleAdd(params);
    }

  };
  const handleAdd = (params) => {
    setLoading(true);
    postApi(`${apiUrl}/set-config/batch`, params)
      .then(() => {
        showSuccess('Cấu hình thành công', {
          text: 'Dữ liệu đang được cập nhật',
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
                              <FormLabel required={item?.require}>{item.label}</FormLabel>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <TextField
                                    autoComplete="off"
                                    inputProps={{ maxLength: item?.maxLength ? item?.maxLength : 50 }}
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
                      if (item.type == 'Button') {
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <Button
                                    style={{ background: '#87CEFA', marginTop: 22 }}
                                  >
                                    {item.label}
                                  </Button>
                                )}
                              />
                            </FormControl>
                          </Grid>
                        );
                      }
                      if (item.type == 'TextArea') {
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth>
                              <FormLabel required={item?.require}>{item.label}</FormLabel>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <TextArea
                                    id="standard-multiline-flexible"
                                    // label="Multiline"
                                    multiline
                                    maxRows={4}
                                    variant="standard"
                                    style={{ height: 100 }}
                                    autoComplete="off"
                                    placeholder={'Mô tả'}
                                    inputProps={{ maxLength: 500 }}
                                    fullWidth
                                    value={props.value}
                                    onChange={(e) => {
                                      props.onChange(e.target.value);
                                    }}
                                    size="medium"
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
                      if (item.type == 'Schudule') {
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
                                  <Daily
                                    callbackOfDaily={(v) => {
                                      props.onChange(v);
                                      setDataDaily(v);
                                      setDataDailyState(v);
                                    }}
                                    dataDailyProps={dataDailyState}
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
                  {form_list.map((data, id) => {
                    if (data.data === store_quality_form) {
                      return (
                        <TabPanel key={id} value="2">
                          <Grid container spacing={2}>
                            <div className="table-container-wrapper">
                              <TableContainer className="table-container" component="div">
                                <Table >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell className="table-cell">Tên</TableCell>
                                      <TableCell className="table-cell" align="right">Cấu hình 1</TableCell>
                                      <TableCell className="table-cell" align="right">Cấu hình 2</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="table-cell" component="th" scope="row">
                                        Encoding Paramenter
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <div className="readonly-text">Main Stream(Continuous)</div>
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <div className="readonly-text">Main Stream(Event)</div>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="table-cell" component="th" scope="row">
                                        Stream Type
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="Video & Audio" />}
                                        />
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="Video & Audio" />}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="table-cell" component="th" scope="row">
                                        Resolution
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="1920'1080(1080P)" />}
                                        />
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="1920'1080(1080P)" />}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="table-cell" component="th" scope="row">
                                        Bitrate Type
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="Constant" />}
                                        />
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <Autocomplete
                                          id="combo-box-demo"
                                          options={options}
                                          getOptionLabel={(option) => option.label}
                                          style={{ width: '100%' }}
                                          renderInput={(params) => <TextField {...params} label="Constant" />}
                                        />
                                      </TableCell>  
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="table-cell" component="th" scope="row">
                                        Max.Bltrate Range Reacommender
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <TextField id="main-config-1" label="3840~6400(Kbps)" style={{ width: '100%' }} />
                                      </TableCell>
                                      <TableCell className="table-cell" align="right">
                                        <TextField id="main-config-2" label="3840~6400(Kbps)" style={{ width: '100%' }} />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          </Grid>
                        </TabPanel>
                      );
                    }
                    return null;
                  })}
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
