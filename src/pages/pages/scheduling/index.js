import { Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'

import AppointmentList from './appointmentList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useState } from 'react'
import Approval from './approval'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Filter from './popups/Filter'

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

const initValueFilter = {
  createdUserIds: null,
  startDate: null,
  endDate: null,
  startTimeInMinute: null,
  endTimeInMinute: null,
  statues: null,
  repeatType: null,
  createdAt: null
}

const Caller = () => {
  const [value, setValue] = useState('1')
  const [keyword, setKeyword] = useState('')
  const [valueFilter, setValueFilter] = useState(initValueFilter)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }


  return (
    <Grid container spacing={2} style={{ minWidth: '1000px' }}>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={3}>
          <Button variant='contained'>Manage visitors to the office</Button>
        </Grid>
        <Grid item xs={6}>
          <CustomTextField
            id='input-with-icon-adornment'
            fullWidth
            onChange={e => setKeyword(e.target.value)}
            placeholder='Search for registrant, name and ID of registrant, order number'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon="tabler:search" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex' }}>
          <Button
            variant='contained'
            size='small'
            component={Link}
            href={`/pages/scheduling/add`}
            sx={{ right: '10px' }}
          >
            Add
          </Button>
          <Button variant='contained' sx={{ marginLeft: 5 }} onClick={() => setIsOpenFilter(true)}>
            <Icon icon='tabler:filter' />
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop={'25px'}>
        <TabContext value={value}>
          <Grid>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Appointment List' />
              <Tab value='2' label='Approve' />
            </TabList>
          </Grid>
          <TabPanel value='1'>
            <AppointmentList keyword={keyword} valueFilter={valueFilter} />
          </TabPanel>
          <TabPanel value='2'>
            <Approval keyword={keyword} valueFilter={valueFilter} />
          </TabPanel>
        </TabContext>
      </Grid>
      {isOpenFilter &&
        <Filter show={isOpenFilter} onClose={() => setIsOpenFilter(false)} valueFilter={valueFilter} callback={handleSetValueFilter} />
      }
    </Grid>
  )
}

export default Caller
