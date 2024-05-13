import { useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import Device from './Device'
import Networks from './Networks'
import Passwords from './PassWord'
import Video from './VideoCameraa'
import Image from './ImageCamera'
import Cloud from './CloudCamera'
import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'

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

const Edit = ({ open, onClose, camera }) => {
  const [cameras, setCamera] = useState([])
  const [value, setValue] = useState('0')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  console.log(camera, 'camera eidy')

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='x1' style={{ maxWidth: '80%', margin: 'auto' }}>
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Grid>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='0' label='Thiết bị' />
              <Tab value='1' label='Mật khẩu' />
              <Tab value='2' label='Mạng' />
              <Tab value='3' label='Video' />
              <Tab value='4' label='Hình ảnh' />
              <Tab value='5' label='Bộ nhớ' />
            </TabList>
          </Grid>
          <TabPanel value='0'>
            <Device onClose={handleCancel} camera={camera} />
          </TabPanel>
          <TabPanel value='1'>
            <Passwords onClose={handleCancel} camera={camera} />
          </TabPanel>
          <TabPanel value='2'>
            <Networks camera={camera} />
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
    </Dialog>
  )
}

export default Edit
