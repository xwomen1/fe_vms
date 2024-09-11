import { fa } from "@faker-js/faker"
import { Box, Button, Card, CircularProgress, Dialog, DialogContent, Fade, IconButton, styled } from "@mui/material"
import { right } from "@popperjs/core"
import { forwardRef, useEffect, useRef, useState } from "react"
import ViewCamera from "src/@core/components/camera"
import Icon from "src/@core/components/icon"

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))

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

const LiveView = ({ show, onClose, data }) => {
    const [loading, setLoading] = useState(true)
    const remoteVideoRef = useRef(null)
    const [status, setStatus] = useState('')
    const [reload, setReload] = useState(0)
    const [websocket, setWebsocket] = useState(null)
    const [text, setText] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [websocketStatus, setWebsocketStatus] = useState(true)
    const [closed, setClosed] = useState(false)
    const [id, setId] = useState(data.id)
    const [name, setName] = useState(data.name)
    const [channel, setChannel] = useState('Sub')
    const [isFullScreen, setIsFullScreen] = useState(false)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // useEffect(() => {
    //     const heightCaculator = Math.floor((window.innerHeight - 90) / sizeScreen.split('x')[1])
    //     setHeightDiv(heightCaculator)
    //     window.addEventListener('resize', () => {
    //         setHeightDiv(heightCaculator)
    //     })
    // }, [sizeScreen])

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
        console.log('Creating new WebSocket and RTCPeerConnection at:', new Date().toLocaleTimeString())

        const pc = new RTCPeerConnection(config)

        pc.ontrack = event => {
            // console.log('RTCPeerConnection track event at:', new Date().toLocaleTimeString())
            setLoading(false)
            const stream = event.streams[0]
            setRemoteStream(stream)
            remoteVideoRef.current.srcObject = stream
        }

        pc.oniceconnectionstatechange = event => {
            console.log(
                'RTCPeerConnection ICE connection state change at:',
                new Date().toLocaleTimeString(),
                'New state:',
                pc.iceConnectionState
            )
        }

        pc.onconnectionstatechange = event => {
            console.log(
                'RTCPeerConnection connection state change at:',
                new Date().toLocaleTimeString(),
                'New state:',
                pc.connectionState
            )
            setStatus(pc.connectionState)
        }

        setRtcPeerConnection(pc)

        const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

        setWebsocket(ws)
        await delay(500)
        setLoading(false)
    }

    // useEffect(() => {
    //   if (!websocketStatus) {
    //     if (websocket) {
    //       websocket.close()
    //       setWebsocket(null)
    //     }
    //     if (rtcPeerConnection) {
    //       rtcPeerConnection.close()
    //       setRtcPeerConnection(null)
    //     }
    //     createWsConnection()
    //   }
    // }, [websocketStatus])

    useEffect(() => {
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
            setLoading(true)
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
        // setLoading(false)
    }, [websocket])

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
        setLoading(false)
    }

    useEffect(() => {
        setWebsocketStatus(false)
    }, [id, channel])

    useEffect(() => {
        if (websocket) {
            websocket.close()
            setWebsocket(null)
        }
        if (rtcPeerConnection) {
            rtcPeerConnection.close()
            setRtcPeerConnection(null)
        }

        setWebsocketStatus(false)
        setLoading(true)
        createWsConnection()

    }, [reload, id, channel])

    useEffect(() => {
        if (closed === true) {
            onClose()

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

    const handSetChanel = (id, channel) => {
        setId(id)
        setChannel(channel)
    }

    const toggleFullScreen = () => {
        setIsFullScreen((prevFullScreen) => !prevFullScreen);
    };

    useEffect(() => {
        console.log('Viewport Width:', viewportWidth);
        console.log('Viewport Height:', viewportHeight);
    }, [viewportWidth, viewportHeight])

    return (
        <Card>
            <Dialog
                fullWidth
                fullScreen={isFullScreen}
                open={show}
                maxWidth='lg'
                scroll='body'
                TransitionComponent={Transition}
                onClose={() => setClosed(true)}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                {/* <CustomCloseButton
                    onClick={() => setClosed(true)}
                >
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton> */}

                <div className='portlet portlet-video live' style={{ width: '100%', height: '100%' }}>
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: isFullScreen ? viewportWidth : '100%', height: isFullScreen ? viewportHeight : '100%' }}>
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
                                        width: isFullScreen ? viewportWidth : '100%',
                                        height: isFullScreen ? viewportHeight - 26 : '100%',
                                        objectFit: 'fill',
                                        paddingBottom: 38
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
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                    }}
                                    onClick={toggleFullScreen}
                                >
                                    {isFullScreen ? <Icon icon="tabler:minimize" style={{ color: 'white' }} />
                                        : <Icon icon="tabler:border-corners" style={{ color: 'white' }} />}
                                </IconButton>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </Card>
    )
}

export default LiveView