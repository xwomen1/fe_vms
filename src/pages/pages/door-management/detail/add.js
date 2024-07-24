import { useState } from 'react'
import { useRouter } from 'next/router'
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, styled } from '@mui/material'
import InforDoor from './addDoor'

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
    setValue(newValue)
  }

  return (
    <div>
      <Grid container spacing={0} style={{ marginTop: 10 }}>
        <TabContext value={value}>
          <Grid item xs={12}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Thông tin chung' key={1} />
            </TabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value='1'>
              <InforDoor />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </div>
  )
}

export default Events
