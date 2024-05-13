import { useEffect, useState } from 'react'
import { Button, DialogActions, Grid } from '@mui/material'
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

const Network = ({ open, onClose, onSelect, camera }) => {
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

          setCamera(response.data)
          setNic(response.data.nicType.name)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

  return (
    <Grid container direction='column'>
      <TabContext value={value}>
        <Grid item>
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab value='1' label='TCP/IP' />
            <Tab value='2' label='DDNS' />
            <Tab value='3' label='PORT' />
          </TabList>
        </Grid>
        <TabPanel value='1'>
          <TCP camera={cameras} nic={nic} idCamera={camera} onClose={handleCancel} />
        </TabPanel>
        <TabPanel value='2'>
          <DDNs camera={cameras} />
        </TabPanel>
        <TabPanel value='3'>
          <Port nvrs={cameras} />
        </TabPanel>
      </TabContext>
    </Grid>
  )
}

export default Network
