import { useState, useEffect } from 'react'
import MuiTabList from '@mui/lab/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Grid, Tab, styled } from '@mui/material'
import EventCar from './view/eventCar'
import EventFace from './view/eventFace'
import EventList from './view/eventList'
import EventConfig from './view/eventConfig'
import EventMap from './view/eventMap'

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

const Events = () => {
  const [value, setValue] = useState('1')
  const [isDetectCrowdEnabled, setIsDetectCrowdEnabled] = useState(false)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [websocket, setWebsocket] = useState(null)
  const [eventData, setEventData] = useState(null)
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'

  const handleChange = (event, newValue) => {
    if (newValue === '4' && !isDetectCrowdEnabled) {
      return
    }
    setValue(newValue)
  }

  const config = {
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

  useEffect(() => {
    // create WebSocket connection

    const ws = new WebSocket(
      `wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/list_ai_event/be571c00-41cf-4878-a1de-b782625da62a`
    )

    setWebsocket(ws)

    // create RTCPeerConnection

    const pc = new RTCPeerConnection(config)
    setRtcPeerConnection(pc)

    // listen for remote tracks and add them to remote stream

    pc.ontrack = event => {
      const stream = event.streams[0]
      if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
        setRemoteStream(stream)
        remoteVideoRef.current.srcObject = stream
      }
    }

    // close WebSocket and RTCPeerConnection on component unmount

    return () => {
      if (websocket) {
        websocket.close()
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
      }
    }
  }, [])

  const handleMessage = async event => {
    const message = JSON.parse(event.data)
    const newMessage = JSON.parse(message?.data)
    setEventData(newMessage)
  }

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('open', () => {
        websocket.send(
          JSON.stringify({
            id: defaultCameraID,
            type: 'request'
          })
        )
      })
      websocket.addEventListener('message', handleMessage)

      websocket.addEventListener('error', error => {
        console.error('WebSocket error:', error)
      })

      websocket.addEventListener('close', handleClose)
    }
  }, [websocket])

  const handleClose = async event => {
    if (websocket) {
      websocket.close()
    }
  }

  useEffect(() => {
    if (rtcPeerConnection) {
      rtcPeerConnection.addEventListener('connectionstatechange', () => {})
    }
  }, [rtcPeerConnection])

  return (
    <div>
      <Grid container spacing={0} style={{ marginTop: 10 }}>
        <TabContext value={value}>
          <Grid item xs={12}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Danh sách' key={1} />
              <Tab value='2' label='Khuôn mặt' key={2} />
              <Tab value='3' label='Biển số' key={3} />
              <Tab value='4' label='Phát hiện đám đông' key={4} disabled={!isDetectCrowdEnabled} />
              <Tab value='5' label='Map' key={5} />
            </TabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value='1'>
              <EventList eventData={eventData} />
            </TabPanel>
            <TabPanel value='2'>
              <EventFace eventData={eventData} />
            </TabPanel>
            <TabPanel value='3'>
              <EventCar eventData={eventData} />
            </TabPanel>
            <TabPanel value='5'>
              <EventMap />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </div>
  )
}

export default Events
