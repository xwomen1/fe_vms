import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
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
  Slider,
  Tooltip,
  Typography,
  styled,
  CircularProgress
} from '@mui/material'
import authConfig from 'src/configs/auth'
import ViewCamera from './viewCamera'
import {
  AddBox,
  CameraAlt,
  FastForward,
  FastRewind,
  IndeterminateCheckBox,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious
} from '@mui/icons-material'
import { format } from 'date-fns'
import CustomTextField from 'src/@core/components/mui/text-field'
import Schedule from '../popups/schedule'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import toast from 'react-hot-toast'

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
  const { labelText, labelIcon, labelInfo, matchedEvent, ...other } = props

  const colorText = matchedEvent?.statusValue?.name ? '#28C76F' : ''

  return (
    <StyledTreeItemRoot
      {...other}
      label={
        <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          <Icon icon={labelIcon} color={colorText} />
          <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500 }} color={colorText}>
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

const areaExample = [
  {
    x: 50,
    y: 50
  },
  {
    x: 50,
    y: 300
  },
  {
    x: 300,
    y: 300
  },
  {
    x: 300,
    y: 50
  }
]

const lineExample = [
  // {
  //     x: 10,
  //     y: 10
  // },
  // {
  //     x: 300,
  //     y: 300
  // },
]

const data = [
  {
    value: '1',
    name: 'Trái qua phải'
  },
  {
    value: '2',
    name: 'Phải qua trái'
  },
  {
    value: '3',
    name: 'Hai chiều'
  }
]

const EventConfig = () => {
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [cameraGroup, setCameraGroup] = useState([])
  const [isOpenSchedule, setIsOpenSchedule] = useState(false)
  const [reload, setReload] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [idCameraSelect, setIdCameraSelect] = useState(null)
  const [nameCameraSelect, setNameCameraSelect] = useState(null)
  const [alertAIList, setAlertAIList] = useState([])
  const [alertList, setAlertList] = useState([])
  const [cameraAIPropertyId, setCameraAIPropertyId] = useState(null)
  const [calendar, setCalendar] = useState(null)

  const [direction, setDirection] = useState({
    value: '1',
    name: 'Trái qua phải'
  })

  const [eventSelect, setEventSelect] = useState(null)
  const [progress, setProgress] = useState(0)
  const [areaSelect, setAreaSelect] = useState(areaExample)
  const [lineSelect, setLineSelect] = useState(lineExample)
  const [isDraw, setIsDraw] = useState('')
  const [isDrawLine, setIsDrawLine] = useState(false)
  const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
  const [startDate, setStartDate] = useState(new Date(new Date() - 100 * 60 * 1000))

  const webcamRef = useRef(null)
  const canvasRef = useRef()

  const [eventsData, setEventData] = useState([])
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

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
      websocket.addEventListener('open', event => { })

      websocket.addEventListener('message', handleMessage)

      websocket.addEventListener('error', error => {
        console.error('WebSocket error: ', error)
      })

      websocket.addEventListener('close', handleClose)
    }
  }, [websocket])

  useEffect(() => {
    setReload(reload + 1)
  }, [eventsData])

  useEffect(() => {
    fetchCameraGroup()
  }, [keyword])

  const fetchCameraGroup = async () => {
    try {
      const res = await axios.get(
        `https://votv.ivms.vn/votv/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keyword}&limit=25&page=1`,
        config
      )
      setCameraGroup(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    if (idCameraSelect != null) {
      fetchModelAICamera()
    }
  }, [idCameraSelect, reload])

  const fetchModelAICamera = async () => {
    try {
      const res = await axios.get(
        `https://votv.ivms.vn/votv/vms/api/v0/cameras/user/ai-properties/camera/${idCameraSelect}`,
        config
      )
      setAlertAIList(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
      toast(error)
    }
  }

  useEffect(() => {
    if (alertAIList && alertAIList[0] && alertAIList[0].cameraaiproperty) {
      setAlertList(alertAIList[0].cameraaiproperty)
      setCameraAIPropertyId(alertAIList[0].id)
    } else {
      setAlertList([])
      setCameraAIPropertyId(null)
    }

    setAreaSelect([])
    setLineSelect([])
  }, [alertAIList])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.addEventListener('click', draw)
    if (eventSelect && areaSelect.length == 4) {
      drawRectangle([...areaSelect])
    }
    if (eventSelect && lineSelect.length > 1) {
      drawVector([...lineSelect])
    }
    function draw(event) {
      if (isDraw == 'line') {
        setLineSelect([...lineSelect, { x: event.offsetX, y: event.offsetY }])
        drawVector([...lineSelect, { x: event.offsetX, y: event.offsetY }])
      }
      if (isDraw == 'rectangle' && areaSelect.length < 4) {
        setAreaSelect([...areaSelect, { x: event.offsetX, y: event.offsetY }])
        drawRectangle([...areaSelect, { x: event.offsetX, y: event.offsetY }])
      }
    }

    // Remove event listener when component unmounts
    return () => {
      canvas.removeEventListener('click', draw)
    }
  }, [isDraw, eventSelect, areaSelect, lineSelect, direction])

  const clearAction = () => {
    setAreaSelect([])
    setLineSelect([])
    clearCanvas()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawRectangle = points => {
    clearCanvas()
    const context = canvasRef.current.getContext('2d')
    for (let i = 0; i < points.length; i++) {
      context.fillStyle = 'red'
      context.beginPath()
      var pointX = Math.round(points[i]?.x)
      var pointY = Math.round(points[i]?.y)
      context.arc(pointX, pointY, 5, 0, Math.PI * 2)
      context.closePath()
      context.fill()
    }

    if (points.length > 1) {
      for (let i = 1; i < points.length; i++) {
        context.beginPath()
        context.strokeStyle = 'red'
        context.moveTo(points[i]?.x, points[i]?.y)
        context.lineTo(points[i - 1]?.x, points[i - 1]?.y)
        context.lineWidth = 2
        context.closePath()
        context.stroke()
      }
      if (points.length == 4) {
        context.fillStyle = 'blue'
        context.beginPath()

        //context.strokeStyle = "red"
        context.moveTo(points[0]?.x, points[0]?.y)
        context.lineTo(points[1]?.x, points[1]?.y)
        context.lineTo(points[2]?.x, points[2]?.y)
        context.lineTo(points[3]?.x, points[3]?.y)
        context.lineWidth = 2
        context.closePath()
        context.stroke()
        context.fill()
      }
    }
  }

  const drawVector = points => {
    clearCanvas()
    const context = canvasRef.current.getContext('2d')
    for (let i = 0; i < points.length; i++) {
      context.fillStyle = 'red'
      context.beginPath()
      var pointX = Math.round(points[i]?.x)
      var pointY = Math.round(points[i]?.y)
      context.arc(pointX, pointY, 5, 0, Math.PI * 2)
      context.closePath()
      context.fill()
    }
    if (points.length > 1) {
      for (let i = 1; i < points.length; i++) {
        if (i % 2 == 1) {
          let A = [points[i - 1]?.x, points[i - 1]?.y]
          let B = [points[i]?.x, points[i]?.y]
          if (points[i]?.y < points[i - 1]?.y) {
            B = [points[i - 1]?.x, points[i - 1]?.y]
            A = [points[i]?.x, points[i]?.y]
          }

          context.strokeStyle = 'red'
          context.beginPath()
          context.moveTo(...A)
          context.lineTo(...B)
          context.stroke()
          const D = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]

          // Vẽ vector
          // const vector = [D[0] + 50, D[1] + 50]
          // Tính toán hai vector chỉ phương vuông góc với đường thẳng AB
          const midpoint = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]

          const length = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2))

          const v1 = [(B[1] - A[1]) / length, -(B[0] - A[0]) / length]
          const v2 = [-(B[1] - A[1]) / length, (B[0] - A[0]) / length]

          // Vẽ hai vector chỉ phương
          context.beginPath()
          const vector = [midpoint[0] + v1[0] * 50, midpoint[1] + v1[1] * 50]
          const vector2 = [midpoint[0] + v2[0] * 50, midpoint[1] + v2[1] * 50]
          context.moveTo(midpoint[0], midpoint[1])
          context.lineTo(vector[0], vector[1])
          context.stroke()
          const angle = Math.atan2(vector[1] - D[1], vector[0] - D[0])
          const angle2 = Math.atan2(vector2[1] - D[1], vector2[0] - D[0])
          const arrowWidth = 10
          const arrowLength = 15

          if (direction?.value != '2') {
            context.translate(vector[0], vector[1])
            context.rotate(angle)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-arrowLength, arrowWidth / 2)
            context.lineTo(-arrowLength, -arrowWidth / 2)
            context.closePath()
            context.fill()
            context.rotate(-angle)
            context.translate(-vector[0], -vector[1])
          }

          if (direction?.value != '1') {
            context.translate(vector2[0], vector2[1])
            context.rotate(angle2)
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(-arrowLength, arrowWidth / 2)
            context.lineTo(-arrowLength, -arrowWidth / 2)
            context.closePath()
            context.fill()
            context.rotate(-angle2)
            context.translate(-vector2[0], -vector2[1])
          }

          context.beginPath()
          context.moveTo(midpoint[0], midpoint[1])
          context.lineTo(midpoint[0] + v2[0] * 50, midpoint[1] + v2[1] * 50)
          context.stroke()
          context.closePath()
        }
      }
    }
  }

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = (event, newValue) => {
    setProgress(newValue)
  }

  const valueLabelFormat = value => {
    return format(new Date(startDate.getTime() + (value / 100) * zoom * 60 * 1000), 'HH:mm:ss')
  }

  function createSilder(startDate) {
    let m = []
    for (let i = 0; i <= 10; i++) {
      let timeStep = new Date(startDate.getTime() + Math.floor(60 * i * (zoom / 10) * 1000))

      if (i > 0) {
        let timeStepPre = new Date(startDate.getTime() + Math.floor(60 * (i - 1) * (zoom / 10) * 1000))

        if (timeStepPre.getDate() != timeStep.getDate()) {
          m.push({
            value: i * 10,
            label: format(timeStep, 'MM-dd HH:mm:ss')
          })
        } else {
          m.push({
            value: i * 10,
            label: format(timeStep, 'HH:mm:ss')
          })
        }
      } else {
        m.push({
          value: i * 10,
          label: format(timeStep, 'HH:mm:ss')
        })
      }
    }

    return m
  }

  const marks = createSilder(startDate)

  const handleSearch = e => {
    setKeyword(e.target.value)
  }

  const handleItemClick = (cameraId, camName) => {
    setIdCameraSelect(cameraId)
    setNameCameraSelect(camName)
  }

  const updateAlertList = async changedAlerts => {
    const params = {
      cameraaiproperty: [...changedAlerts]
    }

    try {
      await axios.put(
        `https://votv.ivms.vn/votv/vms/api/v0/cameras/user/ai-properties/${cameraAIPropertyId}`,
        { ...params },
        config
      )
      setReload(reload + 1)
      toast.success('Action thành công')
    } catch (error) {
      console.error('Error fetching data: ', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetSchedule = async data => {
    setLoading(true)

    const changedAlerts = alertList.map(alert => {
      return alert.aitype === eventSelect ? { ...alert, calendarDays: data?.calendarDays } : alert
    })

    await updateAlertList(changedAlerts)
  }

  const handleActiveAlertAI = async typeAI => {
    setLoading(true)

    const changedAlerts = alertList.map(alert => {
      return alert.aitype === typeAI ? { ...alert, isactive: !alert.isactive } : alert
    })

    await updateAlertList(changedAlerts)
  }

  const handleZoning = async data => {
    setLoading(true)

    const cameraAiZone = {
      vfences: null,
      vzone: {
        point_a: { ...data[0] },
        point_b: { ...data[1] },
        point_c: { ...data[2] },
        point_d: { ...data[3] }
      }
    }

    const changedAlerts = alertList.map(alert => {
      return alert.aitype === eventSelect ? { ...alert, cameraaizone: cameraAiZone } : alert
    })

    await updateAlertList(changedAlerts)
  }

  const handleVirtualFence = async data => {
    setLoading(true)

    const cameraAiZone = {
      vfences: [],
      vzone: {}
    }

    for (let i = 0; i < data?.length; i += 2) {
      const dx = data[i]
      const dy = data[i + 1]
      cameraAiZone.vfences.push({ dx: { x: dx.x, y: dx.y }, dy: { x: dy.x, y: dy.y }, vector: 0 })
    }

    const changedAlerts = alertList.map(alert => {
      return alert.aitype === eventSelect ? { ...alert, cameraaizone: cameraAiZone } : alert
    })

    await updateAlertList(changedAlerts)
  }

  const alertAIListView = () => {
    return alertList.map((alert, index) => (
      <>
        <Card
          onClick={() => {
            if (alert.isactive == true) {
              setEventSelect(alert?.aitype)

              if (alert.cameraaizone.vfences === null) {
                let arr = Object.entries(alert.cameraaizone.vzone).map(([key, value]) => ({ ...value }))

                setAreaSelect(arr)
                setLineSelect([])
              }
              if (alert.cameraaizone.vfences !== null) {
                let arr = alert.cameraaizone.vfences?.flatMap(x => [x.dx, x.dy])

                setAreaSelect([])
                setLineSelect(arr)
              }
            }
            setCalendar(alert?.calendarDays)
          }}
          sx={{
            marginBottom: 5,
            background: eventSelect === alert?.aitype ? 'rgb(0, 123, 255, 0.5)' : null
          }}
        >
          <CardHeader title={alert?.aitype} />
          <CardContent>
            <Typography variant='h5'></Typography>
            <Typography variant='body1' alignLeft={2}>
              Sensitivity: {alert?.sensitivity}
            </Typography>
            <Typography variant='body1' alignLeft={2}>
              Object: {alert?.target}
            </Typography>
          </CardContent>
          <Button
            variant='contained'
            sx={{
              py: 2.5,
              width: '100%',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            color={alert.isactive === false ? 'success' : 'primary'}
            onClick={() => {
              handleActiveAlertAI(alert?.aitype)
            }}
          >
            {alert.isactive == true ? 'Tắt cảnh báo ' : 'Bật cảnh báo'}
          </Button>
        </Card>
      </>
    ))
  }

  const renderTree = group => {
    return (
      <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
        {group.cameras && group.cameras.length > 0
          ? group.cameras.map(camera => {
            const matchedEvent = eventsData.find(event => event.id === camera.id)

            const labelText = matchedEvent
              ? `${camera.deviceName} (${matchedEvent.statusValue.name})`
              : camera.deviceName

            return (
              <StyledTreeItem
                key={camera.id}
                nodeId={camera.id}
                labelText={camera.deviceName}
                matchedEvent={matchedEvent ? matchedEvent : ''}
                labelIcon='tabler:camera'
                onClick={() => handleItemClick(camera.id, camera.deviceName)}
              />
            )
          })
          : null}
      </StyledTreeItem>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardHeader title='Camera List ' />
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
              <Box sx={{ height: '400px', overflow: 'auto' }}>
                <Typography variant='h5' sx={{ mb: 2, mt: 2 }}>
                  CAM Tầng 1
                </Typography>
                <TreeView
                  sx={{ minHeight: 240 }}
                  defaultExpanded={['root']}
                  defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                  defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                >
                  {cameraGroup.map(group => renderTree(group))}
                </TreeView>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Cảnh báo AI' />
                <CardContent sx={{ height: '450px', overflow: 'auto' }}>{alertAIListView()}</CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ marginTop: 5 }}>
                    {isDraw && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Button
                            onClick={() => {
                              clearAction()
                              setLineSelect([])
                              setAreaSelect([])
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Clear
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            onClick={() => {
                              setIsDraw('')
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            onClick={() => {
                              if (isDraw == 'rectangle') {
                                handleZoning(areaSelect)
                              }
                              if (isDraw == 'line') {
                                handleVirtualFence(lineSelect)
                              }
                              setIsDraw('')
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Save
                          </Button>
                        </Grid>
                        {isDraw == 'line' && (
                          <Grid item xs={12}>
                            <CustomAutocomplete
                              options={data}
                              id='autocomplete-custom'
                              getOptionLabel={option => option.name || ''}
                              renderInput={params => <CustomTextField {...params} label='' />}
                              onChange={(e, value) => {
                                if (value) {
                                  setDirection(value)
                                }
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    )}
                    {!isDraw && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            style={{ width: '100%' }}
                            onClick={() => {
                              setIsDraw('rectangle')
                              clearAction()
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Khoanh Region
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            style={{ width: '100%' }}
                            onClick={() => {
                              setIsDraw('line')
                              clearAction()
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Rào ảo
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            style={{ width: '100%' }}
                            onClick={() => {
                              clearAction()
                              setLineSelect([])
                              setAreaSelect([])
                            }}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Xóa
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            style={{ width: '100%' }}
                            onClick={() => setIsOpenSchedule(true)}
                            variant='outlined'
                            disabled={!eventSelect}
                          >
                            Lịch
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  width: '100%',
                  height: 530,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 640,
                    height: 360,
                    background: '#ccc',
                    borderRadius: 2
                  }}
                >
                  {idCameraSelect != null && <ViewCamera key={idCameraSelect} id={idCameraSelect} channel={'Sub'} />}
                  <canvas
                    ref={canvasRef}
                    width='640'
                    height='360'
                    style={{
                      background: 'none',
                      position: 'absolute',
                      opacity: 0.5,
                      top: 21
                    }}
                    id='cameraEdit'
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h5'>{nameCameraSelect}</Typography>
                </Box>

                <div style={{ width: '100%', marginTop: 20, padding: 5 }}>
                  <Box display='flex' flexDirection='column' position='relative'>
                    <div style={{ position: 'absolute', top: -30, right: -30 }}>
                      <Tooltip title='Thu nhỏ'>
                        <IconButton
                          disabled={zoom < 50}
                          onClick={() => {
                            setZoom(zoom - 60)
                          }}
                        >
                          <IndeterminateCheckBox />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Phóng to'>
                        <IconButton
                          disabled={zoom > 1440}
                          onClick={() => {
                            setZoom(zoom + 60)
                          }}
                        >
                          <AddBox />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className='' style={{ background: '#000', height: 25, display: 'flex', marginTop: 5 }}>
                      <div
                        style={{ background: '#F85B3B', width: 2, height: '100%', marginRight: 20, marginLeft: 100 }}
                      ></div>
                      <div style={{ background: 'green', width: 2, height: '100%', marginRight: 100 }}></div>
                      <div style={{ background: 'blue', width: 2, height: '100%' }}></div>
                      <div
                        style={{ background: '#F85B3B', width: 2, height: '100%', marginRight: 20, marginLeft: 100 }}
                      ></div>
                      <div style={{ background: 'green', width: 2, height: '100%', marginRight: 100 }}></div>
                      <div style={{ background: 'blue', width: 2, height: '100%' }}></div>
                      <div
                        style={{ background: '#F85B3B', width: 2, height: '100%', marginRight: 20, marginLeft: 100 }}
                      ></div>
                      <div style={{ background: 'green', width: 2, height: '100%', marginRight: 100 }}></div>
                      <div style={{ background: 'blue', width: 2, height: '100%' }}></div>
                    </div>
                    <Slider
                      style={{
                        position: 'absolute',
                        top: 15
                      }}
                      value={progress}
                      onChange={handleSliderChange}
                      step={0.1}
                      min={0}
                      max={100}
                      marks={marks}
                      size='small'
                      defaultValue={70}
                      aria-label='Small'
                      valueLabelDisplay='off'
                      ValueLabelComponent={({ children, value }) => (
                        <Tooltip open={false} title={valueLabelFormat(value)}>
                          {children}
                        </Tooltip>
                      )}
                    />
                  </Box>
                </div>
                <div style={{ width: '100%', height: 50, marginTop: 30 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <IconButton color='primary'>
                      <CameraAlt />
                    </IconButton>
                    <IconButton color='primary'>
                      <SkipPrevious />
                    </IconButton>
                    <IconButton color='primary'>
                      <FastRewind />
                    </IconButton>
                    <IconButton color='primary' onClick={handlePlayClick} aria-label={isPlaying ? 'pause' : 'play'}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton color='primary'>
                      <FastForward />
                    </IconButton>
                    <IconButton color='primary'>
                      <SkipNext />
                    </IconButton>
                  </Box>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isOpenSchedule && (
        <Schedule
          onClose={() => setIsOpenSchedule(false)}
          show={isOpenSchedule}
          callback={handleSetSchedule}
          data={calendar}
        />
      )}
    </>
  )
}

export default EventConfig
