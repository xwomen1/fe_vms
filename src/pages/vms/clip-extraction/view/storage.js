import React, { useState, useEffect } from 'react'
import { Box, Button, CardHeader, DialogActions, Grid, Typography, styled } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { Card, CardContent } from '@mui/material'
import { callApi } from 'src/@core/utils/requestUltils'
import Timeline from '../mocdata/timeline'
import axios from 'axios'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import ViewCameraPause from 'src/@core/components/camera/playbackpause'
import { TreeItem, TreeView } from '@mui/lab'
import CustomTextField from 'src/@core/components/mui/text-field'

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

const Storage = () => {
  const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
  const [cameraList, setCameraList] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(30)

  const [minuteType, setMinuteType] = useState(null)

  const [startTime, setStartTime] = useState(new Date().getTime() - 60 * 60 * 1000)

  const [endTime, setEndTime] = useState(new Date().getTime())

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

  const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
  const [eventsData, setEventData] = useState([])
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)

  const configWs = {
    bundlePolicy: 'max-bundle',
    iceServers: [
      {
        urls: 'stun:dev-ivis-camera-api.basesystem.one:3478'
      },
      {
        urls: 'turn:dev-ivis-camera-api.basesystem.one:3478',
        username: 'demo',
        credential: 'demo'
      }
    ]
  }

  // create WebSocket connection
  const createWsConnection = () => {
    const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/cameraStatus/${clientId}`)

    setWebsocket(ws)

    //create RTCPeerConnection
    const pc = new RTCPeerConnection(configWs)
    setRtcPeerConnection(pc)

    //listen for remote tracks and add them to remote stream

    pc.ontrack = event => {
      const stream = event.streams[0]
      if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
        setRemoteStream(stream)
        remoteVideoRef.current.srcObject = stream
      }
    }

    // close Websocket and RTCPeerConnection on component unmount

    return () => {
      if (websocket) {
        websocket.close()
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
      }
    }
  }

  const handleMessage = async event => {
    const message = JSON.parse(event.data)
    const newMessage = JSON.parse(message?.data)
    setEventData(newMessage)
  }

  const handleClose = async event => {
    if (websocket) {
      websocket.close()
    }
  }

  useEffect(() => {
    const cleanup = createWsConnection()

    return cleanup
  }, [])

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('open', event => {})

      websocket.addEventListener('message', handleMessage)

      websocket.addEventListener('error', error => {
        console.error('WebSocket error: ', error)
      })

      websocket.addEventListener('close', handleClose)
    }
  }, [websocket])

  useEffect(() => {
    if (camera.id !== '') {
      setCamera({ id: camera?.id, name: camera?.name, channel: camera?.channel })
    }
  }, [camera])

  useEffect(() => {
    fetchCameraList()
  }, [keyword])

  const fetchCameraList = async () => {
    setLoading(true)
    try {
      const res = await callApi(
        `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keyword}&limit=25&page=1`
      )
      if (Array.isArray(res?.data)) {
        setCameraList(res?.data)
      } else {
        setCameraList([])
      }
    } catch (error) {
      console.error('Error fetching data: ', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDateList = async () => {
    if (camera.id !== '') {
      setLoading(true)

      const params = {
        startTime: convertDateToString1(startDate),
        endTime: convertDateToString1(endDate)
      }

      try {
        const res = await callApi(
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
                toast.error('Không tìm thấy URL tải về video', { duration: 6000 })
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
      toast.error('Tổng thời gian không được vượt quá 30 phút', { duration: 6000 })
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

  const handleSetCamera = camera => {
    setCamera({ id: camera.id, name: camera.deviceName, channel: 'Sub' })
  }

  const handleSearch = e => {
    setKeyword(e.target.value)
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

  const renderTree = group => {
    return (
      <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
        {group.cameras && group.cameras.length > 0
          ? group.cameras.map(camera => {
              const matchedEvent = eventsData.find(event => event.id === camera.id)
              const status = matchedEvent?.status

              return (
                <StyledTreeItem
                  key={camera.id}
                  nodeId={camera.id}
                  color={status == true ? '#28c76f' : ''}
                  labelText={camera.deviceName}
                  labelIcon='tabler:camera'
                  onClick={() => handleSetCamera(camera)}
                />
              )
            })
          : null}
      </StyledTreeItem>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} lg={2}>
        <Card>
          <CardHeader title='Danh sách Camera' />
          <CardContent>
            <CustomTextField
              value={keyword}
              placeholder='Search…'
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex' }}>
                    <Icon fontSize='1.25rem' icon='tabler:search' />
                  </Box>
                ),
                endAdornment: (
                  <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                    <Icon fontSize='1.25rem' icon='tabler:x' />
                  </IconButton>
                )
              }}
              onChange={handleSearch}
              sx={{
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '& .MuiInputBase-root > svg': {
                  mr: 2
                }
              }}
            />
            <Box
              sx={{
                height: {
                  xs: '300px',
                  sm: '300px',
                  lg: '400px'
                },
                overflow: 'auto',
                marginTop: '10px'
              }}
            >
              <TreeView
                sx={{ minHeight: 240 }}
                defaultExpanded={['root']}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {cameraList.map(group => renderTree(group))}
              </TreeView>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} lg={10}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <Card>
              <CardHeader
                title='Trích clip'
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
                              customInput={<CustomInput label='Ngày bắt đầu' />}
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
                              customInput={<CustomInput label='Ngày kết thúc' />}
                            />
                          </div>
                        </Box>
                      </DatePickerWrapper>
                    </Grid>

                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      <Button variant='contained' onClick={() => fetchDateList()}>
                        Tìm kiếm
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
                        <Icon icon='tabler:player-play-filled' width='48' height='48' style={{ color: '#FF9F43' }} />
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
                  Xuất file
                </Button>
              </DialogActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Storage
