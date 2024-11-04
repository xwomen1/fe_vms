import { Box, Button, CircularProgress, IconButton } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { convertDateToString } from "src/@core/utils/format"
import Icon from 'src/@core/components/icon'

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

const ViewCameraPause = ({ id, name, channel, sizeScreen, handSetChanel, startTime, endTime, play, onChangeCurrentTime, duration, onChangeDuration, volume, isFullScreen }) => {
  const [loading, setLoading] = useState(false)
  const [websocket, setWebsocket] = useState(null)
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const remoteVideoRef = useRef(null)
  const [status, setStatus] = useState('')
  const [heightDiv, setHeightDiv] = useState(100)
  const [reload, setReload] = useState(0)
  const [closed, setCLosed] = useState(false)
  const [websocketStatus, setWebsocketStatus] = useState(true)

  useEffect(() => {
    const heightCalculator = Math.floor((window.innerHeight - 192) / sizeScreen.split('x')[1])
    setHeightDiv(heightCalculator)
    window.addEventListener('resize', () => {
      setHeightDiv(heightCalculator)
    })
  }, [sizeScreen])

  function randomId(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    const pickRandom = () => characters.charAt(Math.floor(Math.random() * characters.length))

    return [...Array(length)].map(pickRandom).join('')
  }

  const SOCKET_PLAYBACK = process.env.NEXT_PUBLIC_SOCKET_CCTT

  function delay(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  }

  const createWsConnection = async () => {
    const pc = new RTCPeerConnection(config)
    pc.ontrack = event => {
      const stream = event.streams[0]
      try {
        setRemoteStream(stream)
        remoteVideoRef.current.srcObject = stream
        remoteVideoRef.current.ontimeupdate = () => {
          if (remoteVideoRef?.current?.currentTime) {
            onChangeCurrentTime(remoteVideoRef?.current?.currentTime)
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    pc.oniceconnectionstatechange = event => {
    }

    pc.onconnectionstatechange = event => {
      setStatus(pc.connectionState)
    }
    setRtcPeerConnection(pc)

    const ws = new WebSocket(`${SOCKET_PLAYBACK}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

    setWebsocket(ws)
    await delay(500)
    setLoading(false)

  }

  const closeConnections = () => {
    if (websocket) {
      websocket.close()
      setWebsocket(null)
    }
    if (rtcPeerConnection) {
      rtcPeerConnection.close()
      setRtcPeerConnection(null)
    }
  }
  useEffect(() => {
    setWebsocketStatus(false)
  }, [id, channel])


  useEffect(() => {
    if (rtcPeerConnection != null && websocketStatus && websocket !== null) {
      if (websocket.readyState === WebSocket.OPEN) {
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
    setLoading(false)

  }

  useEffect(() => {
    if (websocket) {
      setLoading(true)
      websocket.addEventListener('open', () => {
        setWebsocketStatus(true)
        websocket.send(
          JSON.stringify({
            id: id,
            type: 'request',
            viewType: 'playback',
            startTime: convertDateToString(startTime),
            endTime: convertDateToString(endTime),
            channel: channel
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

  useEffect(() => {

    if (websocket) {
      websocket.close()
      setWebsocket(null)
    }
    if (rtcPeerConnection) {
      rtcPeerConnection.close()
      setRtcPeerConnection(null)
    }
    createWsConnection()
  }, [reload, id, channel, startTime, endTime])

  useEffect(() => {
    if (closed === true) {

      return () => {
        if (websocket) {
          websocket.close()
          setWebsocket(null)
        }
        if (rtcPeerConnection) {
          rtcPeerConnection.close()
          setRtcPeerConnection(null)
        }
      }
    }

  }, [closed])

  useEffect(() => {
    setCLosed(true)
  }, [isFullScreen])

  // handle on change play, volume, startTime, endTime
  const handlePlayPause = () => {
    if (remoteVideoRef.current) {
      if (play) {
        const playPromise = remoteVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Lỗi khi phát video:', error);
          });
        }
      } else {
        remoteVideoRef.current.pause();
      }
    }
  };

  const handleSeekToTime = time => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.currentTime = time; // Tua tới thời gian đã nhập
      // onChangeCurrentTime(time);
    }
  };

  // // Hàm ghi log thời gian hiện tại
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (remoteVideoRef.current) {
  //       console.log("Current Time:", new Date(remoteVideoRef.current.currentTime));
  //     }
  //   }, 1000); // Ghi log mỗi giây

  //   return () => clearInterval(interval); // Dọn dẹp khi component unmount
  // }, []);

  useEffect(() => {
    handlePlayPause(play)
  }, [play])

  // useEffect(() => {
  //   handleSeekToTime(startTime)
  // }, [startTime])

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = volume / 100
    }
  }, [volume])

  return (
    <div className='portlet portlet-video live' style={{ width: '100%' }}>
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: heightDiv - 26
          }}
        >
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
                {status ? status.toUpperCase() : 'PLAYBACK'}
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
              style={{ width: '100%', height: heightDiv - 26, objectFit: 'fill' }}
              ref={remoteVideoRef}
              playsInline
              autoPlay
              srcObject={remoteStream}
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

export default ViewCameraPause