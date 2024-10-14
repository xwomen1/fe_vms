"use client";

import { TreeItem, TreeView } from "@mui/lab"
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, List, styled, Typography } from "@mui/material"
import { use, useEffect, useState } from "react"
import Icon from 'src/@core/components/icon'
import { callApi } from "src/@core/utils/requestUltils"
import CustomTextField from "src/@core/components/mui/text-field"
import IndoorMap from "./indoor-map"
import toast from "react-hot-toast"
import Option from "../popups/option";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
        backgroundColor: theme.palette.action.hover
    },
    '& .MuiTreeItem-content': {
        paddingRight: theme.spacing(3),
        borderTopRightRadius: theme.spacing(4),
        borderBottomRightRadius: theme.spacing(4),
        fontWeight: theme.typography.fontWeightMedium
    },
    '& .MuiTreeItem-label': {
        fontWeight: 'inherit',
        paddingRight: theme.spacing(3)
    },
    '& .MuiTreeItem-group': {
        marginLeft: 0,
        '& .MuiTreeItem-content': {
            paddingLeft: theme.spacing(4),
            fontWeight: theme.typography.fontWeightRegular
        }
    }
}))

const StyledTreeItem = props => {
    // ** Props
    const { labelText, labelIcon, labelInfo, color, textDirection, disabled, ...other } = props

    return (
        <StyledTreeItemRoot
            {...other}
            label={
                <Box
                    sx={{
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': { mr: 1 },
                    }}>
                    <Icon icon={labelIcon} color={color} />
                    <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500, textDecoration: textDirection }}>
                        {labelText}
                    </Typography>
                    {labelInfo ? (
                        <Typography variant='caption' color='inherit'>
                            {labelInfo}
                        </Typography>
                    ) : null}
                </Box>
            }
        />
    )
}

const Map = () => {
    const [keyword, setKeyword] = useState('')
    const [cameraList, setCameraList] = useState([])
    const [cameraGroup, setCameraGroup] = useState([])
    const [idCameraSelected, setIdCameraSelected] = useState(null)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
    const [camerasSelected, serCamerasSelected] = useState([])
    const [areaGroup, setAreaGroup] = useState([])

    const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
    const [eventsData, setEventData] = useState([])
    const [websocket, setWebsocket] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [imgMapURL, setImgMapURL] = useState(null)

    const configWs = {
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
        ]
    }

    // create WebSocket connection
    const createWsConnection = () => {
        const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/cameraStatus/${clientId}`)

        setWebsocket(ws)

        //create RTCPeerConnection 
        const pc = new RTCPeerConnection(configWs)
        setRtcPeerConnection(pc)

        //listen for remote tracks and add them to remote stream

        pc.ontrack = (event) => {
            const stream = event.streams[0]
            if (
                !remoteVideoRef.current?.srcObject ||
                remoteVideoRef.current?.srcObject.id !== stream.id
            ) {
                setRemoteStream(stream)
                remoteVideoRef.current.srcObject = stream
            }
        }

        // close Websocket and RTCPeerConnection on component unmount

        return () => {
            if (websocket) {
                websocket.close()
            }
            if (rtcPeerConnection) {
                rtcPeerConnection.close()
            }
        }
    }

    const handleMessage = async (event) => {
        const message = JSON.parse(event.data)
        const newMessage = JSON.parse(message?.data)
        setEventData(newMessage)
    }

    const handleClose = async (event) => {
        if (websocket) {
            websocket.close()
        }
    }

    useEffect(() => {
        const cleanup = createWsConnection()

        return cleanup
    }, [])

    useEffect(() => {
        if (websocket) {
            websocket.addEventListener('open', (event) => { })

            websocket.addEventListener('message', handleMessage)

            websocket.addEventListener('error', (error) => {
                console.error('WebSocket error: ', error)
            })

            websocket.addEventListener('close', handleClose)
        }
    }, [websocket])

    useEffect(() => {
        fetchCameraList()
    }, [keyword])

    useEffect(() => {

        const addStatusToCameras = (data) => {

            return data.map(group => {
                if (group?.cameras && group?.cameras.length > 0) {

                    return {
                        ...group,
                        cameras: group?.cameras.map(camera => {
                            const matchedEvent = eventsData.find(event => event.id === camera.id)

                            return {
                                ...camera,
                                status: matchedEvent?.status ? matchedEvent?.status : false
                            }
                        }
                        )
                    }
                }

                return group;
            })
        }

        const data = addStatusToCameras(cameraList)
        setCameraGroup(data)
    }, [cameraList]);

    useEffect(() => {
        fetchAreaGroup()
    }, [])


    useEffect(() => {
        const addStatus = (data) => {

            return data.map(group => {
                if (group?.cameras && group?.cameras.length > 0) {

                    return {
                        ...group,
                        cameras: group?.cameras.map(camera => {
                            const matchedEvent = eventsData.find(event => event.id === camera.id)

                            return {
                                ...camera,
                                status:
                                    matchedEvent?.status === camera?.status && matchedEvent?.status !== undefined ? camera?.status
                                        : matchedEvent?.status !== camera?.status && matchedEvent?.status !== undefined ? matchedEvent?.status
                                            : matchedEvent?.status !== camera?.status && matchedEvent?.status === undefined ? camera?.status
                                                : false
                            }
                        }
                        )
                    }
                }

                return group;
            })
        }
        const data = addStatus(cameraGroup)
        setCameraGroup(data)
    }, [eventsData]);

    useEffect(() => {
        if (camera?.id !== '') {
            handleAddCamerasSelected(camera)
        }
    }, [camera])

    const fetchCameraList = async () => {
        try {
            const res = await callApi(
                `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keyword}&limit=25&page=1`)
            if (Array.isArray(res?.data)) {
                setCameraList(res?.data)
            } else {
                setCameraList([])
            }

        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        }
    }


    const fetchAreaGroup = async () => {
        try {
            const res = await callApi(
                `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=1b038831-3283-40f0-9a4f-7ca2f8d17862`)
            if (Array.isArray(res?.data)) {
                setAreaGroup(res?.data)
            } else {
                setAreaGroup([])
            }

        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        }
    }

    const fetchDigitalMap = async areaCode => {
        try {
            const res = await callApi(
                `https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps/get-by-area-code?areaCode=${areaCode}`)
            const imgMapURL = res.data?.img
            if (imgMapURL !== "") {
                setImgMapURL(imgMapURL)
            }

        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        }
    }

    const handleSetCamera = (camera) => {
        setCamera({ id: camera.id, name: camera.deviceName, channel: 'Sub' })
        setIdCameraSelected(camera.id)
    }

    const handleAddCamerasSelected = camera => {
        let list = [...camerasSelected]
        const result = list.find(element => element?.id === camera?.id);

        if (result === undefined) {
            list.push({
                ...camera,
                x: null,
                y: null,
                type: 'camera'
            })

        }
        serCamerasSelected(list)
    }

    const handleDelCamerasSelected = camera => {
        let list = [...camerasSelected]
        let isCameraId = list.includes(camera)

        if (isCameraId) {
            const result = list.filter(element => element?.id !== camera?.id);

            serCamerasSelected(result)
        }
    }

    const handleSetPositionCamerasSelected = cameras => {
        console.log('cameras', cameras);

        if (cameras?.length > 0) {
            serCamerasSelected(cameras)
        }
    }

    const handleSetImageMap = map => {
        fetchDigitalMap(map?.code)
    }

    return (
        <>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
                    <IndoorMap imgURL={imgMapURL} cameraGroup={camerasSelected} setCamerasSelected={handleSetPositionCamerasSelected} />
                </div>
                <Option
                    setKeyword={setKeyword}
                    setCamera={handleSetCamera}
                    setDelCameraSelected={handleDelCamerasSelected}
                    setMap={handleSetImageMap}
                    cameraGroup={cameraGroup}
                    areaGroup={areaGroup}
                    camerasSelected={camerasSelected}
                />
            </div>
        </>
    )
}

export default Map