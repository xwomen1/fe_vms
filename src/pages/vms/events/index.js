import { useState } from 'react'
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, styled } from '@mui/material'
import EventCar from './view/eventCar'
import EventFace from './view/eventFace'
import EventList from './view/eventList'
import EventConfig from './view/eventConfig'
import EventMap from './view/eventMap'

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

const Events = () => {
  const [value, setValue] = useState('1')
  const [isDetectCrowdEnabled, setIsDetectCrowdEnabled] = useState(false)

  const handleChange = (event, newValue) => {
    if (newValue === '4' && !isDetectCrowdEnabled) {
      return
    }
    setValue(newValue)
  }

  return (
    <div>
      <Grid container spacing={0} style={{ marginTop: 10 }}>
        <TabContext value={value}>
          <Grid item xs={12}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Danh sách' key={1} />
              <Tab value='2' label='Khuôn mặt' key={2} />
              <Tab value='3' label='Biển số' key={3} />
              <Tab value='4' label='Phát hiện đám đông' key={4} disabled={!isDetectCrowdEnabled} />
              <Tab value='5' label='Bản đồ' key={5} />
            </TabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value='1'>
              <EventList />
            </TabPanel>
            <TabPanel value='2'>
              <EventFace />
            </TabPanel>
            <TabPanel value='3'>
              <EventCar />
            </TabPanel>
            <TabPanel value='5'>
              <EventMap />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </div>
  )
}

export default Events
