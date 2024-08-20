import { forwardRef, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Tab,
  Typography,
  styled
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import View from './view'
import Review from './review'
import axios from 'axios'
import toast from 'react-hot-toast'

const convertDateToString = date => {
  const pad = num => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
}

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const EventDetails = ({ show, onClose, data, setReload }) => {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('1')
  const [camera, setCamera] = useState(null)
  const [timestamp, setTimestamp] = useState(data?.timestamp)
  const [startTime, setStartTime] = useState(new Date().getTime() - 10 * 60 * 1000)
  const [endTime, setEndTime] = useState(new Date().getTime())

  useEffect(() => {
    setStartTime(timestamp - 15 * 1000)
    setEndTime(timestamp + 15 * 1000)
  }, [timestamp])

  useEffect(() => {
    setCamera(data?.cameraId)
  }, [data])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleDownloadFile = async () => {
    setLoading(true)

    if (camera !== null) {
      const params = {
        startTime: convertDateToString(new Date(startTime)),
        endTime: convertDateToString(new Date(endTime))
      }

      try {
        const res = await axios.get(
          `https://sbs.basesystem.one/ivis/vms/api/v0/video/downloadchoice?idCamera=${camera}&startTime=${params.startTime}&endTime=${params.endTime}`
        )
        const videoDownloadUrl = res.data[0].videoDownLoad[0].video

        if (videoDownloadUrl) {
          await handleExportLinkDownload(videoDownloadUrl)
        } else {
          toast.error('Download URL for the video not found')
        }
      } catch (error) {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      } finally {
        setLoading(false)
      }
    }

    onClose()
  }

  const handleExportLinkDownload = async linkDownload => {
    const axiosInstance = axios.create()
    try {
      const response = await axiosInstance.get(linkDownload, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'clip.mp4')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error?.message || 'An error occurred while downloading the file.')
    }
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        onClose={onClose}
        maxWidth='lg'
        scroll='body'
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'left' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Event Detail
            </Typography>
          </Box>
          <Grid container spacing={0} style={{ marginTop: 10 }}>
            <TabContext value={value}>
              <Grid item xs={12}>
                {' '}
                <TabList onChange={handleChange} aria-label='customized tabs example'>
                  <Tab value='1' label='Detail' key={1} />
                  <Tab value='2' label='Playback' key={2} />
                </TabList>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value='1'>
                  <View data={data} />
                </TabPanel>
                <TabPanel value='2'>
                  <Review data={data} id={data.cameraId} name={data.camName} channel={'sub'} />
                </TabPanel>
              </Grid>
            </TabContext>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'right',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {value === '1' && (
            <Button type='submit' variant='contained' onClick={() => handleDownloadFile()}>
              Export
            </Button>
          )}
          <Button variant='contained' onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default EventDetails
