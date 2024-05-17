import { AddBox, CameraAlt, FastForward, FastRewind, IndeterminateCheckBox, Pause, PlayArrow, SkipNext, SkipPrevious, Try } from "@mui/icons-material"
import { Box, Button, Grid, IconButton, Slider, Tooltip, Typography } from "@mui/material"
import { format } from "date-fns"
import React, { useState, useRef, useEffect } from "react"
import CustomAvatar from 'src/@core/components/mui/avatar'
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

const Review = ({ data, channel, id }) => {
    const [websocket, setWebsocket] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const remoteVideoRef = useRef(null)
    const [reload, setReload] = useState(0)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState(null)
    const [status, setStatus] = useState('')

    const [zoom, setZoom] = useState(100)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [startDate, setStartDate] = useState(new Date(new Date() - 100 * 60 * 1000))

    const marks = createSilder(startDate)

    // call review stream video cam 
    function randomId(length) {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

        const pickRandom = () => characters.charAt(Math.floor(Math.random() * characters.length))

        return [...Array(length)].map(pickRandom).join('')
    }
    const SOCKET_LIVE_VIEW = process.env.NEXT_PUBLIC_SOCKET_CCTT

    const createWsConnection = () => {
        const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

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
    }
    useEffect(() => {
        if (websocket && channel) {
            websocket.close()
            createWsConnection()
        }
    }, [id, channel])

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
    }, [reload])

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

    const handlePlayClick = () => {
        setIsPlaying(!isPlaying)
    }

    const handleSliderChange = (event, newValue) => {
        setProgress(newValue)
    }

    const valueLabelFormat = value => {
        return format(new Date(startDate.getTime() + (value / 100) * zoom * 60 * 1000), 'HH:mm:ss')
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ width: '100%', height: '30vh' }}>
                            <Typography sx={{ mb: 1 }}>Đối tượng</Typography>
                            <CustomAvatar
                                src={data.imageObject}
                                variant='rounded'
                                alt={'Đối tượng'}
                                sx={{ width: '50%', height: 'auto', mb: 4 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ width: '100%', height: '30vh' }}>
                            <Typography sx={{ mb: 1 }}>Ảnh đối tượng</Typography>
                            <CustomAvatar
                                src={data.imageObject}
                                variant='rounded'
                                alt={'Ảnh đối tượng'}
                                sx={{ width: '50%', height: 'auto', mb: 4 }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
                <div className='portlet portlet-video live' style={{ width: '100%' }}>
                    <div className='portlet-title'>
                        <div className='caption'>
                            <span className='label label-sm bg-red'> {status ? status.toUpperCase() : 'LIVE'}</span>
                            <span className='caption-subject font-dark sbold uppercase'>{name}</span>
                        </div>
                        {/* <div className='media-top-controls'>
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
                        </div> */}
                    </div>
                    <div>
                        <video
                            style={{ width: '100%' }}
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
            </Grid>
        </Grid>
    )
}

export default Review