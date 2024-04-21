import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

//import useUrlState from '@ahooksjs/use-url-state';
import useUrlState  from 'src/ultils/useUrlState';
import utils from 'src/ultils/utils';
//import IconBtn from 'components/Custom/IconBtn';
//import Pagination from 'components/PageHeader/Pagination';
import { FormControlLabel,FormControl,FormLabel,RadioGroup,Radio,Grid } from '@mui/material';
// import {
//   IconDelete,
//   IconEdit,
//   IconFilter,
//   IconSync,
// } from 'components/Custom/Icon/ListIcon';
import {
 
  TextField,
} from '@material-ui/core';
//import Loading from 'containers/Loading/Loadable';
import { callApi } from 'utils/requestUtils';
//import HeaderMain from 'components/Custom/Header/HeaderMain';
//import { IconPlus } from 'components/Custom/Icon/ListIcon';
//import { showError, showSuccess } from 'react-hot-toast';
//using react-hot-toast
import { Video, Camera, Network, Settings, CloudStorm, Key, CloudUpload, CloudDownload, InfoCircle} from 'tabler-icons-react'
//import { Popup } from 'devextreme-react/popup';

import Add from './popups/Add';
import View from './popups/View';
import ConfigPassword from './popups/ConfigPassword';
import ConfigNetwork from './popups/ConfigNetwork';
import ConfigVideo from './popups/ConfigVideo';
import ConfigImage from './popups/ConfigImage';
import ConfigStore from './popups/ConfigStore';
import ConfigPTZ from './popups/ConfigPTZ';
import VideoView from './popups/VideoView';
import Setting from './popups/Setting';
import Filter from './popups/Filter';
import Map from './Map';
import BtnSuccess from 'components/Button/BtnSuccess';
import {
  network_TCP_form,
  network_DDNS_form,
  network_port_form,
  network_Nat_form,
  initValues,
  apiUrl,
} from './constants';
// COLUME TABLE
import VAutocomplete from 'components/VAutocomplete';
import { COLUMNS_LIST, initValueFilter, titlePopup, url, title,feedbacklist,title2 } from '../Mocdata/camera';
import CustomTable from 'components/Custom/table/CustomTable';

import gui from 'utils/gui';
// Mocdata
// import { deviceList } from '../Mocdata/server';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

export function Device() { 

  const classes = useStyles();
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);
  const [loading, setLoading] = useState(false);
  const ref = React.useRef(null);
  const refDevice = useRef({});
  const [openFilter, setOpenFilter] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenPass, setIsOpenPass] = useState(false);
  const [isOpenNetwork, setIsOpenNetwork] = useState(false);
  const [isOpenVideo, setIsOpenVideo] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isOpenStore, setIsOpenStore] = useState(false);
  const [isOpenPTZ, setIsOpenPTZ] = useState(false);
  const [deviceList, setDeviceList] = useState(null);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [reload, setReload] = useState(0);
  const [videoId, setVideoId] = useState(null);
  const [iframeURL, setIframeURL] = useState(null);
  const [, setIsOpenLiveVideo] = useState(false);
  const [pageView, setPageView] = useState(1);
  const [latLng, setLatLng] = useState([21.027763,105.834160]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = React.useState('Dùng IP');
  const [valueindex, setValueindex] = useState(0);
  const [check, setCheck] = useState(false);
  useEffect(() => {
      fetchDataListDevice(valueFilter);
  }, [valueFilter, reload]);
  useEffect(() => {
    mapData(latLng);
  }, [latLng]);
  const key = 'AIzaSyA5_c-CmZ1l7GTtK4KNy_ql7_BSJ693Uog';
  const listlevel = [
    {
      'id':'1',
      'name':'Hikvision'
    },
    {
      'id':'2',
      'name':'Dahua'
    },

  ]
  const fetchDataListDevice = async (valueFilter) => {
    const payload = {
      keyword: null,
      page: initValueFilter.page,
      limit: initValueFilter.limit,
    };
    for (const [key, value] of Object.entries(valueFilter)) {
      if(value){
        payload[key] = value;
      }
    }
    const dto = utils.queryString(payload);
    // setLoading(true);
    console.log(feedbacklist);
    // setDeviceList(feedbacklist.row[0]);
    try {
      const res = await callApi(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras?${dto}`, 'GET');
      setDeviceList(res);
      if (refDevice && refDevice.current) {
        refDevice.current.instance.clearSelection();
      }
      setSelectedRows([]);
    } catch (error) {
      utils.showToastErrorCallApi(error);
    } finally {
      setLoading(false);
    }

  };
  const form_list = [
    {
      tab: 'Dùng IP',
      data: network_TCP_form,
    },
    {
      tab: 'Dải IP',
      data: network_DDNS_form,
    },
    {
      tab: 'ONVIP',
      data: network_port_form,
    },
    // {
    //   tab: 'Hikvision',
    //   data: network_port_form,
    // },
    // {
    //   tab: 'Dahua',
    //   data: network_port_form,
    // },
  ];
  const handleSetValueFilter = (data) => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };
  const handleChange = (event) => {
   setValue(event.target.value);
   form_list.map((item,index)=>{
    if(item.tab==event.target.value)
    {
      setValueindex(index);
    }
   })
  };
  const handlerDelete = (idDelete) => {
    
    setLoading(true);
    axios
      .delete(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${idDelete}`)
      .then(() => {
        showSuccess('Xóa thành công');
        setReload(reload + 1);
      })
      .catch(err => {
        showError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const mapData = (latLng) => {
    if(latLng && deviceList?.data){
      return (
        <>
          <Map 
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `75vh`, margin: `auto`, border: '1px solid #ccc' }} />}
            mapElement={<div style={{ height: `100%` }} />}
            latLng={latLng}
            data={deviceList?.data || []}
            ref={ref.current}
          />
        </>
        
      )
    }
  }
  const ViewContentMap = () => (
    <>
      {loading && <Loading />}
      <div className="ct-content-main-only">
          <div
            className="ct-content-main"
            style={{
              height: gui.heightContentOfScreen,
              maxHeight: gui.heightContentOfScreen,
            }}
          >
            <div className="ct-content-main-left">
              <List component="nav" aria-label="mailbox folders">
                {deviceList?.data.map((marker) => {
                  return (
                    <ListItem 
                      button
                      onClick = {
                        () => {
                          console.log(marker);
                          setLatLng([marker?.latitude, marker?.longitude])
                        }
                      }
                    >
                      <ListItemText primary={marker?.deviceName} />
                    </ListItem>
                  )
                })} 
              </List>
                
            </div>
            <div className="ct-content-main-right" >
              {mapData(latLng)}
            </div>
          </div>
          
      </div>
    </>
  )
  const ViewContentTab = () => ( 
    <>
      {loading && <Loading />}
      <div
        className="ct-content-main-only"
        style={{
          height: gui.heightContentOfScreen,
          maxHeight: gui.heightContentOfScreen,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{float:'right'}}>
            <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenStore(true);
                }}
              >
                <CloudStorm /> Lưu trữ
              </BtnSuccess>
            </div>
            <div style={{float:'right'}}>
            <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenImage(true);
                }}
              >
                <Camera /> Hình ảnh
              </BtnSuccess>
            </div>
            <div style={{float:'right'}}>
            <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenVideo(true);
                }}
              >
                <Video /> Video
              </BtnSuccess>
            </div>
            <div style={{float:'right'}}>
              
            <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenNetwork(true);
                }}
              >
                <Network /> Mạng
              </BtnSuccess>
            </div>
            <div style={{float:'right'}}>
            <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenPass(true);
                }}
              >
                <Key />Mật khẩu
              </BtnSuccess>
            </div>
        
              {/* <BtnSuccess
                style={{
                  ...styles.btnCreateFilter,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #6589FF',
                  color: '#6589FF',
                }}
                disabled={selectedRows?.length <= 0}
                className="ct-flex-row"
                onClick={(ev) => {
                  setIsOpenPTZ(true);
                }}
              >
                <Settings /> PTZ
              </BtnSuccess> */}

  
         
            
          </Grid>
        </Grid>
       {check && 
       <Grid container spacing={2}>
         <Grid item xs={12} style={{marginTop:20}}> 
          <div>
            <div style={{float:'left'}}>
        <FormControl>

            <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {form_list.map((item,index)=>(
        <FormControlLabel style={{marginLeft:10}} value={item.tab} control={<Radio />} label={item.tab} />
        ))
        }
      </RadioGroup>
      </FormControl>
            </div>
            <div style={{float:'left'}}>
              <FormControl fullWidth>
            <VAutocomplete
                  //  value={listlevel.filter(x=>x.name==(data?.sensors.filter(x=>x.name=="Đầu Báo Khói")[0].level))[0]||null}
                   fullWidth
                   placeholder={'Chọn'}
                   noOptionsText="Không có dữ liệu"
                   getOptionLabel={(option) => option['name']}
                   firstIndex={1}
                   getOptionSelected={(option, selected) =>
                     option['id'] == selected['id']
                   }
                   loadData={(page, keyword) => {
                     return {
                       data: listlevel,
                       totalCount: listlevel.length,
                     };
                   }}
                   onChange={(e, value) => {
                     console.log(value);
                   }}
                 />
    </FormControl>

            </div>
          </div>

     
        </Grid>
        <Grid item xs={12} style={{marginTop:20}}>
          <Grid container spacing={2}>

        {form_list[valueindex].data.map((item,index)=>(
          <Grid item xs={2}>
          <FormControl fullWidth>
            <FormLabel>{item.label}</FormLabel>
            {/* <Controller
              control={control}
              name={item.name}
              render={(props) => ( */}
                <TextField
                  autoComplete="off"
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  placeholder={'Add text'}
                  // value={props.value}
                  // onChange={(e) => {
                  //   props.onChange(e.target.value);
                  // }}
                  variant="outlined"
                  size="small"
                  // error={errors[item.name]}
                  // helperText={errors[item.name]?.message}
                />
              {/* )}
            /> */}
          </FormControl>
        </Grid>
        ))

        }
          </Grid>

        </Grid>
       </Grid>

       }
        {COLUMNS_LIST && (
          <CustomTable
            data={deviceList?.data || []}
            onSelectionChanged={(e) => setSelectedRows(e)}
            innerRef={refDevice}
            row={[
              ...COLUMNS_LIST,
              {
                dataField: 'Hành động',
                alignment: 'center',
                width: 180,
                cellRender: (v) => (
                  <div className="ct-flex-row">
                    <IconBtn
                      icon={<InfoCircle />}
                      onClick={() => {
                        setViewId(v.data.id);
                        // setIsOpenAdd(true);
                      }}
                    />
                    {v.data?.iframeURL && (
                      <IconBtn
                        icon={<Settings />}
                        onClick={() => {
                          setIframeURL(v.data.id);
                        }}
                      />
                    )}
                    
                    <IconBtn
                      icon={<IconEdit />}
                      onClick={() => {
                        setEditId(v.data.id);
                        setIsOpenAdd(true);
                        // setDataState(
                        //   deviceList.rows.filter((e) => e.id !== v.data.id),
                        // );
                      }}
                    />
                    <IconBtn
                      icon={<Video />}
                      onClick={() => {
                        setVideoId(v.data.id);
                        setIsOpenLiveVideo(true);
                      }}
                    />
                    <IconBtn
                      icon={<IconDelete />}
                      onClick={() => {
                        console.log(v.data.id)
                        handlerDelete(v.data.id)
                      }}
                    />
                  </div>
                  
                ),
              },
            ]}
          />
        )}
        
        <div
          style={{
            marginTop: 20,
          }}
        >
          <Pagination
            totalCount={deviceList?.count || 0}
            pageIndex={parseInt(valueFilter.page || 1)}
            rowsPerPage={parseInt(valueFilter.limit || 25)}
            handlePageSize={(e) =>
              setValueFilter({ limit: e.target.value, page: 1 })
            }
            handleChangePageIndex={(e) => setValueFilter({ page: e })}
          />
        </div>
      </div>
      
    </>
  );
  return (
    <div className="ct-root-page">
      <HeaderMain
        data={[{ label: title, key: '1' },{ label: title2, key: '2' }]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        onClickTab={(v) => {
          setPageView(v);
          console.log(v);
          if(v=='1')
          {
            setCheck(false);
          }
          else{
            setCheck(true);
          }
        }}
        ViewLeft={() => { 
          return (
            <div className="ct-flex-row">
              {[
                {
                  icon: (
                    <IconBtn
                      icon={<CloudDownload />}
                      style={styles.iconBtnHeader}
                      showTooltip="Download"
                    />
                  ),
                  width: 40,
                  onClick: () => {
                    setReload(reload + 1);
                  },
                },
                {
                  icon: (
                    <IconBtn
                      icon={<CloudUpload />}
                      style={styles.iconBtnHeader}
                      showTooltip="Upload"
                    />
                  ),
                  width: 40,
                  onClick: () => {
                    setReload(reload + 1);
                  },
                },
                {
                  icon: ( 
                    <IconBtn
                      icon={<IconSync />}
                      style={styles.iconBtnHeader}
                      showTooltip="Restart"
                    />
                  ),
                  width: 40,
                  onClick: () => {
                    setReload(reload + 1);
                  },
                },
                {
                  icon: (
                    <IconBtn
                      icon={
                        <IconFilter
                          color={
                            valueFilter.length > 2
                              ? '#007BFF'
                              : ''
                          }
                        />
                      }
                      style={styles.iconBtnHeader}
                      showTooltip="Bộ lọc"
                    />
                  ),
                  width: 40,
                  onClick: () => setOpenFilter(true),
                },
                {
                  icon: (
                    <IconBtn
                      icon={
                        <IconPlus />
                      }
                      style={styles.iconBtnHeader}
                      showTooltip="Thêm mới"
                    />
                  ),
                  width: 40,
                  onClick: () => setIsOpenAdd(true),
                },
                // {
                //   label: 'Thêm mới',
                //   icon: <IconPlus />,
                //   width: 115,
                //   onClick: () => {
                //     setIsOpenAdd(true);
                    
                //     //history.push(`/access-control/schedule/create/null`);
                //   },
                  
                // },
                
              ].map((item, index) => (
                <div
                  key={index.toString()}
                  style={{ width: item.width, marginRight: 10 }}
                  onClick={item.onClick}
                  className="ct-div-btn-no-bg ct-flex-row"
                >
                  {item.icon}
                  <div>{item.label}</div>
                  {item.icon2 ? item.icon2 : null}
                </div>
              ))}
             
            </div>
          )
        }}
      />
      {iframeURL && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cài đặt"
          showTitle
          onHidden={() => {
            setIframeURL(null);
          }}
          width="70%"
          height="auto"
        >
          <Setting
            onClose={() => setIframeURL(null)}
            id={iframeURL}
            valueFilter={valueFilter}
          />
        </Popup>
      )}
      {openFilter && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={titlePopup.filter}
          showTitle
          onHidden={() => {
            setOpenFilter(false);
          }}
          width="50%"
          height="auto"
        >
          <Filter
            onClose={() => setOpenFilter(false)}
            callback={handleSetValueFilter}
            valueFilter={valueFilter}
          />
        </Popup>
      )}
      {isOpenAdd && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={editId ? titlePopup.edit : titlePopup.add}
          showTitle
          onHidden={() => {
            setIsOpenAdd(false);
            setEditId(null);
          }}
          width="70%"
          height="100%"
        >
          <Add
            onClose={() => {
              setIsOpenAdd(false);
              setEditId(null);
            }}
            id={editId}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {viewId && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title={viewId ? titlePopup.info : titlePopup.info}
          showTitle
          onHidden={() => {
            setViewId(null);
          }}
          width="70%"
          height="100%"
        >
          <View
            onClose={() => {
              setViewId(null);
            }}
            id={viewId}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {videoId && (
        <Popup
          className={`${classes.filter} popup`}
          visible={videoId}
          title={'Xem trực tiếp'}
          showTitle
          onHidden={() => {
            setIsOpenLiveVideo(false);
            setVideoId(null);
          }}
          width="50%"
          height="auto"
        >
          <VideoView
            onClose={() => {
              setIsOpenLiveVideo(false);
              setVideoId(null);
            }}
            id={videoId}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenPass && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Đổi mật khẩu"
          showTitle
          onHidden={() => {
            setIsOpenPass(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigPassword
            onClose={() => {
              setIsOpenPass(false);
            }}
            id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenPTZ && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cấu hình PTZ"
          showTitle
          onHidden={() => {
            setIsOpenPTZ(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigPTZ
            onClose={() => {
              setIsOpenPTZ(false);
            }}
            id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenNetwork && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cấu hình Network"
          showTitle
          onHidden={() => {
            setIsOpenNetwork(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigNetwork
            onClose={() => {
              setIsOpenNetwork(false);
            }}
            id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenVideo && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cấu hình Video"
          showTitle
          onHidden={() => {
            setIsOpenVideo(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigVideo
            onClose={() => {
              setIsOpenVideo(false);
            }}
            id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenImage && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cấu hình hình ảnh"
          showTitle
          onHidden={() => {
            setIsOpenImage(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigImage
            onClose={() => {
              setIsOpenImage(false);
            }}
            id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      {isOpenStore && (
        <Popup
          className={`${classes.filter} popup`}
          visible
          title="Cấu hình lưu trữ"
          showTitle
          onHidden={() => {
            setIsOpenStore(false);
          }}
          width="50%"
          height="auto"
        >
          <ConfigStore
            onClose={() => {
              setIsOpenStore(false);
            }}
            // id={selectedRows}
            setReload={() => setReload(reload + 1)}
          />
        </Popup>
      )}
      { pageView == 1 ? ViewContentTab() : ViewContentTab()}
    </div>
  );
}
const styles = {
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  btnCreateFilter: {
    backgroundColor: '#109CF1',
    height: 36,
    borderRadius: 90,
    marginLeft: 4,
    justifyContent: 'center',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
};
export default Device;