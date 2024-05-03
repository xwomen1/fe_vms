import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'

const config = {
    bundlePolicy: 'max-bundle',
    iceServers: [
        {
            urls: 'stun:dev-ivis-camera-api.basesystem.one:3478',
        },
        {
            urls: 'turn:dev-ivis-camera-api.basesystem.one:3478',
            username: 'demo',
            credential: 'demo',
        },
    ],
}

export const ViewCamera = ({ id, channel }) => {
    const [websocket, setWebsocket] = useState(null)
    const [text, setText] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [loading, setLoading] = useState(false)
    const remoteVideoRef = useRef(null)
    function randomId(length) {
        const characters =
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

        const pickRandom = () =>
            characters.charAt(Math.floor(Math.random() * characters.length))

        return [...Array(length)].map(pickRandom).join('')
    }
    const SOCKET_LIVE_VIEW = `wss://sbs.basesystem.one`

    const createWsConnection = () => {
        const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)

        setWebsocket(ws)
        const pc = new RTCPeerConnection(config)
        setRtcPeerConnection(pc)

        // listen for remote tracks and add them to remote stream
        pc.ontrack = (event) => {
            setLoading(false)
            const stream = event.streams[0]
            if (
                !remoteVideoRef.current?.srcObject ||
                remoteVideoRef.current?.srcObject.id !== stream.id
            ) {
                setRemoteStream(stream)
                remoteVideoRef.current.srcObject = stream
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
    }, [])

    // send message to WebSocket server
    const sendMessage = (message) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message))
        }
    }

    // handle WebSocket message
    const handleMessage = async (event) => {
        const message = JSON.parse(event.data)

        // handle message based on its type
        switch (message.type) {
            // handle offer message
            case 'offer':
                rtcPeerConnection.setRemoteDescription(message).then(async () => {
                    rtcPeerConnection.setLocalDescription(
                        rtcPeerConnection.createAnswer(),
                    )

                    // Waiting for iceGathering completed
                    await new Promise((resolve) => {
                        if (rtcPeerConnection.iceGatheringState === 'complete') {
                            resolve()
                        } else {
                            rtcPeerConnection.addEventListener(
                                'icegatheringstatechange',
                                () => {
                                    if (rtcPeerConnection.iceGatheringState === 'complete') {
                                        resolve()
                                    }
                                },
                            )
                        }
                    })

                    sendMessage({
                        id: id,
                        type: 'answer',
                        channel: channel,
                        sdp: rtcPeerConnection?.localDescription.sdp,
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
                        type: 'request',
                    }),
                )
            })
            websocket.addEventListener('message', handleMessage)
            websocket.addEventListener('close', () => {
                // console.log('WebSocket connection closed') 
            })
            websocket.addEventListener('error', (error) => {
                console.error('WebSocket error:', error)
            })
        }
    }, [websocket, channel])

    // set up RTCPeerConnection event listeners
    useEffect(() => {
        if (rtcPeerConnection) {
            rtcPeerConnection.addEventListener('connectionstatechange', () => {
                // console.log(
                //   'RTCPeerConnection state:',
                //   rtcPeerConnection.connectionState,
                // ) 
            })
        }
    }, [rtcPeerConnection])

    // render local and remote video streams
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* <video muted playsInline autoPlay srcObject={localStream} /> */}
            <video
                style={{ width: '100%', height: '100%' }}
                ref={remoteVideoRef}
                playsInline
                autoPlay
                srcObject={remoteStream}
            />
            {loading && <h4 style={{ textAlign: 'center', marginTop: '-2rem' }}>{text} ...</h4>}
        </div>
    )
}

export default ViewCamera 
