'use client'

import { TreeItem, TreeView } from '@mui/lab'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, List, styled, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { callApi } from 'src/@core/utils/requestUltils'
import CustomTextField from 'src/@core/components/mui/text-field'
import IndoorMap from './indoor-map'
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

const DigitalMap = () => {
  const [keyword, setKeyword] = useState('')
  const [cameraList, setCameraList] = useState([])
  const [dataList, setDataList] = useState([])
  const [idCameraSelected, setIdCameraSelected] = useState(null)
  const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
  const [cameraGroup, setCameraGroup] = useState([])
  const [areaGroup, setAreaGroup] = useState([])
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)

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
    fetchCameraList()
  }, [keyword])

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
    fetchAreaGroup()
  }, [])

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

  useEffect(() => {
    if (camera?.id !== '') {
      handleAddCameraGroup(camera)
    }
  }, [camera])

  const fetchCameraList = async () => {
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
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    }
  }

  const fetchAreaGroup = async () => {
    try {
      const res = await callApi(
        `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=abbe3f3c-963b-4d23-a766-42a8261607c3`
      )
      if (Array.isArray(res?.data)) {
        setAreaGroup(res?.data)
      } else {
        setAreaGroup([])
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

  const handleSearch = e => {
    setKeyword(e.target.value)
  }

  const handleSetCamera = camera => {
    setCamera({ id: camera.id, name: camera.deviceName, channel: 'Sub' })
    setIdCameraSelected(camera.id)
  }

  const handleAddCameraGroup = camera => {
    let list = [...cameraGroup]
    const result = list.find(element => element?.id === camera?.id)
    if (result === undefined) {
      list.push(camera)
    }
    setCameraGroup(list)
  }

  const renderTree = group => {
    return (
      <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
        {group.cameras && group.cameras.length > 0
          ? group.cameras.map(camera => {
              return (
                <StyledTreeItem
                  key={camera.id}
                  nodeId={camera.id}
                  color={camera?.status == true ? '#28c76f' : ''}
                  textDirection={camera.id === idCameraSelected ? 'underline' : ''}
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
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ display: 'inline-block', position: 'absolute', margin: 5, zIndex: 10 }}>
          {!open1 && (
            <Button variant='contained' onClick={() => setOpen1(true)}>
              Camera List
            </Button>
          )}
          {open1 && (
            <Card sx={{ width: '320px' }}>
              <CardHeader
                title='Camera List'
                action={
                  <Grid container spacing={0}>
                    <IconButton onClick={() => setOpen1(false)}>
                      <Icon icon='tabler:square-rounded-minus' />
                    </IconButton>
                  </Grid>
                }
              />
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
          )}
        </div>
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            margin: 5,
            marginLeft: open1 ? '335px' : '185px',
            zIndex: 10
          }}
        >
          {!open2 && (
            <Button variant='contained' onClick={() => setOpen2(true)}>
              Area List
            </Button>
          )}
          {open2 && (
            <Card sx={{ width: '320px' }}>
              <CardHeader
                title='Area List'
                action={
                  <Grid container spacing={0}>
                    <IconButton onClick={() => setOpen2(false)}>
                      <Icon icon='tabler:square-rounded-minus' />
                    </IconButton>
                  </Grid>
                }
              />
              <CardContent>
                {/* <CustomTextField
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
                                /> */}
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
                    {areaGroup.map(group => renderTree(group))}
                  </TreeView>
                </Box>
              </CardContent>
            </Card>
          )}
        </div>
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            margin: 5,
            zIndex: 10,
            marginLeft: open1 && open2 ? '665px' : open1 && !open2 ? '520px' : !open1 && open2 ? '515px' : '370px'
          }}
        >
          {!open3 && (
            <Button variant='contained' onClick={() => setOpen3(true)}>
              Selected Camera List
            </Button>
          )}
          {open3 && (
            <Card sx={{ width: '320px' }}>
              <CardHeader
                title='Selected Camera List'
                action={
                  <Grid container spacing={0}>
                    <IconButton onClick={() => setOpen3(false)}>
                      <Icon icon='tabler:square-rounded-minus' />
                    </IconButton>
                  </Grid>
                }
              />
              <CardContent>
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
                  <TreeView>
                    {cameraGroup.map((cam, index) => (
                      <StyledTreeItem key={cam.id} nodeId={cam.id} labelText={cam.name} labelIcon='tabler:camera' />
                    ))}
                  </TreeView>
                </Box>
              </CardContent>
            </Card>
          )}
        </div>

        <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
          <IndoorMap cameraGroup={cameraGroup} />
        </div>
      </div>
    </>
  )
}

export default DigitalMap
