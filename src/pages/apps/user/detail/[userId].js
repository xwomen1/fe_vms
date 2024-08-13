import { useState } from 'react'
import { Button, Grid, IconButton, Paper } from '@mui/material'
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
import Resume from './resume '
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
      <Grid container spacing={3} style={{ marginTop: 10 }} alignItems='center'>
        <TabContext value={value}>
          <Grid item xs={4} container alignItems='center'>
            <Button
              variant='contained'
              component={Link}
              href={`/apps/user/list`}
              startIcon={<Icon icon='tabler:chevron-left' />}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={8} container={2}>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <TabList onChange={handleChange} aria-label='customized tabs example'>
                <Tab value='1' label='Information' />
                <Tab value='2' label='Identify' />
                <Tab value='3' label='Access control' />
                <Tab value='4' label='Parking information' />
              </TabList>
            </Grid>
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
