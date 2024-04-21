import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import useUrlState from '@ahooksjs/use-url-state';
import utils from 'src/ultils/utils';
import IconBtn from 'components/Custom/IconBtn';
import Pagination from 'components/PageHeader/Pagination';


import Loading from 'containers/Loading/Loadable';

import HeaderMain from 'components/Custom/Header/HeaderMain';

import { showError, showSuccess } from 'utils/toast-utils';




import CustomTable from 'components/Custom/table/CustomTable';

// Mocdata
import { cameraAiModel, COLUMNS_LIST, initValueFilter, titlePopup, url, title  } from '../Mocdata/edge';

const useStyles = makeStyles(() => ({
  filter: {
    zIndex: '1299 !important',
  },
}));

export function Device() { 
  const classes = useStyles();
  const ref = useRef({});
  const [valueFilter, setValueFilter] = useUrlState(initValueFilter);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [deviceList, setDeviceList] = useState(null);
  const [editId, setEditId] = useState(null);
  const [reload, setReload] = useState(0);
  
  useEffect(() => {
      fetchDataListDevice(valueFilter);
  }, [valueFilter, reload]);
  
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
    // try {
    //   const res = await callApi(`${url}?${dto}`, 'GET');
    //   setDeviceList(res);
    // } catch (error) {
    //   utils.showToastErrorCallApi(error);
    // } finally {
    //   setLoading(false);
    // }

  };
  const handleSetValueFilter = (data) => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1,
    };
    setValueFilter(newDto);
    setOpenFilter(false);
  };
  const handlerDelete = (idDelete) => {
    
    setLoading(true);
    axios
      .delete(`${url}/${idDelete}`)
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
  const ViewContentTab = () => ( 
    <>
      {loading && <Loading />}
      <div className="ct-content-main-only">
        <CustomTable
          data={cameraAiModel?.data || []}
          //onSelectionChanged={(e) => setSelectRowsHolidays(e)}
          row={[
            ...COLUMNS_LIST,
          ]}
          disabledSelect
        />
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
        data={[{ label: title, key: '1' }]}
        placeholderSearch="Nhập thông tin tìm kiếm...."
        defaultValueSearch={valueFilter.keyword}
        onSearchValueChange={(e) => setValueFilter({ keyword: e, page: 1 })}
        ViewLeft={() => { 
          return (
            <div className="ct-flex-row">
              {[
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
      
      
      
      {ViewContentTab()}
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
};
export default Device;