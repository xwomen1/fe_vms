import { useState } from 'react'
import { Grid } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import Quet from './Quet'
import Nhap from './Nhap'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

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

const RolePopup = ({ open, onClose, onSelect, nvr }) => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Storage configuration</DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Grid>
            {' '}
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Quet' />
              <Tab value='2' label='Nhap' />
            </TabList>
          </Grid>
          <TabPanel value='1'>
            <Quet />
          </TabPanel>
          <TabPanel value='2'>
            <Nhap />
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
