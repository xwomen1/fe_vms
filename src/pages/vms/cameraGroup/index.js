import { Grid } from '@mui/material'

// import TableStickyHeader from './table'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useState } from 'react'
import ViewCamera from 'src/@core/components/camera'
import Settings from 'src/@core/components/camera/settings'

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

const DivStyle = styled('div')(({ theme }) => ({
  margin: '-1.2rem -1.5rem'
}))

const MocData = [
  {
    id: 1,
    name: 'Camera 1',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 2,
    name: 'Camera 2',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 3,
    name: 'Camera 3',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 4,
    name: 'Camera 4',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 5,
    name: 'Camera 5',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 6,
    name: 'Camera 6',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 7,
    name: 'Camera 7',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 8,
    name: 'Camera 8',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  },
  {
    id: 9,
    name: 'Camera 9',
    status: 'Connected',
    ip: '',
    location: 'Main Entrance',
    type: 'Dome',
    model: 'Hikvision',
    resolution: '1080p',
    fps: '30',
    bitrate: '5000'
  }
]

const Caller = () => {
  const [sizeScreen, setSizeScreen] = useState(3)

  return (
    <DivStyle>
      <Grid container spacing={0}>
        {MocData.map((camera, index) => (
          <Grid item xs={Math.floor(12 / sizeScreen)} key={index}>
            <ViewCamera id={camera.id} channel={camera.name} status={camera.status} sizeScreen={sizeScreen} />
          </Grid>
        ))}
      </Grid>
      <Settings sizeScreen={sizeScreen} setSizeScreen={size => setSizeScreen(size)} />
    </DivStyle>
  )
}

export default Caller
