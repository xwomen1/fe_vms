import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getApi } from 'src/@core/utils/requestUltils'
import Swal from 'sweetalert2'
import { callApi } from 'src/@core/utils/requestUltils'
import { TreeItem, TreeView } from '@mui/lab'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  styled,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Pagination,
  DialogActions,
  Dialog,
  DialogContent
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'
import CustomChip from 'src/@core/components/mui/chip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import ViewCameraPause from 'src/@core/components/camera/playbackpause'
import Timeline from '../mocdata/timeline'
import EventDetails from '../popups/eventDetails'
import Add from '../popups/add'
import Checkbox from '@mui/material/Checkbox'

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  // '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
  //   backgroundColor: theme.palette.action.hover
  // },
  // '& .MuiTreeItem-content': {
  //   paddingRight: theme.spacing(3),
  //   borderTopRightRadius: theme.spacing(4),
  //   borderBottomRightRadius: theme.spacing(4),
  //   fontWeight: theme.typography.fontWeightMedium
  // },
  // '& .MuiTreeItem-label': {
  //   fontWeight: 'inherit',
  //   paddingRight: theme.spacing(3)
  // },
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
  const { labelText, labelIcon, labelInfo, color, textDirection, disabled, ...other } = props

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box
          sx={{
            py: 1,
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 1 }
          }}
        >
          <Icon icon={labelIcon} color={color} />
          <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500, textDecoration: textDirection }}>
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

const initValueFilter = {
  keyword: '',
  limit: 25,
  page: 1
}

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

const ContentAnalysis = () => {
  const [keywordCamera, setKeywordCamera] = useState('')
  const [keyword, setKeyword] = useState('')
  const [cameraList, setCameraList] = useState([])
  const [dataList, setDataList] = useState([])
  const [idCameraSelected, setIdCameraSelected] = useState(null)
  const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
  const [loading, setLoading] = useState(false)
  const [cameraGroup, setCameraGroup] = useState([])
  const [areaGroup, setAreaGroup] = useState([])
  const [count, setCount] = useState('')
  const [total, setTotalPage] = useState(0)
  const [deviceList, setDeviceList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [reload, setReload] = useState(0)
  const [valueFilter, setValueFilter] = useState(initValueFilter)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
  const [eventsData, setEventData] = useState([])
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(30)
  const [minuteType, setMinuteType] = useState(null)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [isOpenFullScreen, setIsOpenFullScreen] = useState(false)
  const [eventDetail, setEventDetail] = useState(null)
  const [isOpenView, setIsOpenView] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [idDelete, setIdDelete] = useState(null)
  const [startTimeCamera, setStartTimeCamera] = useState(null)
  const [endTimeCamera, setEndTimeCamera] = useState(null)
  const [selectedCameras, setSelectedCameras] = useState([])

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
    fetchCameraList()
  }, [keywordCamera])

  const handleSearch = e => {
    setKeyword(e.target.value)
  }

  useEffect(() => {
    const addStatusToCameras = data => {
      return data.map(group => {
        if (group?.cameras && group?.cameras.length > 0) {
          return {
            ...group,
            cameras: group?.cameras.map(camera => {
              const matchedEvent = eventsData.find(event => event.id === camera.id)

              return {
                ...camera,
                status: matchedEvent?.status ? matchedEvent?.status : false
              }
            })
          }
        }

        return group
      })
    }

    const data = addStatusToCameras(cameraList)
    setDataList(data)
  }, [cameraList])

  useEffect(() => {
    const addStatus = data => {
      return data.map(group => {
        if (group?.cameras && group?.cameras.length > 0) {
          return {
            ...group,
            cameras: group?.cameras.map(camera => {
              const matchedEvent = eventsData.find(event => event.id === camera.id)

              return {
                ...camera,
                status:
                  matchedEvent?.status === camera?.status && matchedEvent?.status !== undefined
                    ? camera?.status
                    : matchedEvent?.status !== camera?.status && matchedEvent?.status !== undefined
                    ? matchedEvent?.status
                    : matchedEvent?.status !== camera?.status && matchedEvent?.status === undefined
                    ? camera?.status
                    : false
              }
            })
          }
        }

        return group
      })
    }
    const data = addStatus(dataList)
    setDataList(data)
  }, [eventsData])

  const fetchDataList = async () => {
    const deviceName = selectedCameras?.map(camera => camera.deviceName).join(',')
    const params = {
      ...configWs,
      params: {
        keyword: keyword || '',
        limit: pageSize,
        page: parseInt(page),
        cameraName: deviceName,
        startTime: startTimeCamera ? startTimeCamera.getTime() : null,
        endTime: endTimeCamera ? endTimeCamera.getTime() : null
      }
    }

    setLoading(true)

    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/routine`, params)
      setDeviceList(res?.data)
      setCount(res.count)
      setTotalPage(Math.ceil(res.count / pageSize))
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'An error occurred while fetching data.'}`)
      } else if (error.request) {
        toast.error('Error: No response from the server.')
      } else {
        toast.error(`Error: ${error.message}`)
      }
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [])

  useEffect(() => {
    fetchDataList()
  }, [valueFilter, reload, keyword, page, pageSize, camera.name, selectedCameras])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const fetchCameraList = async () => {
    try {
      const res = await callApi(
        `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keywordCamera}&limit=25&page=1`
      )
      console.log(res, 'res')

      if (Array.isArray(res?.data)) {
        setCameraList(res?.data)
      } else {
        setCameraList([])
      }
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    }
  }

  const handleSearchCamera = e => {
    setKeywordCamera(e.target.value)
  }
  console.log(camera.id, camera.name, camera.channel, 'camera')

  const handleSetCamera = camera => {
    setCamera({ id: camera.id, name: camera.deviceName, channel: 'Sub' })
    setIdCameraSelected(camera.id)
  }

  const handleCheckboxChange = (camera, checked) => {
    setSelectedCameras(prevSelected => {
      if (checked) {
        // Thêm camera vào danh sách nếu được chọn
        return [...prevSelected, camera]
      } else {
        // Xóa camera khỏi danh sách nếu bỏ chọn
        return prevSelected.filter(item => item.id !== camera.id)
      }
    })
  }

  const renderTree = group => {
    return (
      <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
        {group.cameras && group.cameras.length > 0
          ? group.cameras.map(camera => {
              const isChecked = selectedCameras.some(item => item.id === camera.id)

              return (
                <StyledTreeItem
                  key={camera.id}
                  nodeId={camera.id}
                  color={camera.status ? '#28c76f' : ''}
                  textDirection={camera.id === idCameraSelected ? 'underline' : ''}
                  labelText={
                    <>
                      <Checkbox
                        checked={isChecked}
                        onChange={e => handleCheckboxChange(camera, e.target.checked)}
                        onClick={e => e.stopPropagation()}
                      />
                      <span onClick={() => handleCheckboxChange(camera, !isChecked)} style={{ cursor: 'pointer' }}>
                        {camera.deviceName}
                      </span>
                    </>
                  }
                  labelIcon='tabler:camera'
                  onClick={() => handleCheckboxChange(camera, !isChecked)}
                />
              )
            })
          : null}
      </StyledTreeItem>
    )
  }

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
  const [dataListTimeline, setDataListTimeLine] = useState([])

  const [play, setPlay] = useState(false)

  // useEffect(() => {
  //   if (camera.id && camera.name && camera.channel) {
  //     setCamera(camera.id, camera.name, camera.channel)
  //   }
  // }, [camera.id, camera.name, camera.channel])

  useEffect(() => {
    setStartTime(startDate.getTime())
    setEndTime(endDate.getTime())
  }, [startDate, endDate])

  const fetchDateListTimeLine = async () => {
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

        setDataListTimeLine(data)
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
    console.log(data, 'data')

    setCurrentTime(0)
    setPlay(!play)
    setStartTime(data?.startTime?.getTime())
    setEndTime(data?.endTime?.getTime())
  }

  const onClickPlay = v => {
    setPlay(v)
  }

  const DeleteView = () => (
    <Dialog
      open={isOpenDel}
      maxWidth='sm'
      scroll='body'
      onClose={() => setIsOpenDel(false)}
      onBackdropClick={() => setIsOpenDel(false)}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            Accept
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Do you want to delete it?</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button
          variant='contained'
          onClick={() => {
            handleDelete()
            setIsOpenDel(false)
          }}
        >
          Accept
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )

  const handleDelete = () => {
    if (idDelete != null) {
      setLoading(true)

      axios
        .delete(`https://sbs.basesystem.one/ivis/vms/api/v0/aievents/${idDelete}`, configWs)
        .then(() => {
          toast.success('Deleted successfully')
          setIdDelete(null)
          setReload(reload + 1)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
          toast.error(error?.response?.data || '')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleSearchClick = () => {
    fetchDataList()
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              <Button variant='contained'>Event List</Button>
            </>
          }
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          action={
            <Grid container spacing={2} direction='row' alignItems='center'>
              <Grid item>
                <CustomTextField
                  value={keyword}
                  placeholder='Search.. '
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' onClick={() => setKeyword('')} />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                        <Icon fontSize='1.25rem' icon='tabler:x' />
                      </IconButton>
                    )
                  }}
                  onChange={e => handleSearch(e)}
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
              </Grid>

              <Grid item>
                <p style={{ margin: 0 }}>Start Date</p>
              </Grid>
              <Grid item>
                <DatePicker
                  selected={startTimeCamera}
                  onChange={date => setStartTimeCamera(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput />}
                />
              </Grid>

              {/* End Date */}
              <Grid item>
                <p style={{ margin: 0 }}>End Date</p>
              </Grid>
              <Grid item>
                <DatePicker
                  selected={endTimeCamera}
                  onChange={date => setEndTimeCamera(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput />}
                />
              </Grid>
              <Grid item>
                <Button variant='contained' onClick={handleSearchClick}>
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          }
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid container spacing={2} style={{ height: '100%' }}>
              <Grid item xs={2}>
                <Card>
                  <CardContent>
                    <CustomTextField
                      value={keywordCamera}
                      placeholder='Search…!'
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 2, display: 'flex' }}>
                            <Icon fontSize='1.25rem' icon='tabler:search' onClick={() => setKeywordCamera('')} />
                          </Box>
                        ),
                        endAdornment: (
                          <IconButton
                            size='small'
                            title='Clear'
                            aria-label='Clear'
                            onClick={() => setKeywordCamera('')}
                          >
                            <Icon fontSize='1.25rem' icon='tabler:x' />
                          </IconButton>
                        )
                      }}
                      onChange={e => handleSearchCamera(e)}
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
                          lg: '30vh'
                        },
                        overflow: 'auto',
                        marginTop: '10px'
                      }}
                    >
                      <TreeView
                        sx={{ minHeight: 300 }}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                      >
                        {dataList.map(group => renderTree(group))}
                      </TreeView>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={10}>
                <Card>
                  <CardContent sx={{ maxHeight: '650px', overflow: 'auto' }}>
                    {deviceList?.length === 0 ? (
                      <Typography variant='h6' align='center'>
                        No data available
                      </Typography>
                    ) : (
                      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {deviceList?.map((item, index) => {
                          return (
                            <Grid item xs={12} sm={6} lg={2.4} key={index}>
                              <Card
                                sx={{
                                  width: '100%',
                                  height: '300px',
                                  borderWidth: 1,
                                  borderRadius: '10px',
                                  borderStyle: 'solid',
                                  borderColor: '#ccc'
                                }}
                              >
                                <CardContent>
                                  <Box
                                    sx={{
                                      height: '100%',
                                      minHeight: 140,
                                      display: 'flex',
                                      alignItems: 'flex-end',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <img
                                      width={'100%'}
                                      height={150}
                                      alt='add-role'
                                      src={item?.imageObject}
                                      style={{
                                        objectFit: 'contain',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        setIsOpenView(true)
                                        setEventDetail(item)
                                      }}
                                    />
                                  </Box>
                                  <Typography sx={{ marginTop: '10px' }}>
                                    {item?.timestamp ? new Date(item?.timestamp).toLocaleString() : 'Date'}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      marginTop: '10px',
                                      fontWeight: 600,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {item?.result}
                                  </Typography>
                                  <Typography sx={{ marginTop: '10px' }}>
                                    {item?.location ? item?.location : 'Location'}
                                  </Typography>

                                  <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                      setIsOpenView(true)
                                      setEventDetail(item)
                                    }}
                                  >
                                    <Icon icon='tabler:info-circle' />
                                  </IconButton>
                                  <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => {
                                      setIsOpenEdit(true)
                                      setEventDetail(item)
                                    }}
                                  >
                                    <Icon icon='tabler:edit' />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setIdDelete(item.id)
                                      setIsOpenDel(true)
                                    }}
                                  >
                                    <Icon icon='tabler:trash' />
                                  </IconButton>
                                </CardContent>
                              </Card>
                            </Grid>
                          )
                        })}
                        <Grid container spacing={2} style={{ padding: 10 }}>
                          <Grid item xs={3}></Grid>

                          <Grid item xs={1} style={{ padding: 0 }}>
                            <Box>
                              <IconButton onClick={handleOpenMenu}>
                                <Icon icon='tabler:selector' />
                                <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                              </IconButton>
                              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                {pageSizeOptions.map(size => (
                                  <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                                    {size}
                                  </MenuItem>
                                ))}
                              </Menu>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
                <Box sx={{ height: '5px', backgroundColor: '#000', marginY: 2 }} />
                <Card>
                  <Grid container spacing={2}>
                    {' '}
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

                              <Grid
                                item
                                xs={3}
                                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
                              >
                                <Button variant='contained' onClick={() => fetchDateListTimeLine()}>
                                  Search
                                </Button>
                              </Grid>
                            </Grid>
                          }
                        />
                        <CardContent>
                          {loading && <Typography>Loading...</Typography>}
                          {dataListTimeline.length > 0 && (
                            <Timeline
                              data={dataListTimeline}
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
                              <div
                                style={{
                                  height: '30vh',
                                  background: '#000',
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                <IconButton disabled>
                                  <Icon
                                    icon='tabler:player-play-filled'
                                    width='48'
                                    height='48'
                                    style={{ color: '#002060' }}
                                  />
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
                                isFullScreen={isOpenFullScreen}
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
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isOpenView && (
        <EventDetails
          show={isOpenView}
          onClose={() => setIsOpenView(false)}
          data={eventDetail}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {isOpenEdit && (
        <Add
          show={isOpenEdit}
          onClose={() => setIsOpenEdit(false)}
          data={eventDetail}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {isOpenDel && DeleteView()}
    </>
  )
}

export default ContentAnalysis
