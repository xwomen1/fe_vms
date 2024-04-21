import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { validationSchema } from 'utils/utils';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import * as yup from 'yup';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { format_filter, url } from '../../Mocdata/camera';

export const Filter = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const [checkDefault, setCheckDefault] = useState(false);
  const [form, setForm] = useState(format_filter);

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: valueFilter,
    resolver: schema,
  });
  useEffect(() => {
    format_filter.map((item,index) => { 
      if(item.type=='VAutocomplete' && item.url){
        getApi(item.url)
          .then((response) => {
            let newForm = [...form];
            newForm[index].data = response.data;
            setForm(newForm);
          })
          .catch((err) => {
            showError(err);
          })
      }
    });
    setDataFormValue();
  }, [valueFilter]);
  
  const setDataFormValue = () => {
    var detail = {};
    format_filter.map((item,index) => { 
      if(item.type=='VAutocomplete'){
        detail[item.name] = item.data.filter(x => x[item.option.key] == valueFilter[item.filterName])[0] || null;
      }
    })
    console.log(detail);
    reset(detail);
  };
  const onSubmit = (values) => {
    var detail = {};
    
    format_filter.map((item,index) => { 
      if(item.type=='VAutocomplete'){
        console.log(values[item.name]);
        if(values[item.name] && values[item.name][item.option.key]){
          detail[item.filterName] = values[item.name][item.option.key];
        }else{
          detail[item.filterName] = null;
        }
        
      }
    })
    callback(detail);
    onClose();
  };

  const schema = validationSchema({});
  
  
  return (
    <form className={classes.modal}>
      <Grid container spacing={2}>
      {form.map((item) => {
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
            if(item.type == 'VAutocomplete'){
              return (
                <Grid item xs={item.width}>
                  <FormControl error={errors[item.name]} fullWidth>
                    <FormLabel required={item?.require}>{item.label}</FormLabel>
                    <Controller
                      control={control}
                      name={item.name}
                      render={(props) => (
                        <VAutocomplete
                          value={props.value ? props.value : valueFilter[item.filterName]}
                          fullWidth
                          placeholder={item.placeholder}
                          noOptionsText="Không có dữ liệu"
                          getOptionLabel={(option) => option[item.option.value]}
                          firstIndex={1}
                          getOptionSelected={(option, selected) =>
                            option[item.option.key] == selected[item.option.key]
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
              )
            }
          })}
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>

        <Button variant="contained" onClick={onClose}>Hủy</Button>
        <Button 
        variant="contained"
        color="primary"
        bgColor={checkDefault && 'green'} onClick={handleSubmit(onSubmit)}>
          {checkDefault ? 'Lưu' : 'Lọc'}
        </Button>
      </DialogActions>
    </form>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default Filter;
