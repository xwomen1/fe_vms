import { useState } from 'react'
import { Grid, IconButton, Paper } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import Info from './info'
import Identity from './identity'
import AccessControl from './accessControl'

import Parking from './parking'

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

const UserDetails = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Grid container spacing={3} style={{ marginTop: 10 }} component={Paper}>
        <TabContext value={value}>
          <Grid container spacing={2} item xs={3}>
            <IconButton size='small' component={Link} href={`/apps/user/list`} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:chevron-left' />
            </IconButton>

            <h2 style={{ color: 'black' }}>Chi tiết người dùng: </h2>
          </Grid>
          <Grid style={{ marginLeft: 200 }}>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Thông tin cá nhân' />
              <Tab value='2' label='Thông tin định danh' />
              <Tab value='3' label='Kiểm soát vào ra' />
              <Tab value='4' label='Thông tin gửi xe' />
            </TabList>
          </Grid>
          <TabPanel value='1'>
            <Info />
          </TabPanel>
          <TabPanel value='2'>
            <Identity />
          </TabPanel>
          <TabPanel value='3'>
            <AccessControl />
          </TabPanel>
          <TabPanel value='4'>
            <Parking />
          </TabPanel>
        </TabContext>
      </Grid>
    </div>
  )
}

export default UserDetails
