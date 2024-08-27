import React, { useState, useEffect } from 'react'
import { Box, Button, CardHeader, DialogActions, Grid, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { Card, CardContent } from '@mui/material'
import { getApi } from 'src/@core/utils/requestUltils'
import Timeline from '../mocdata/timeline'
import axios from 'axios'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import ViewCameraPause from 'src/@core/components/camera/playbackpause'

const convertDateToString1 = date => {
  const pad = num => String(num).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`
}

const Storage = ({ id, name, channel }) => {
  const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(30)
  const [minuteType, setMinuteType] = useState(null)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0) // Thiết lập thời gian về 00:00:00

    return yesterday
  })

  const [endDate, setEndDate] = useState(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Thiết lập thời gian về 23:59:59

    return today
  })

  const [currentTime, setCurrentTime] = useState(0)

  const [play, setPlay] = useState(false)
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    setCamera({ id, name, channel })
  }, [id, name, channel])

  useEffect(() => {
    setStartTime(startDate.getTime())
    setEndTime(endDate.getTime())
  }, [startDate, endDate])

  const fetchDateList = async () => {
    if (camera.id !== '') {
      setLoading(true)

      const params = {
        startTime: convertDateToString1(startDate),
        endTime: convertDateToString1(endDate)
      }

      try {
        const res = await getApi(
          `https://sbs.basesystem.one/ivis/vms/api/v0/playback/camera/${camera.id}?startTime=${params.startTime}&endTime=${params.endTime}`
        )

        const data = res.data.MatchList.map((item, index) => {
          return item.TimeSpan
        })

        setDataList(data)
      } catch (error) {
        if (error && error.response && error.response.data) {
          console.error('error', error)
          toast.error(error.response.data.message, { duration: 6000 })
        } else {
          console.error('Error fetching data:', error)
          toast.error(error.message || 'An error occurred while fetching data.', { duration: 6000 })
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDownloadFile = async () => {
    setLoading(true)

    const timeDistance = endTime - startTime

    if (timeDistance <= 30 * 60 * 1000) {
      const params = []
      let length = 0
      if (timeDistance <= 10 * 60 * 1000) {
        length += 1
      } else if (timeDistance <= 20 * 60 * 1000) {
        length += 2
      } else if (timeDistance <= 30 * 60 * 1000) {
        length += 3
      }

      for (let i = 0; i < length; i++) {
        const start = startTime + i * 10 * 60 * 1000
        const end = startTime + (i + 1) * 10 * 60 * 1000

        params.push({
          start: convertDateToString1(new Date(start)),
          end: convertDateToString1(new Date(end))
        })
      }

      if (camera.id !== '') {
        try {
          const requests = params.map(async time => {
            try {
              const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/video/download?idCamera=${camera.id}&startTime=${time.start}&endTime=${time.end}`
              )
              if (
                res.data &&
                res.data[0] &&
                res.data[0].videoDownLoad &&
                res.data[0].videoDownLoad[0] &&
                res.data[0].videoDownLoad[0].video
              ) {
                const videoDownloadUrl = res.data[0].videoDownLoad[0].video
                await handleExportLinkDownload(videoDownloadUrl)
              } else {
                toast.error('Download URL for the video not found', { duration: 6000 })
              }
            } catch (error) {
              if (error && error.response && error.response.data) {
                console.error('error', error)
                toast.error(error.response.data.message, { duration: 6000 })
              } else {
                console.error('Error fetching data:', error)
                toast.error(error.message || 'An error occurred while fetching data.', { duration: 6000 })
              }
            }
          })

          await Promise.all(requests)
        } catch (error) {
          console.error('Unexpected error:', error)
          toast.error('An unexpected error occurred while downloading videos.', { duration: 6000 })
        }
      }

      setLoading(false)
    } else {
      toast.error('The total duration must not exceed 30 minutes', { duration: 6000 })
    }
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
      toast.error(error.message || 'An error occurred while downloading the file.')
    }
  }

  const handSetChanel = (id, channel) => {
    setCamera({ id: camera.id, name: camera.name, channel: channel })
  }

  const handleSetTimeSelected = data => {
    setCurrentTime(0)
    setPlay(!play)
    setStartTime(data?.startTime?.getTime())
    setEndTime(data?.endTime?.getTime())
  }

  const onClickPlay = v => {
    setPlay(v)
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Card>
            <CardHeader
              title='Extract clip'
              action={
                <Grid container spacing={2}>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={3}>
                    <DatePickerWrapper>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                        <div>
                          <DatePicker
                            selected={startDate}
                            maxDate={endDate}
                            onChange={date => setStartDate(date)}
                            dateFormat='dd/MM/yyyy'
                            customInput={<CustomInput label='Start date' />}
                          />
                        </div>
                      </Box>
                    </DatePickerWrapper>
                  </Grid>
                  <Grid item xs={3}>
                    <DatePickerWrapper>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                        <div>
                          <DatePicker
                            selected={endDate}
                            maxDate={new Date()}
                            onChange={date => setEndDate(date)}
                            dateFormat='dd/MM/yyyy'
                            customInput={<CustomInput label='End date' />}
                          />
                        </div>
                      </Box>
                    </DatePickerWrapper>
                  </Grid>

                  <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Button variant='contained' onClick={() => fetchDateList()}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              }
            />
            <CardContent>
              {loading && <Typography>Loading...</Typography>}
              {dataList.length > 0 && (
                <Timeline
                  data={dataList}
                  minuteType={minuteType}
                  startDate={startDate}
                  endDate={endDate}
                  callback={handleSetTimeSelected}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <Grid container spacing={2} sx={{ marginBottom: 5 }}>
              <Grid item xs={12}>
                {(camera.id === '' || play === false) && (
                  <div style={{ height: '30vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
                    <IconButton disabled>
                      <Icon icon='tabler:player-play-filled' width='48' height='48' style={{ color: '#002060' }} />
                    </IconButton>
                  </div>
                )}
                {camera.id !== '' && play && (
                  <ViewCameraPause
                    name={camera.name}
                    id={camera.id}
                    channel={camera.channel}
                    play={play}
                    startTime={startTime}
                    endTime={endTime}
                    duration={duration}
                    onChangeDuration={setDuration}
                    onChangeCurrentTime={time => {
                      setCurrentTime(1000 * time)
                    }}
                    sizeScreen={'1x1.8'}
                    handSetChanel={handSetChanel}
                    volume={volume}
                  />
                )}
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <IconButton onClick={() => onClickPlay(!play)} style={{ padding: 5, margin: '0 8px 0 8px' }}>
                {play === false ? (
                  <Icon icon='ph:play-light' size='1.2em' color='#000' />
                ) : (
                  <Icon icon='ic:twotone-pause' size='1.2em' color='#000' />
                )}
              </IconButton>
              <Button type='submit' variant='contained' onClick={() => handleDownloadFile()}>
                Export
              </Button>
            </DialogActions>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Storage
