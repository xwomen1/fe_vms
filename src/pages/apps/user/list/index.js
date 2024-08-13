import { Grid } from '@mui/material'

import ListUser from './ListUser'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useState } from 'react'
import TreeViewGroup from './treeview'

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

const Caller = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <TabContext value={value}>
        <Grid>
          {' '}
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab value='1' label='Users' />
            <Tab value='2' label='User group synchronization' />
          </TabList>
        </Grid>
        <TabPanel value='1'>
          <ListUser />
        </TabPanel>
        <TabPanel value='2'>
          <TreeViewGroup />
        </TabPanel>
      </TabContext>
    </Grid>
  )
}

export default Caller
