import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import TCP from './TCP-IP'
import DDNs from './DDNS'
import Port from './Port'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material'

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

const Network = ({ open, onClose, camera }) => {
  const [cameras, setCamera] = useState([])
  const [nic, setNic] = useState([])
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  console.log(camera, 'camera')

  const handleCancel = () => {
    onClose()
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (camera != null) {
          // Kiểm tra xem popup Network đã mở chưa
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
          console.log('token', token)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(
            `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/{idCamera}?idCamera=${camera}`,
            config
          )

          setCamera(response.data.data)
          setNic(response.data.data.nicType.name)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cấu hình mạng</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Grid>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='TCP/IP' />
              <Tab value='2' label='DDNS' />
              <Tab value='3' label='PORT' />
              {/* <Tab value='4' label='NTP' /> */}
            </TabList>
          </Grid>
          <TabPanel value='1'>
            {' '}
            <TCP camera={cameras} nic={nic} />
          </TabPanel>
          <TabPanel value='2'>
            {' '}
            <DDNs camera={cameras} />
          </TabPanel>
          <TabPanel value='3'>
            {' '}
            <Port nvrs={cameras} />
          </TabPanel>
          {/* <TabPanel value='4'>
            {' '}
            <NTP nvrs={cameras} />
          </TabPanel> */}
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Network
