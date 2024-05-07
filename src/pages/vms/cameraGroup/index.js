import React, { useEffect, useState, useRef } from 'react'

import { Grid } from '@mui/material'

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
  limit: 25,
  deviceTypes: 'NVR'
}

const Caller = () => {
  const [sizeScreen, setSizeScreen] = useState(3)
  const [reload, setReload] = useState(0)
  const [valueFilter, setValueFilter] = useState(valueFilterInit)
  const [cameraGroup, setCameraGroup] = useState([])
  const fetchCameraGroup = async () => {
    try {
      const res = await getApi(
        `${CAMERA_API.CAMERA_GROUP}?deviceTypes=${valueFilter.deviceTypes}&limit=${valueFilter.limit}&page=${valueFilter.page}`
      )
      let listCamera = []
      res.data.map(item => {
        if (item.cameras) {
          item.cameras.map(camera => {
            if (listCamera.length < sizeScreen ** 2) {
              listCamera.push({
                ...camera,
                channel: 'Sub'
              })
            }
          })
        }
      })
      console.log(listCamera)
      setCameraGroup(listCamera)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    fetchCameraGroup()
  }, [reload])

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
    setCameraGroup(newCamera)
  }
  return (
    <DivStyle>
      <Grid container spacing={0}>
        {cameraGroup.length > 0 &&
          cameraGroup.map((camera, index) => (
            <Grid item xs={Math.floor(12 / sizeScreen)} key={index}>
              <ViewCamera
                name={camera?.deviceName}
                id={camera.id}
                // id='4fa9a51c-e904-4ab0-acad-169ed4c9aeda'
                channel={camera.channel}
                status={camera.status}
                sizeScreen={sizeScreen}
                handSetChanel={handSetChanel}
              />
            </Grid>
          ))}
      </Grid>
      <Settings sizeScreen={sizeScreen} setSizeScreen={size => setSizeScreen(size)} />
    </DivStyle>
  )
}

export default Caller
