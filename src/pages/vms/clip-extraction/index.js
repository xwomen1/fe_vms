import axios from 'axios'
import authConfig from 'src/configs/auth'
import { TabContext, TabPanel, TreeItem, TreeView } from '@mui/lab'
import { Box, Card, CardContent, CardHeader, Grid, IconButton, Tab, Typography, styled } from '@mui/material'
import MuiTabList from '@mui/lab/TabList'
import { useEffect, useState } from 'react'
import LiveView from './view/liveView'
import Review from './view/review'
import Storage from './view/storage'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

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

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiTreeItem-content': {
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .MuiTreeItem-label': {
    fontWeight: 'inherit',
    paddingRight: theme.spacing(3)
  },
  '& .MuiTreeItem-group': {
    marginLeft: 0,
    '& .MuiTreeItem-content': {
      paddingLeft: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular
    }
  }
}))

const StyledTreeItem = props => {
  // ** Props
  const { labelText, labelIcon, labelInfo, color, ...other } = props

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          <Icon icon={labelIcon} color={color} />
          <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500 }}>
            {labelText}
          </Typography>
          {labelInfo ? (
            <Typography variant='caption' color='inherit'>
              {labelInfo}
            </Typography>
          ) : null}
        </Box>
      }
    />
  )
}

const ClipExtraction = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <TabContext value={value}>
          <Grid item xs={12} sx={{ mb: 5 }}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Trực tiếp' key={1} />
              <Tab value='2' label='Xem lại' key={2} />
              <Tab value='3' label='Trích clip' key={3} />
            </TabList>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <TabPanel value='1' sx={{ paddingTop: '0' }}>
              <LiveView />
            </TabPanel>
            <TabPanel value='2' sx={{ paddingTop: '0' }}>
              <Review />
            </TabPanel>
            <TabPanel value='3' sx={{ paddingTop: '0' }}>
              <Storage />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </>
  )
}

export default ClipExtraction
