import { useState } from 'react'
import { useRouter } from 'next/router'
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, styled } from '@mui/material'
import InforAll from './infor'
import Setting from './setting'
import Link from 'next/link'

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
  const router = useRouter()
  const id = router.query.Update
  const [value, setValue] = useState('1')
  const [isDetectCrowdEnabled, setIsDetectCrowdEnabled] = useState(false)

  const handleChange = (event, newValue) => {
    if (newValue === '4' && !isDetectCrowdEnabled) {
      return
    }
    setValue(newValue)
  }

  console.log(id, 'id')

  return (
    <div>
      <Grid container spacing={0} style={{ marginTop: 10 }}>
        <TabContext value={value}>
          <Grid item xs={12}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Thông tin chung' key={1} />
              <Tab value='2' label='cấu hình mạng' key={2} />
            </TabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value='1'>
              <InforAll idInfor={id} />
            </TabPanel>
            <TabPanel value='2'>
              <Setting idSetting={id} />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </div>
  )
}

export default Events
