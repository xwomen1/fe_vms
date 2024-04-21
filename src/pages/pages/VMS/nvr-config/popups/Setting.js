import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useMemo } from 'react';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { validationSchema } from 'utils/utils';
import gui from 'utils/gui';
import {
  DialogActions,
  FormControl,
  FormHelperText,
  FormLabel,
  Box,
  Grid,
  Tab,
  TextField,
  Button,
} from '@material-ui/core';
import * as yup from 'yup';
import CustomTable from 'components/Custom/table/CustomTable';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import VAutocomplete from 'components/VAutocomplete';
import { getApi, postApi, putApi } from 'utils/requestUtils';
import { format_filter, url, apiUrl } from '../../Mocdata/camera';
import cupidvideo from 'videos/cupid.mp4';
import Loading from 'containers/Loading/Loadable';

export const Setting = ({ onClose, callback, id, valueFilter }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const iframeRef = React.useRef(null);
  const [tab, setTab] = useState(`1`);
  const form_list = [
    {
      tab: 'Vị trí',
      // data: network_TCP_form,
    },
    {
      tab: 'Đường đi',
      // data: network_DDNS_form,
    },
    {
      tab: 'Làm mẫu',
      // data: network_port_form,
    },
  ];
  const schema = validationSchema({});
  const fetchDataSource = async () => {
    setLoading(true);
    await getApi(`${apiUrl}/${id}`)
      .then((response) => {
        const setData = response.data;

        setDetail(setData);
        // setTimeout(()=> {
        //   const iframeWindow = iframeRef.current.contentWindow;
        //   const iframeDoc = iframeWindow.document;
        //   const input1 = iframeDoc.querySelector('input[id="username"]');
        //   const input2 = iframeDoc.querySelector('input[id="password"]');
        //   if(input1 && input2){
        //     input1.value = setData.username;
        //     input2.password = setData.password;
        //   }


        // },3000)
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (id) {
      fetchDataSource();
    }
  }, [id]);

  return (
    <form className={classes.modal}>
      {loading && <Loading />}
      {detail && (
        <Grid>
          <b>User Name: </b> {detail.username} <br />
          <b>Password: </b> {detail.password} <br />
          <iframe
            ref={iframeRef}
            src={detail.iframeURL}
            style={{
              height: gui.heightContentOfScreen - 100,
              width: '100%',
              overflow: 'scroll'
            }}
          ></iframe>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <video controls style={{ width: '100%', height: 500 }}>
            <source src={cupidvideo} type="video/mp4" />
          </video>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <DialogActions>
            <Button variant="contained">
              Đặt
            </Button>
            <Button
              // onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="primary"
            >
              {'Đặt lại tất cả'}
            </Button>
            <Button
              // onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="primary"
            >
              Xóa
            </Button>
          </DialogActions>
            </Grid>
            <Grid item xs={12}>
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
                  <CustomTable
            data={data || []}
            row={[
              {
                dataField: 'deviceCode',
                caption: 'Vị trí',
              },
              {
                dataField: 'deviceType',
                caption: 'Tốc độ',
              },
              {
                dataField: 'ipAddress',
                caption: 'Thời gian',
              },
            
            ]}
          />
                  </Grid>
                </TabPanel>
              );
            })}
          </TabContext>
            </Grid>
          </Grid>
       
        </Grid>
      </Grid>
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

export default Setting;
