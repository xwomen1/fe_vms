import { forwardRef, useEffect, useState } from 'react'
import { Fade, Grid, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import Device from './Device'
import Networks from './Networks'
import Passwords from './PassWord'
import Video from './VideoCameraa'
import Images from './ImageCamera'
import Cloud from './CloudCamera'
import Icon from 'src/@core/components/icon'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

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
    height: 48, // Set a fixed height for the tabs
    '&:hover': {
      color: theme.palette.primary.main
    },
    flex: 1 // Ensure tabs take equal space
  }
}))

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  height: 'auto', // Fixed height for the tab content
  width: '100%', // Adjust to 100% of the dialog's width
  overflow: 'auto' // Enable scrolling if content exceeds the height
}))

const Edit = ({ open, onClose, camera, setReload }) => {
  const [cameras, setCamera] = useState([])
  const [value, setValue] = useState('0')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  console.log(setReload, 'setreload')

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg' // Change to 'lg' or use custom styling
      scroll='body'
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          maxWidth: '1000px', // Custom width
          width: '100%', // Ensure it takes full width
          padding: '20px' // Additional padding if needed
        }
      }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogTitle>Edit </DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          <Grid>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='0' label='Device ' />
              <Tab value='1' label='Password' />
              <Tab value='2' label='Network' />
              <Tab value='3' label='Video' />
              <Tab value='4' label='Image' />
              <Tab value='5' label='Storage' />
            </TabList>
          </Grid>
          <StyledTabPanel value='0'>
            <Device onClose={handleCancel} camera={camera} setReload={setReload} />
          </StyledTabPanel>
          <StyledTabPanel value='1'>
            <Passwords onClose={handleCancel} camera={camera} />
          </StyledTabPanel>
          <StyledTabPanel value='2'>
            <Networks camera={camera} onClose={handleCancel} />
          </StyledTabPanel>
          <StyledTabPanel value='3'>
            <Video onClose={handleCancel} camera={camera} />
          </StyledTabPanel>
          <StyledTabPanel value='4'>
            <Images cameraId={camera} onClose={handleCancel} />
          </StyledTabPanel>
          <StyledTabPanel value='5'>
            <Cloud nvrs={cameras} onClose={handleCancel} />
          </StyledTabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default Edit
