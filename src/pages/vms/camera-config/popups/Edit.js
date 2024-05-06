import { useEffect, useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
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
import Passwords from './PassWord'
import Video from './VideoCameraa'
import Image from './ImageCamera'
import Cloud from './CloudCamera'

import {
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material'

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
import Swal from 'sweetalert2'

const Edit = ({ open, onClose, onSelect, camera }) => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [groupName, setGroupName] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null) // Thêm trạng thái để lưu trữ id của nhóm được chọn
  const [cameras, setCamera] = useState([])
  const [nic, setNic] = useState([])
  const [value, setValue] = useState('1')
  const [value1, setValue1] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChange1 = (event, newValue) => {
    setValue1(newValue)
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
  }, [camera]) // Thêm openPopupNetwork vào dependency array để useEffect được gọi khi openPopupNetwork thay đổi

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Grid>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Mật khẩu' />
              <Tab value='2' label='Mạng' />
              <Tab value='3' label='Video' />
              <Tab value='4' label='Hình ảnh' />
              <Tab value='5' label='Bộ nhớ' />
            </TabList>
          </Grid>
          <TabPanel value='1'>
            <Passwords />
          </TabPanel>
          <TabPanel value='2'>
            <TabContext value={value1}>
              <Grid>
                {' '}
                <TabList onChange={handleChange1} aria-label='customized tabs example'>
                  <Tab value='6' label='TCP/IP' />
                  <Tab value='7' label='DDNS' />
                  <Tab value='8' label='PORT' />
                  {/* <Tab value='4' label='NTP' /> */}
                </TabList>
              </Grid>
              <TabPanel value='6'>
                {' '}
                <TCP camera={cameras} nic={nic} />
              </TabPanel>
              <TabPanel value='7'>
                {' '}
                <DDNs camera={cameras} />
              </TabPanel>
              <TabPanel value='8'>
                {' '}
                <Port nvrs={cameras} />
              </TabPanel>
            </TabContext>{' '}
          </TabPanel>
          <TabPanel value='3'>
            {' '}
            <Video nvrs={cameras} />
          </TabPanel>
          <TabPanel value='4'>
            {' '}
            <Image nvrs={cameras} />
          </TabPanel>
          <TabPanel value='5'>
            {' '}
            <Cloud nvrs={cameras} />
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Edit
