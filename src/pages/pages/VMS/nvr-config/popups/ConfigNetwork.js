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

// import FormGroup from 'components/FormGroup';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { validationSchema } from 'utils/utils';
import { showError, showSuccess } from 'utils/toast-utils';
import Loading from '../../../Loading';
import { getErrorMessage } from '../../../Common/function';
import { useStyles } from '../../../styled';
import {
  network_TCP_form,
  network_DDNS_form,
  network_port_form,
  network_Nat_form,
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
import TreeSelect from 'components/TreeSelect';
import Slider from '@mui/material/Slider';
import { Disabled } from 'tabler-icons-react';
export const Add = ({ onClose, id, setReload, filter }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [DNSCheck, setDNSCheck] = useState(false);
  const [DHCP, setDHCP] = useState(false);
  const [SystemDateAndTime, setSystemDateAndTime] = useState(false);
  const [DDNS, setDDNS] = useState(false);

  const [form, setForm] = useState([
    ...network_TCP_form,
    ...network_DDNS_form,
    ...network_port_form,
    ...network_Nat_form,
  ]);
  const form_list = [
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
      tab: 'NTP',
      data:  [
        {
          name: 'NTP',
          label: 'NTP',
          type: 'Datagrid',
          data: [],
          require: false,
          width: 5,
        },
        {
          name: '',
          label: '',
          type: 'Text',
          data: [],
          require: false,
          width: 1,
        },
        {
          name: 'Manual Time Sync',
          label: 'Manual Time Sync',
          type: 'Teest',
          data: [],
          require: false,
        },
        {
          name: 'NTP',
          label: 'NTP',
          type: 'Checkbox',
          default: false,
          data: [],
          require: false,
          width: 5,
        },
        {
          name: '',
          label: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'ntp.ntp',
          label: 'Manual Time Sync',
          type: 'Checkbox',
          default: false,
          data: [],
          require: false,
          width: 5,
        },
        {
          name: 'Server Address',
          label: 'Server Address',
          type: 'Labells',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'ntp.ServerAddress',
          placeholder: '',
          type: 'TextField',
          data: [],
          disabled:DHCP,
          require: false,
          width: 3,
        },
        {
          name: '',
          label: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'Device Time',
          label: 'Device Time',
          type: 'Labells',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'SystemDateAndTime.LocalDateTime',
          placeholder: '',
          type: 'TextField',
          data: [],
          require: false,
          width: 3,
        },
        {
          name: 'NTP Port',
          label: 'NTP Port',
          type: 'Labells',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'ntp.NTPPort',
          placeholder: '',
          type: 'TextField',
          data: [],
          disabled : DHCP,
          require: false,
          width: 3,
        },
        {
          name: '',
          label: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'Set Time',
          label: 'Set Time',
          type: 'Labells',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'SystemDateAndTime.LocalDateTime',
          placeholder: '',
          type: 'Texts',
          data: [],
          // disabled:!DHCP,
          require: false,
          width: 3,
        },
        {
          name: 'Period',
          label: 'Interval',
          type: 'Labells',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'ntp.Period',
          placeholder: '',
          type: 'TextField',
          disabled : DHCP,
          data: [],
          require: false,
          width: 3,
        },
        {
          name: '',
          label: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: 'Manual Time Sync',
          label: 'Manual Time Sync',
          type: 'Checkboxs',
          default: false,
          data: [],
          require: false,
          width: 5,
        },
        {
          name: '',
          placeholder: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        {
          name: '',
          placeholder: '',
          type: 'Text',
          data: [],
          require: false,
          width: 2,
        },
        
        {
          name: 'Test',
          label: 'Test',
          placeholder: '',
          type: 'Button',
          data: [],
          require: false,
          width: 3,
        },
       
      ]
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
        if(item.type=='TreeSelect'){
          validation[item.name] = yup.object().nullable().required('Trường này bắt buộc nhập');
        }
      }
    });
    setValidation(validation);
  }, [form]);

  const fetchDataSource = (link) => {
    getApi(link)
    .then((response) => {
      setDetail(response.data[0]);
      setDNSCheck(response.data[0].DNS);
      setDHCP(response.data[0].DHCP);
      setDDNS(response.data[0].Enabled);
    })
    .catch((err) => {
      showError(err);
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
            newForm[index].data = response.data[0];
            console.log(newForm);
            setForm(newForm);
          })
          .catch((err) => {
            showError(err);
          });
      }
    });
    // if (id) {
      // fetchDataSource();
      console.log("load lại");
      switch(tab)
      {
        case "1":
          fetchDataSource(`https://sbs.basesystem.one/ivis/vms/api/v0/datamockup/tcpip
          `);
          break;
          case "2":
            fetchDataSource(`https://sbs.basesystem.one/ivis/vms/api/v0/datamockup/ddns
            `);
            break;
            case "3":
              fetchDataSource(`https://sbs.basesystem.one/ivis/vms/api/v0/datamockup/port
              `);
              break;
              case "4":
                fetchDataSource(`https://sbs.basesystem.one/ivis/vms/api/v0/datamockup/ntp
                `);
                break;
      }
    // }
  }, [id,tab]);
  const setDetailFormValue = () => {
    detail.httpPort=detail?.AdminAccessProtocol?.filter(x=>x?.protocol=="HTTP")[0]?.portNo;
    detail.rtspPort=detail?.AdminAccessProtocol?.filter(x=>x?.protocol=="RTSP")[0]?.portNo;
    detail.httpsPort=detail?.AdminAccessProtocol?.filter(x=>x?.protocol=="HTTPS")[0]?.portNo;
    detail.serverPort=detail?.AdminAccessProtocol?.filter(x=>x?.protocol=="DEV_MANAGE")[0]?.portNo;

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
    // setLoading(true);
    console.log(values);
    // const params = {};
    // for(let i=0 ; values.length; i++){
    //   if(values[format_form[i].name]){
    //     params[item.name] = values[item.name]
    //   }
    // }
    // if(id && id.length > 0){
    //   const params = {
    //     cameraIDs: id.map(x => x.id),
    //     ...values,
    //   };
    //   handleAdd(params);
    // }
    
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
  const handleCheckDNS = (data) =>{
    // const params = {
    //   "true":data[0].DNS,
    // };
    console.log(data.target.checked);
    // if(true=="DNS"){
    //   if(data.target.checked==true)
    //   {
    //     params.true = "true"
    //   }
    //   else{
    //     params.true="false"
    //   }
    // }
    // console.log(params);
    // setLoading(true);
    // putApi(`https://sbs.basesystem.one/ivis/api/v0/peripheral/update/${id}`, params)
    //   .then(() => {
    //     showSuccess('Cập nhật thành công', {
    //       text: 'Dữ liệu đã được cập nhật',
    //     });
    //     setReload(reload+1);
    //     // onClose();
    //   })
    //   .catch((err) => {
    //     showError(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }
  const handleCheckDHCP = (data) =>{
      setDHCP(data.target.checked);
    // const params = {
    //   "true":data[0].DHCP,
    // };
    // if(true=="DHCP"){
    //   if(data.target.checked==true)
    //   {
    //     params.true = "true"
    //   }
    //   else{
    //     params.true="false"
    //   }
    // }
    // console.log(params);
    // setLoading(true);
    // putApi(`https://sbs.basesystem.one/ivis/api/v0/peripheral/update/${id}`, params)
    //   .then(() => {
    //     showSuccess('Cập nhật thành công', {
    //       text: 'Dữ liệu đã được cập nhật',
    //     });
    //     setReload(reload+1);
    //     // onClose();
    //   })
    //   .catch((err) => {
    //     showError(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }
  const handleCheckDDNS = (data) =>{
    const params = {
      "true":data[0].Enabled,
    };
    if(true=="Enabled"){
      if(data.target.checked==true)
      {
        params.true = "true"
      }
      else{
        params.true="false"
      }
    }
    console.log(params);
    setLoading(true);
    putApi(`https://sbs.basesystem.one/ivis/api/v0/peripheral/update/${id}`, params)
      .then(() => {
        showSuccess('Cập nhật thành công', {
          text: 'Dữ liệu đã được cập nhật',
        });
        setReload(reload+1);
        // onClose();
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
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
  function convertboolleanaccess(text){
    if(text=="false")
    {
      return true;
    }
    else{
      return false;
    }
  }
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
                  console.log(idx);
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
                                            url = item.url + '?parentId='+node?.key;
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
                      if(DNSCheck == true){
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth>
                  
                              <FormLabel required={item?.require} >
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
                                    disabled={item?.disabled}
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
                      else{
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth>
                  
                              <FormLabel required={item?.require} disabled >
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
                                    disabled={!item?.disabled}
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
                      }
                      if (item.type == 'Texts') {
                     
                          return (
                            <Grid item xs={item.width}>
                              <FormControl error={errors[item.name]} fullWidth>
                    
                                <FormLabel required={item?.require} disabled >
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
                                      // disabled={!item?.disabled}
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
                      if (item.type == 'Switch') {
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth                                         style={{ marginRight: '15px' }}
>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <FormControlLabel
                                    control={
                                      <Switch 
                       onChange={(e) => handleCheckDNS(e)}
                      checked= {DNSCheck}
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
                      if (item.type == 'Switch1') {
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth                                         style={{ marginRight: '15px' }}
>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <FormControlLabel
                                    control={
                                      <Switch 
                       onChange={(e) => handleCheckDDNS(e,data.DNS,"true")}
                      checked= {DDNS}
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
                      if (item.type == 'Checkbox') {
                        return (
                          <Grid item xs={item.width}>
                            <FormControl error={errors[item.name]} fullWidth                                         style={{ marginRight: '15px' }}
>
                              <Controller
                                control={control}
                                name={item.name}
                                render={(props) => (
                                  <FormControlLabel
                                    control={
                                      <Switch 
                       onChange={(e) => handleCheckDHCP(e)}
                      checked= {item.name=="Manual Time Sync"?!DHCP:DHCP}
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
                      if (item.type == 'Checkboxs') {
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
                                        // style={{ marginRight: '15px' }}
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
                      if (item.type == 'Teest') {
                        return (
                          <div style={{backgroundColor: "#EEEEEE", width: '45%',height:40, color:'grey'}}>
                          <b style={{ position: 'relative', left:1, top: 10}}>{item.label}</b>
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
                      if (item.type == 'Labells') {
                        return (
                          <div style={{ width: '20%'}}>
                          <h4>{item.label} </h4>
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
                      if (item.type == 'Text') {
                        return (
                          <div style={{width:'10%'}}>
                            {item.label} 
                            </div>
                        );
                      }
                      if (item.type == 'Button') {
                        return (
                          <div style={{width:'10%'}}>
                            <Button onClick={onClose} variant="contained">
                                        {item.label} 

          </Button>
                            </div>
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
