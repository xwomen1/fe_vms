"use client";

import { TreeItem, TreeView } from "@mui/lab"
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, List, styled, Typography } from "@mui/material"
import { use, useEffect, useState } from "react"
import Icon from 'src/@core/components/icon'
import { callApi, getApi, putApi } from "src/@core/utils/requestUltils"
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

const Map = () => {
    const [keyword, setKeyword] = useState('')
    const [keyword1, setKeyword1] = useState('')
    const [cameraList, setCameraList] = useState([])
    const [cameraGroup, setCameraGroup] = useState([])
    const [idCameraSelected, setIdCameraSelected] = useState(null)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
    const [camerasSelected, setCamerasSelected] = useState([])
    const [areaGroup, setAreaGroup] = useState([])

    const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
    const [eventsData, setEventData] = useState([])
    const [websocket, setWebsocket] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)
    const [imgMapURL, setImgMapURL] = useState(null)
    const [digitalMapId, setDigitalMapId] = useState(null)

    const [treeData, setTreeData] = useState([])
    const [expandedNodes, setExpandedNodes] = useState([])
    const [childData, setChildData] = useState([])
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(0)

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
        console.log('camerasSelected', camerasSelected);
        setReload(reload + 1)

    }, [camerasSelected])

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

    const handleSearch = e => {
        setKeyword(e)
    }

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
                `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/codeParent?codeParent=digitalmap`)
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
            const devices = res.data?.devices

            setDigitalMapId(res.data?.id)
            if (devices?.length > 0) {
                setCamerasSelected(devices)
            } else {
                setCamerasSelected([])
            }

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

    const fetchChildrenById = async parentId => {
        try {
            const res = await getApi(`https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/codeParent?codeParent=${parentId}`)
            setTreeData(prevTreeData => ({
                ...prevTreeData,
                [parentId]: res.data
            }))
        } catch (error) {
            console.error('Error fetching children:', error)

            return []
        }
    }

    const handleFetchChildren = nodeId => {

        // check nodeId have existed
        const isExpanded = expandedNodes.includes(nodeId)
        const childrenData = fetchChildrenById(nodeId)

        setTreeData(prevTreeData => ({
            ...prevTreeData,
            [nodeId]: childrenData
        }))

        if (isExpanded) {
            setExpandedNodes(expandedNodes.filter(id => id !== nodeId))
        } else {
            setExpandedNodes([...expandedNodes, nodeId])
        }
    }

    const handleUpdateDigitalMap = () => {
        const params = {
            devices: [...camerasSelected]
        }

        console.log('params', params);
        console.log('digitalMapId', digitalMapId);

        if (digitalMapId) {
            putApi(`https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps/${digitalMapId}`, { ...params })
                .then(() => {
                    toast.success('Data saved successfully')
                })
                .catch(error => {
                    if (error && error?.response?.data) {
                        console.error('error', error)
                        toast.error(error?.response?.data?.message)
                    } else {
                        console.error('Error fetching data:', error)
                        toast.error(error)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
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
        setCamerasSelected(list)
    }

    const handleDelCamerasSelected = camera => {
        let list = [...camerasSelected]
        let isCameraId = list.includes(camera)

        if (isCameraId) {
            const result = list.filter(element => element?.id !== camera?.id);

            setCamerasSelected(result)
        }
    }

    const handleSetPositionCamerasSelected = cameras => {
        console.log('cameras', cameras);
        setCamerasSelected(cameras)
    }

    const StyledTreeItem = props => {
        // ** Props
        const { labelText, labelIcon, labelInfo, color, textDirection, disabled, cameraSelected, camera, ...other } = props

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
                        {cameraSelected === true && (
                            <IconButton aria-label="delete" size="small" onClick={() => {
                                handleDelCamerasSelected(camera)
                            }}>
                                <Icon icon={"tabler:trash"} color={"secondary"} />
                            </IconButton>
                        )}
                    </Box>
                }
            />
        )
    }

    const renderTree = group => {

        return (
            <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
                {group.cameras && group.cameras.length > 0
                    ? group.cameras.map(camera => {

                        return (
                            <StyledTreeItem
                                key={camera.id}
                                nodeId={camera.id}
                                color={camera?.status == true ? '#28c76f' : ''}
                                labelText={camera.deviceName}
                                labelIcon='tabler:camera'
                                onClick={() => handleSetCamera(camera)}
                            />
                        )
                    })
                    : null}
            </StyledTreeItem>
        )
    }

    const fetchChildDataNote = async parentId => {
        try {
            const response = await getApi(
                `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/codeParent?codeParent=${parentId}`)

            setChildData(response.data || [])
        } catch (error) {
            console.error('Error fetching children:', error)
        }
    }

    const fetchChildData = async parentId => {
        try {
            const response = await getApi(
                `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/codeParent?codeParent=${parentId}`)

            setTreeData(prevTreeData => ({
                ...prevTreeData,
                [parentId]: response.data
            }))
        } catch (error) {
            console.error('Error fetching children:', error)
        }
    }

    const renderTreeItems = nodes => {
        return nodes.map(node => {
            const hasChildren = treeData[node.code] && treeData[node.code].length > 0

            return (
                <TreeItem
                    key={node.id}
                    nodeId={node.code}
                    label={
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                size='small'
                                sx={{ textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}
                                onClick={async () => {
                                    await fetchChildDataNote(node.code)
                                    await fetchChildData(node.code)
                                }}
                            >
                                {node.name}
                            </Button>
                        </Box>
                    }
                    icon={
                        node.isParent ? (
                            <Box display='flex' alignItems='center'>
                                <IconButton style={{ padding: '0px' }} onClick={() => handleFetchChildren(node.code)}>
                                    <Icon icon={expandedNodes.includes(node.code) ? 'tabler:chevron-down' : 'tabler:chevron-right'} />
                                </IconButton>
                            </Box>
                        ) : null
                    }
                    onClick={() => {
                        if (!node.isParent) {
                            fetchDigitalMap(node.code)
                        }
                    }}
                >
                    {hasChildren && renderTreeItems(treeData[node.code])}
                </TreeItem>
            )
        })
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4} container spacing={2}>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Box>
                                    <Typography>Camera List</Typography>
                                    <br />
                                    <CustomTextField
                                        value={keyword}
                                        placeholder='Search…'
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{ mr: 2, display: 'flex' }}>
                                                    <Icon fontSize='1.25rem' icon='tabler:search' />
                                                </Box>
                                            ),
                                            endAdornment: (
                                                <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                                    <Icon fontSize='1.25rem' icon='tabler:x' />
                                                </IconButton>
                                            )
                                        }}
                                        onChange={e => handleSearch(e.target.value)}
                                        sx={{
                                            width: {
                                                xs: 1,
                                                sm: 'auto'
                                            },
                                            '& .MuiInputBase-root > svg': {
                                                mr: 2
                                            }
                                        }}
                                    />
                                    <Box sx={{
                                        height: 'auto',
                                        overflow: 'auto',
                                        marginTop: '10px'
                                    }}>
                                        <TreeView
                                            sx={{ minHeight: 300 }}
                                            defaultExpanded={['root']}
                                            defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                            defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                        >
                                            {cameraGroup.map(group => renderTree(group))}
                                        </TreeView>
                                    </Box>
                                </Box>

                                <Divider sx={{ m: '0 !important' }} />
                                <br />
                                <Box sx={{ position: 'relative' }}>
                                    <Typography>Camera Selected List </Typography>
                                    <Box sx={{
                                        height: 'auto',
                                        overflow: 'auto',
                                        marginTop: '10px'
                                    }}>
                                        <TreeView
                                            sx={{ minHeight: 300 }}
                                        >
                                            {camerasSelected.map((cam, index) => (
                                                <StyledTreeItem
                                                    key={cam.id}
                                                    nodeId={cam.id}
                                                    labelText={cam.name}
                                                    labelIcon='tabler:camera'
                                                    camera={cam}
                                                    cameraSelected={true}
                                                />
                                            ))}
                                        </TreeView>
                                    </Box>
                                    <Button variant='contained' onClick={() => handleUpdateDigitalMap()} sx={{ position: 'absolute', bottom: 0, right: 0 }}>Save Digital Map</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Box>
                                    <Typography>Area List</Typography>
                                    <br />
                                    <CustomTextField
                                        value={keyword1}
                                        placeholder='Search…'
                                        InputProps={{
                                            startAdornment: (
                                                <Box sx={{ mr: 2, display: 'flex' }}>
                                                    <Icon fontSize='1.25rem' icon='tabler:search' />
                                                </Box>
                                            ),
                                            endAdornment: (
                                                <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                                    <Icon fontSize='1.25rem' icon='tabler:x' />
                                                </IconButton>
                                            )
                                        }}
                                        onChange={e => handleSearch(e.target.value)}
                                        sx={{
                                            width: {
                                                xs: 1,
                                                sm: 'auto'
                                            },
                                            '& .MuiInputBase-root > svg': {
                                                mr: 2
                                            }
                                        }}
                                    />
                                    <Box sx={{
                                        height: 'auto',
                                        overflow: 'auto',
                                        marginTop: '10px'
                                    }}>
                                        <TreeView
                                            aria-label='file system navigator'
                                            expanded={expandedNodes}
                                            defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                            defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                            sx={{ minHeight: 300, flexGrow: 1, overflowY: 'auto', height: '100%' }}
                                        >
                                            {renderTreeItems(areaGroup)}
                                        </TreeView>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Card>
                        <CardContent>
                            <IndoorMap
                                imgURL={imgMapURL}
                                cameraGroup={camerasSelected}
                                // setCamerasSelected={handleSetPositionCamerasSelected}
                                key={reload}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Map 