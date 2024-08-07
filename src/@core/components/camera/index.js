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
  const [websocketStatus, setWebsocketStatus] = useState(true)
  const [rtcPeerStatus, setRtcPeerStatus] = useState(false)

  const [heightDiv, setHeightDiv] = useState(100)
  const [status, setStatus] = useState('')
  const [reload, setReload] = useState(0)
  const [videoDimensions, setVideoDimensions] = useState({ width: '100%', height: null })
  const intervalRef = useRef(null);

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
  function delay(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  }

  const createWsConnection = async () => {
    // console.log('Creating new WebSocket and RTCPeerConnection at:', new Date().toLocaleTimeString())

    const pc = new RTCPeerConnection(config)

    pc.ontrack = event => {
      // console.log('RTCPeerConnection track event at:', new Date().toLocaleTimeString())
      setLoading(false)
      const stream = event.streams[0]
      setRemoteStream(stream)
      remoteVideoRef.current.srcObject = stream
    }

    pc.oniceconnectionstatechange = event => {
      // console.log(
      //   'RTCPeerConnection ICE connection state change at:',
      //   new Date().toLocaleTimeString(),
      //   'New state:',
      //   pc.iceConnectionState
      // )
    }

    pc.onconnectionstatechange = event => {
      // console.log(
      //   'RTCPeerConnection connection state change at:',
      //   new Date().toLocaleTimeString(),
      //   'New state:',
      //   pc.connectionState
      // )
      setStatus(pc.connectionState)
    }

    setRtcPeerConnection(pc)

    const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

    setWebsocket(ws)
    await delay(500)
  }

  useEffect(() => {
    if (!websocketStatus) {
      if (websocket) {
        websocket.close()
        setWebsocket(null)
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
        setRtcPeerConnection(null)
      }
      createWsConnection()
    }
  }, [websocketStatus])

  useEffect(() => {
    console.log('websocket', websocket);
    console.log('rtcPeerConnection', rtcPeerConnection);
    console.log('websocketStatus', websocketStatus);

    if (rtcPeerConnection != null && websocketStatus && websocket !== null) {
      if (websocket.readyState === WebSocket.OPEN) {
        console.log('Sending message at:', new Date().toLocaleTimeString(), 'Message:', {
          id: id,
          type: 'request',
          channel: channel
        })
        websocket.send(
          JSON.stringify({
            id: id,
            type: 'request',
            channel: channel
          })
        )
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          websocket.readyState,
          'at:',
          new Date().toLocaleTimeString()
        )
      }
    }
  }, [rtcPeerConnection, websocketStatus, websocket])

  useEffect(() => {
    if (websocket !== null) {
      websocket.addEventListener('open', () => {
        setWebsocketStatus(true)
        console.log('WebSocket connection established at:', new Date().toLocaleTimeString())
      })
      websocket.addEventListener('message', handleMessage)
      websocket.addEventListener('close', () => {
        setWebsocketStatus(false)
        console.log('WebSocket connection closed at:', new Date().toLocaleTimeString())
      })
      websocket.addEventListener('error', error => {
        console.error('WebSocket error at:', new Date().toLocaleTimeString(), error)
      })
    }
  }, [websocket])

  useEffect(() => {
    setWebsocketStatus(false)
  }, [id, channel])

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

  useEffect(() => {
    const checkStatus = () => {
      if (status === 'disconnected' || status === 'failed' || status === '') {
        console.log('Status is', status, 'at:', new Date().toLocaleTimeString());

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          console.log('Recreating WebSocket connection due to status:', status, 'at:', new Date().toLocaleTimeString());
          setRtcPeerConnection(null)
          setWebsocketStatus(false)
          setWebsocket(null)
          createWsConnection();
        }, 5000);
      } else {
        console.log('Status is connected, no need to retry at:', new Date().toLocaleTimeString());

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    checkStatus();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  useEffect(() => {
    if (rtcPeerConnection) {
      rtcPeerConnection.addEventListener('connectionstatechange', () => {
        // console.log(
        //   'RTCPeerConnection state change at:',
        //   new Date().toLocaleTimeString(),
        //   'New state:',
        //   rtcPeerConnection.connectionState
        // )
        setStatus(rtcPeerConnection.connectionState)
      })
      rtcPeerConnection.addEventListener('iceconnectionstatechange', () => {
        // console.log(
        //   'RTCPeerConnection ICE state change at:',
        //   new Date().toLocaleTimeString(),
        //   'New ICE state:',
        //   rtcPeerConnection.iceConnectionState
        // )
      })
    }
  }, [rtcPeerConnection])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%' }}>
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
      </div>
    </div>
  )
}

export default ViewCamera
