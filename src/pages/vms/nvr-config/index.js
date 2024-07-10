import { Grid } from '@mui/material'

import TableStickyHeader from './table'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useState, useEffect, useCallback } from 'react'
import Add from './add'

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

const Caller = () => {
  const [value, setValue] = useState('1')
  const defaultNvrID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'
  const [assettypeStatus, setAssetTypeStatus] = useState([])

  useEffect(() => {
    fetchFilteredOrAllUsers()
  }, [])

  const fetchFilteredOrAllUsers = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 25,
          page: 1
        }
      }
      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/nvrs', config)
      setAssetTypeStatus(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/nvrStatus/${defaultNvrID}`)

    ws.onmessage = event => {
      const { dataType, data } = JSON.parse(event.data)
      if (dataType === 'nvrStatus') {
        const cameraStatusUpdates = JSON.parse(data)
        updateCameraStatus(cameraStatusUpdates)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  const updateCameraStatus = useCallback(
    cameraStatusUpdates => {
      const cameraStatusMap = new Map(
        cameraStatusUpdates.map(status => [status.id, status.statusValue.name, status.ip])
      )

      // Lặp qua các mục trong Map sử dụng for...of
      for (const entry of cameraStatusMap.entries()) {
        const [id, status, ip] = entry

        const entry1 = {
          id: id,
          status: status,
          ip: ip
        }

        setAssetTypeStatus(prevAssetType => {
          const newAssetType = prevAssetType.map(camera => {
            if (camera.id === entry1.id) {
              if (camera.status.name !== entry1.status) {
                console.log('AssetType with ID', entry1.id, 'has changed status.')
                console.log('Previous status:', camera.status.name)
                console.log('New status:', entry1.status)
              }

              return { ...camera, status: { name: entry1.status } }
            }

            return camera
          })

          // console.log('New Asset Type:', newAssetType) // Log updated asset type

          return newAssetType
        })
      }
    },
    [assettypeStatus]
  )

  console.log(assettypeStatus)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <TabContext value={value}>
        <Grid>
          {' '}
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab value='1' label='Cấu hình NVR' />
            <Tab value='2' label='Thêm NVR' />
          </TabList>
        </Grid>
        <TabPanel value='1'>
          <TableStickyHeader assettypeStatus={assettypeStatus} />
        </TabPanel>
        <TabPanel value='2'>
          <Add assettypeStatus={assettypeStatus} />
        </TabPanel>
      </TabContext>
    </Grid>
  )
}

export default Caller
