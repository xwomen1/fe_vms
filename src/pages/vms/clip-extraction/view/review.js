import { Box, Button, Card, Grid, IconButton } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

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

const Review = ({ id, name, channel }) => {
    const [camera, setCamera] = useState()
    const [channelCurrent, setChannelCurrent] = useState(channel)
    const [websocket, setWebsocket] = useState(null)
    const [text, setText] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [loading, setLoading] = useState(false)
    const remoteVideoRef = useRef(null)
    const [status, setStatus] = useState('')
    const [reload, setReload] = useState(0)
    const [selectTime, setSelectTime] = useState(null)
    const [dateTime, setDateTime] = useState(new Date())

    const time = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ]

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

    const handSetChanel = (channel) => {
        setChannelCurrent(channel)
    }

    const handleSetSelectedTime = (event) => {
        setSelectTime(event)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Card>
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
                                        onClick={() => handSetChanel('Sub')}
                                    >
                                        SD
                                    </Button>
                                    <Button
                                        className={`hd_btn btn btn-default btn-xs ${channel === 'Main' ? 'active' : ''}`}
                                        onClick={() => handSetChanel('Main')}
                                    >
                                        HD
                                    </Button>
                                </div>
                            </div>
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
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <DatePickerWrapper>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                            <div>
                                <DatePicker
                                    showTimeSelect
                                    timeFormat='HH:mm'
                                    selected={dateTime}
                                    id='date-time-picker'
                                    dateFormat='MM/dd/yyyy h:mm aa'
                                    onChange={date => setDateTime(date)}
                                    customInput={<CustomInput label='' />}
                                />
                            </div>
                        </Box>
                    </DatePickerWrapper>
                    <Grid container spacing={2} sx={{ padding: '5px' }}>
                        {time.map((item, index) => {
                            return (
                                <Grid item xs={3}>
                                    <Button
                                        variant={item === selectTime ? 'contained' : ''}
                                        color={item === selectTime ? 'primary' : 'secondary'}
                                        onClick={() => handleSetSelectedTime(item)}
                                    >
                                        {item}
                                    </Button>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Review