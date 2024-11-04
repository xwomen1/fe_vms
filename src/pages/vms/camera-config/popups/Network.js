import { forwardRef, useEffect, useState } from 'react'
import { Card, Fade, Grid, IconButton, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

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
import { Box } from 'devextreme-react'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

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
  const [mtu, setMTU] = useState([])
  const [value, setValue] = useState('1')
  const [cameraId, setCameraId] = useState('1')

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
            `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/${camera}`,
            config
          )

          setCamera(response.data)
          setCameraId(response.data.id)
          setMTU(response.data.mtu)
          console.log(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={open}
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      {' '}
      <DialogTitle>Network Configuration </DialogTitle>
      <DialogContent>
        <CustomCloseButton onClick={onClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <TabContext value={value}>
          <Grid item>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='TCP/IP' />
              <Tab value='2' label='DDNS' />
              <Tab value='3' label='PORT' />
            </TabList>
          </Grid>
          <TabPanel value='1'>
            <TCP cameras={cameras} mtu={mtu} cameraId={cameraId} onClose={onClose} />
          </TabPanel>
          <TabPanel value='2'>
            <DDNs cameras={cameras} onClose={onClose} />
          </TabPanel>
          <TabPanel value='3'>
            <Port cameras={cameras} onClose={onClose} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default Network
