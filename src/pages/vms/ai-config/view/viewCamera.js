import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { CircularProgress } from '@mui/material'

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
    const [currentId, setCurrentID] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState(null) // Thêm trạng thái text
    const [currentChannel, setCurrentChannel] = useState(null) // Thêm trạng thái currentChannel
    const remoteVideoRef = useRef(null)

    const randomId = (length) => [...Array(length)].map(() => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 62)]).join('')
    const SOCKET_LIVE_VIEW = `wss://sbs.basesystem.one`

    const createWsConnection = () => {
        const ws = new WebSocket(`${SOCKET_LIVE_VIEW}/ivis/vms/api/v0/ws/signaling/${randomId(10)}`)
        setWebsocket(ws)
        const pc = new RTCPeerConnection(config)
        setRtcPeerConnection(pc)

        pc.ontrack = (event) => {
            setLoading(false)
            const stream = event.streams[0]
            if (!remoteVideoRef.current?.srcObject || remoteVideoRef.current?.srcObject.id !== stream.id) {
                setRemoteStream(stream)
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream
                }
            }
        }
    }

    useEffect(() => {
        if (websocket) {
            websocket.close()
            if (rtcPeerConnection) rtcPeerConnection.close()
            setCurrentID(id)
            setCurrentChannel(channel)
            createWsConnection()
        }
    }, [id, channel])

    useEffect(() => {
        createWsConnection()
        setCurrentID(id)
        setCurrentChannel(channel)

        return () => {
            if (websocket) websocket.close()
            if (rtcPeerConnection) rtcPeerConnection.close()
        }
    }, [])

    const sendMessage = (message) => { if (websocket && websocket.readyState === WebSocket.OPEN) websocket.send(JSON.stringify(message)) }

    const handleMessage = async (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'offer') {
            rtcPeerConnection.setRemoteDescription(message).then(async () => {
                rtcPeerConnection.setLocalDescription(rtcPeerConnection.createAnswer())

                await new Promise((resolve) => {
                    if (rtcPeerConnection.iceGatheringState === 'complete') resolve()
                    else rtcPeerConnection.addEventListener('icegatheringstatechange', () => { if (rtcPeerConnection.iceGatheringState === 'complete') resolve() })
                })

                sendMessage({ id: currentId, type: 'answer', channel: currentChannel, sdp: rtcPeerConnection?.localDescription.sdp })
            })
        }
        setText(message?.content)
    }

    useEffect(() => {
        if (websocket) {
            setLoading(true)
            websocket.addEventListener('open', () => { websocket.send(JSON.stringify({ id: currentId, type: 'request' })) })
            websocket.addEventListener('message', handleMessage)
            websocket.addEventListener('close', () => { })
            websocket.addEventListener('error', (error) => { console.error('WebSocket error:', error) })
        }
    }, [websocket, currentChannel])

    useEffect(() => {
        if (rtcPeerConnection) {
            rtcPeerConnection.addEventListener('connectionstatechange', () => { console.log('RTCPeerConnection state:', rtcPeerConnection.connectionState) })
        }
    }, [rtcPeerConnection])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <video style={{ width: '100%', height: '100%' }} ref={remoteVideoRef} playsInline autoPlay />
            {loading && <h4 style={{ textAlign: 'center', marginTop: '-2rem' }}>{text} ...</h4>}
        </div>
    )
}

export default ViewCamera
