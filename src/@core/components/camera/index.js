import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { Box, CircularProgress } from '@mui/material'

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

export const ViewCamera = ({ id, name, channel, sizeScreen, handSetChanel }) => {
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const remoteVideoRef = useRef(null)
  const [websocketStatus, setWebsocketStatus] = useState(false)
  const [status, setStatus] = useState('')
  const [reload, setReload] = useState(0)
  const [heightDiv, setHeightDiv] = useState(100)

  useEffect(() => {
    const calculateHeight = () => {
      const heightCaculator = Math.floor((window.innerHeight - 90) / sizeScreen.split('x')[1])
      setHeightDiv(heightCaculator)
    }

    calculateHeight()
    window.addEventListener('resize', calculateHeight)

    return () => {
      window.removeEventListener('resize', calculateHeight)
    }
  }, [sizeScreen])

  const randomId = length => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    return [...Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
  }

  const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

  const createWsConnection = async () => {
    console.log('Creating WebSocket and RTCPeerConnection')

    const pc = new RTCPeerConnection(config)

    pc.ontrack = event => {
      setLoading(false)
      const stream = event.streams[0]
      setRemoteStream(stream)
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState)
    }

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      setStatus(pc.connectionState)
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setReload(prev => prev + 1)
      }
    }

    setRtcPeerConnection(pc)

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_CCTT}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)
    setWebsocket(ws)

    ws.addEventListener('open', () => {
      setWebsocketStatus(true)
      console.log('WebSocket connection established')
    })

    ws.addEventListener('message', () => {
      handleMessage
    })

    ws.addEventListener('close', () => {
      setWebsocketStatus(false)
      console.log('WebSocket connection closed')
    })

    ws.addEventListener('error', error => {
      console.error('WebSocket error:', error)
    })

    await delay(500)
  }

  useEffect(() => {
    if (!websocketStatus && rtcPeerConnection) {
      rtcPeerConnection.close()
      setRtcPeerConnection(null)
      setWebsocketStatus(false)
    }
    if (!websocket && !rtcPeerConnection) {
      createWsConnection()
    }
  }, [websocketStatus])

  useEffect(() => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          id,
          type: 'request',
          channel
        })
      )
    }
  }, [rtcPeerConnection, websocket])

  const handleMessage = async event => {
    const message = JSON.parse(event.data)

    switch (message.type) {
      case 'offer':
        await rtcPeerConnection.setRemoteDescription(message)
        const answer = await rtcPeerConnection.createAnswer()
        await rtcPeerConnection.setLocalDescription(answer)

        await new Promise(resolve => {
          if (rtcPeerConnection.iceGatheringState === 'complete') {
            resolve()
          } else {
            rtcPeerConnection.addEventListener('icegatheringstatechange', () => {
              if (rtcPeerConnection.iceGatheringState === 'complete') {
                resolve()
              }
            })
          }
        })

        websocket.send(
          JSON.stringify({
            id,
            type: 'answer',
            channel,
            sdp: rtcPeerConnection.localDescription.sdp
          })
        )
        break
      case 'status':
        break
      default:
        break
    }
  }

  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.removeEventListener('message', handleMessage)
        websocket.close()
        setWebsocket(null)
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
        setRtcPeerConnection(null)
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop())
        setRemoteStream(null)
      }
    }
  }, [websocket, rtcPeerConnection, remoteStream])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%' }}>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: heightDiv - 26 }}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      {!loading && (
        <div>
          <div className='portlet-title'>
            <div className='caption'>
              <span
                className='label label-sm'
                style={{ backgroundColor: status === 'connected' ? 'green' : 'red', color: 'white' }}
              >
                {status ? status.toUpperCase() : 'LIVE'}
              </span>
              <span className='caption-subject font-dark sbold uppercase'>{name}</span>
            </div>
            <div className='media-top-controls'>
              <div className='btn-group'>
                <Button
                  className={`sd_btn btn btn-default btn-xs ${channel === 'Sub' ? 'active' : ''}`}
                  onClick={() => handSetChanel(id, 'Sub')}
                >
                  SD
                </Button>
                <Button
                  className={`hd_btn btn btn-default btn-xs ${channel === 'Main' ? 'active' : ''}`}
                  onClick={() => handSetChanel(id, 'Main')}
                >
                  HD
                </Button>
              </div>
            </div>
          </div>
          <div>
            <video
              style={{
                width: '100%',
                height: heightDiv - 26,
                objectFit: 'fill'
              }}
              ref={remoteVideoRef}
              playsInline
              autoPlay
            />
            {(status === 'failed' || status === 'disconnected' || status === '') && (
              <IconButton
                sx={{
                  left: '50%',
                  top: '50%',
                  position: 'absolute',
                  color: '#efefef',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => setReload(reload + 1)}
              >
                <Icon icon='tabler:reload' fontSize={30} />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewCamera
