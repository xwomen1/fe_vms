import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import Button from '@mui/material/Button'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { connect } from 'react-redux'

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
  const [text, setText] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const remoteVideoRef = useRef(null)
  const [heightDiv, setHeightDiv] = useState(100)
  const [status, setStatus] = useState('')
  const [reload, setReload] = useState(0)
  const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: null })

  useEffect(() => {
    const heightCaculator = Math.floor((window.innerHeight - 90) / sizeScreen.split('x')[1])
    setHeightDiv(heightCaculator)
    window.addEventListener('resize', () => {
      setHeightDiv(heightCaculator)
    })
  }, [sizeScreen])

  function randomId(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    const pickRandom = () => characters.charAt(Math.floor(Math.random() * characters.length))

    return [...Array(length)].map(pickRandom).join('')
  }
  const SOCKET_LIVE_VIEW = process.env.NEXT_PUBLIC_SOCKET_CCTT

  const createWsConnection = () => {
    const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)
    console.log('createWsConnection', ws)
    setWebsocket(ws)
    const pc = new RTCPeerConnection(config)
    setRtcPeerConnection(pc)

    // listen for remote tracks and add them to remote stream
    pc.ontrack = event => {
      setLoading(false)
      const stream = event.streams[0]
      try {
        if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
          setRemoteStream(stream)
          remoteVideoRef.current.srcObject = stream
        }
      } catch (err) {
        console.log(err)
      }
    }
    pc.oniceconnectionstatechange = event => {
      console.log('ICE connection state change:', pc.iceConnectionState)
      if (pc.iceConnectionState === 'closed' || pc.iceConnectionState === 'failed') {
        // Handle connection closed or failed
      }
    }

    // Close the RTCPeerConnection
    // pc.close()
  }

  const connectWebSocket = () => {
    createWsConnection()

    if (websocket) {
      websocket.close()
      setWebsocket(null) // Clear websocket reference
    }
    if (rtcPeerConnection) {
      rtcPeerConnection.close()
      setRtcPeerConnection(null) // Clear rtcPeerConnection reference
    }
  }
  useEffect(() => {
    if (websocket && channel) {
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
        setRtcPeerConnection(null) // Clear rtcPeerConnection reference
      }
    }
  }, [id, channel])

  useEffect(() => {
    connectWebSocket()
  }, [])

  // send message to WebSocket server
  const sendMessage = message => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message))
    }
  }

  // handle WebSocket message
  const handleMessage = async event => {
    const message = JSON.parse(event.data)

    // handle message based on its type
    switch (message.type) {
      // handle offer message
      case 'offer':
        rtcPeerConnection.setRemoteDescription(message).then(async () => {
          rtcPeerConnection.setLocalDescription(rtcPeerConnection.createAnswer())

          // Waiting for iceGathering completed
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

          sendMessage({
            id: id,
            type: 'answer',
            channel: channel,
            sdp: rtcPeerConnection?.localDescription.sdp
          })
        })

        break
      case 'status':
        break
      default:
        break
    }
    setText(message?.content)
  }

  // set up WebSocket event listeners
  useEffect(() => {
    if (websocket) {
      setLoading(true)
      websocket.addEventListener('open', () => {
        // console.log('WebSocket connection established')
        websocket.send(
          JSON.stringify({
            id: id,
            type: 'request'
          })
        )
      })
      websocket.addEventListener('message', handleMessage)
      websocket.addEventListener('close', () => {
        // console.log('WebSocket connection closed')
      })
      websocket.addEventListener('error', error => {
        console.error('WebSocket error:', error)
      })
    }
  }, [websocket, channel])

  // set up RTCPeerConnection event listeners
  useEffect(() => {
    if (rtcPeerConnection) {
      rtcPeerConnection.addEventListener('connectionstatechange', () => {
        console.log('RTCPeerConnection state:', rtcPeerConnection.connectionState)
        setStatus(rtcPeerConnection.connectionState)
      })
    }
  }, [rtcPeerConnection])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%' }}>
      <div className='portlet-title'>
        <div className='caption'>
          <span className='label label-sm bg-red'> {status ? status.toUpperCase() : 'LIVE'}</span>
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
        {(status === 'failed' || status == 'disconnected') && (
          <IconButton
            sx={{
              left: '30%',
              top: '50%',
              position: 'absolute',
              color: '#efefef',
              transform: 'translateY(-50%)'
            }}
            onClick={() => connectWebSocket()}
          >
            <Icon icon='tabler:reload' fontSize={30} />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default ViewCamera
