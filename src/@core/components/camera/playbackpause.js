import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import Button from '@mui/material/Button'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { convertDateToString } from 'src/@core/utils/format'
import { PlayArrow } from '@material-ui/icons'

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

export const ViewCameraPause = ({
  id,
  name,
  channel,
  sizeScreen,
  handSetChanel,
  startTime,
  endTime,
  play,
  onChangeCurrentTime,
  duration,
  onChangeDuration,
  volume
}) => {
  const [websocket, setWebsocket] = useState(null)
  const [text, setText] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const remoteVideoRef = useRef(null)
  const [heightDiv, setHeightDiv] = useState(100)
  const [status, setStatus] = useState('')
  const [reload, setReload] = useState(0)
  const [selectedChannel, setSelectedChannel] = useState('Sub')

  useEffect(() => {
    const heightCaculator = Math.floor((window.innerHeight - 192) / sizeScreen.split('x')[1])
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

  const handlePlayPause = () => {
    if (remoteVideoRef.current) {
      if (play) {
        remoteVideoRef.current.play().catch(error => console.error('Error playing video:', error))
      } else {
        remoteVideoRef.current.pause()
      }
    }
  }

  useEffect(() => {
    handlePlayPause(play)
  }, [play])

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = volume / 100
    }
  }, [volume])

  const SOCKET_LIVE_VIEW = process.env.NEXT_PUBLIC_SOCKET_CCTT

  const createWsConnection = () => {
    const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

    setWebsocket(ws)
    const pc = new RTCPeerConnection(config)
    setRtcPeerConnection(pc)
    pc.ontrack = event => {
      setLoading(false)
      const stream = event.streams[0]
      try {
        if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
          setRemoteStream(stream)
          remoteVideoRef.current.srcObject = stream
          remoteVideoRef.current.ontimeupdate = () => {
            if (remoteVideoRef?.current?.currentTime) {
              onChangeCurrentTime(remoteVideoRef?.current?.currentTime)
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    if (rtcPeerConnection) {
      // listen for remote tracks and add them to remote stream

      rtcPeerConnection.addEventListener('connectionstatechange', () => {
        // console.log('RTCPeerConnection state:', rtcPeerConnection.connectionState)
        setStatus(rtcPeerConnection.connectionState)
      })
    }
  }, [rtcPeerConnection])

  // useEffect(() => {
  //   if (websocket) {
  //     websocket.close()
  //     createWsConnection()
  //   }
  // }, [startTime])

  useEffect(() => {
    createWsConnection()

    return () => {
      if (websocket) {
        websocket.close()
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.close()
      }
    }
  }, [id])

  // useEffect(() => {
  //   createWsConnection()

  //   return () => {
  //     if (websocket) {
  //       websocket.close()
  //     }
  //     if (rtcPeerConnection) {
  //       rtcPeerConnection.close()
  //     }
  //   }
  // }, [reload])

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

    // console.log('message', message)
  }

  // set up WebSocket event listeners
  useEffect(() => {
    if (websocket) {
      setLoading(true)
      websocket.addEventListener('open', () => {
        websocket.send(
          JSON.stringify({
            id: id,
            type: 'request',
            viewType: 'playback',
            startTime: convertDateToString(startTime),
            endTime: convertDateToString(endTime)
          })
        )
      })
      websocket.addEventListener('message', handleMessage)
      websocket.addEventListener('close', () => {
        console.log('WebSocket connection closed')
      })
      websocket.addEventListener('error', error => {
        console.error('WebSocket error:', error)
      })
    }
  }, [websocket])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%' }}>
      <div className='portlet-title'>
        <div className='caption'>
          <span className='label label-sm'
            style={{ backgroundColor: status === 'connected' ? 'green' : 'red', color: 'white' }}>
            {status ? status.toUpperCase() : 'PLAYBACK'}
          </span>
          <span className='caption-subject font-dark sbold uppercase'>{name}</span>
        </div>
        <div className='media-top-controls'>
          <div>
            <Button
              sx={{
                backgroundColor: selectedChannel === 'Sub' ? '#fff' : 'default',
                height: '20px',
                color: selectedChannel === 'Sub' ? '#FF2C00' : 'default',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: '#FF2C00'
                }
              }}
             onClick={() => {
                handSetChanel(id, 'Sub')
                setSelectedChannel('Sub')

                // createWsConnection()
              }}
            >
              SD
            </Button>
            <Button
              sx={{
                backgroundColor: selectedChannel === 'Main' ? '#fff' : 'default',
                height: '15px',
                color: selectedChannel === 'Main' ? '#FF2C00' : 'default',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: '#FF2C00'
                }
              }}
              onClick={() => {
                handSetChanel(id, 'Main')
                setSelectedChannel('Main')

                // createWsConnection()
              }}
            >
              HD
            </Button>
          </div>
        </div>
      </div>
      <div>
        <video
          style={{ width: '100%', height: heightDiv - 26 }}
          ref={remoteVideoRef}
          playsInline
          autoPlay
          srcObject={remoteStream}
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
            onClick={() => setReload(reload + 1)}
          >
            <Icon icon='tabler:reload' fontSize={30} />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default ViewCameraPause
