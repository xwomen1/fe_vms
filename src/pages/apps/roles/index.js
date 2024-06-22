// ** MUI Imports
import Typography from '@mui/material/Typography'
import MuiTabList from '@mui/lab/TabList'
// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, styled } from '@mui/material'
// ** Demo Components Imports
import Table from 'src/views/apps/roles/Table'
import RoleCards from 'src/views/apps/roles/RoleCards'

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

const RolesComponent = () => {
  const [value, setValue] = useState('1')
  const [isDetectCrowdEnabled, setIsDetectCrowdEnabled] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={0} style={{ marginTop: 10 }}>
      <TabContext value={value}>
        <Grid item xs={12}>
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab value='1' label='Vai trò' key={1} />
            <Tab value='2' label='Thiết lập tài nguyên' key={2} />
          </TabList>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value='1'>
            <RoleCards />
          </TabPanel>
          <TabPanel value='2'>
            <Table />
          </TabPanel>
        </Grid>
      </TabContext>
    </Grid>
  )
}

export default RolesComponent
