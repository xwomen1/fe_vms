import React, { useEffect, useState, useRef } from 'react'

import { Box, Grid, IconButton } from '@mui/material'

// import TableStickyHeader from './table'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import ViewCamera from 'src/@core/components/camera'
import Settings from 'src/@core/components/camera/settings'
import { getApi } from 'src/@core/utils/requestUltils'
import { CAMERA_API } from 'src/@core/components/api-url'
import FullScreen from './popups/fullScreen'
import Icon from "src/@core/components/icon"

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const DivStyle = styled('div')(({ theme }) => ({
  margin: '-1.2rem -1.5rem'
}))

const valueFilterInit = {
  page: 1,
  limit: 50,
  deviceTypes: 'NVR'
}

const Caller = () => {
  const [sizeScreen, setSizeScreen] = useState('3x3')
  const [reload, setReload] = useState(0)
  const [numberShow, setNumberShow] = useState(9)
  const [valueFilter, setValueFilter] = useState(valueFilterInit)
  const [cameraGroup, setCameraGroup] = useState([])
  const [cameraHiden, setCameraHiden] = useState([])
  const [cameraList, setCameraList] = useState([])
  const [selectIndex, setSelectIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [isOpenFullScreen, setIsOpenFullScreen] = useState(false)

  const fetchCameraGroup = async () => {
    try {
      const res = await getApi(
        `${CAMERA_API.CAMERA_GROUP}?deviceTypes=${valueFilter.deviceTypes}&limit=${valueFilter.limit}&page=${valueFilter.page}`
      )
      let listCamera = []
      setCameraList(res?.data)
      if (res.data.length > 0 && res.data[selectIndex]?.cameras) {
        res.data[selectIndex].cameras.slice((page - 1) * numberShow, page * numberShow).forEach(camera => {
          listCamera.push({ ...camera, channel: 'Sub' })
        })
      }
      setCameraGroup(listCamera)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    fetchCameraGroup()
  }, [reload, page, selectIndex, sizeScreen])

  const handSetChanel = (id, channel) => {
    let newCamera = cameraGroup.map(item => {
      if (item.id === id) {
        return {
          ...item,
          channel: channel
        }
      }

      return item
    })
    console.log('newCamera', newCamera)
    setCameraGroup(newCamera)
  }

  useEffect(() => {

    console.log('cameraList', cameraList);

  }, [cameraList])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-3rem', marginBottom: '1rem' }}>
        <IconButton onClick={() => setIsOpenFullScreen(true)}>
          <Icon icon="tabler:border-corners" />
        </IconButton>
      </div>
      <DivStyle style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
        <Grid container spacing={0}>
          {cameraGroup.length > 0 &&
            cameraGroup.map((camera, index) => (
              <Grid item xs={Math.floor(12 / sizeScreen.split('x')[0])} key={camera.id + index}>
                <ViewCamera
                  name={camera?.deviceName}
                  id={camera.id}
                  channel={camera.channel}
                  status={camera.status}
                  sizeScreen={sizeScreen}
                  handSetChanel={handSetChanel}
                  isFullScreen={isOpenFullScreen}
                />
              </Grid>
            ))}
        </Grid>
        <Settings
          page={page}
          onSetPage={setPage}
          selectIndex={selectIndex}
          onSetSelectIndex={setSelectIndex}
          cameraList={cameraList}
          sizeScreen={sizeScreen}
          setSizeScreen={size => {
            setSizeScreen(size)
            setNumberShow(size.split('x')[0] * size.split('x')[1])
          }}
        />
      </DivStyle>
      {isOpenFullScreen && (
        <FullScreen
          show={isOpenFullScreen}
          data={cameraGroup}
          cameraList={cameraList}
          sizeScreen={sizeScreen}
          onClose={() => setIsOpenFullScreen(false)} />
      )}
    </div>
  )
}

export default Caller
