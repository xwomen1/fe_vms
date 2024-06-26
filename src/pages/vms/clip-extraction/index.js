import axios from "axios"
import authConfig from 'src/configs/auth'
import { TabContext, TabPanel, TreeItem, TreeView } from "@mui/lab"
import { Box, Card, CardContent, CardHeader, Grid, IconButton, Tab, Typography, styled } from "@mui/material"
import MuiTabList from '@mui/lab/TabList'
import { useEffect, useState } from "react"
import LiveView from "./view/liveView"
import Review from "./view/review"
import Storage from "./view/storage"
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"

const TabList = styled(MuiTabList)(({ theme }) => ({
    borderBottom: '0 !important',
    '&, & .MuiTabs-scroller': {
        boxSizing: 'content-box',
        padding: theme.spacing(1.25, 1.25, 2),
        margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
        lineHeight: 1,
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}))

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
    const { labelText, labelIcon, labelInfo, color, ...other } = props

    return (
        <StyledTreeItemRoot
            {...other}
            label={
                <Box
                    sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                    <Icon icon={labelIcon} color={color} />
                    <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500 }}>
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

const ClipExtraction = () => {
    const [value, setValue] = useState('1')
    const [keyword, setKeyword] = useState('')
    const [cameraList, setCameraList] = useState([])
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
    const [eventsData, setEventData] = useState([])
    const [websocket, setWebsocket] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)

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

    const fetchCameraList = async () => {
        try {
            const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keyword}&limit=25&page=1`,
                config
            )
            if (Array.isArray(res?.data)) {
                setCameraList(res?.data)
            } else {
                setCameraList([])
            }

        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
        setCamera({ id: '', name: '', channel: '' })
    }

    const handleSearch = e => {
        setKeyword(e.target.value)
    }

    const handleSetCamera = (camera) => {
        setCamera({ id: camera.id, name: camera.deviceName, channel: 'Sub' })
    }

    const renderTree = group => {
        return (
            <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
                {group.cameras && group.cameras.length > 0
                    ? group.cameras.map(camera => {
                        const matchedEvent = eventsData.find(event => event.id === camera.id)
                        const status = matchedEvent?.status

                        return (
                            <StyledTreeItem
                                key={camera.id}
                                nodeId={camera.id}
                                color={status == true ? '#28c76f' : ''}
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

    return (
        <>
            <Grid container spacing={2} style={{ marginTop: 10 }}>
                <TabContext value={value}>
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <TabList onChange={handleChange} aria-label='customized tabs example'>
                            <Tab value='1' label='Trực tiếp' key={1} />
                            <Tab value='2' label='Xem lại' key={2} />
                            <Tab value='3' label='Trích clip' key={3} />
                        </TabList>
                    </Grid>
                    <Grid item xs={12} sm={4} lg={2}>
                        <Card>
                            <CardHeader title='Danh sách Camera' />
                            <CardContent>
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
                                    onChange={handleSearch}
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
                                    height: {
                                        xs: '300px',
                                        sm: '300px',
                                        lg: '400px',
                                    },
                                    overflow: 'auto',
                                    marginTop: '10px'
                                }}>
                                    <TreeView
                                        sx={{ minHeight: 240 }}
                                        defaultExpanded={['root']}
                                        defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                        defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                                    >
                                        {cameraList.map(group => renderTree(group))}
                                    </TreeView>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={8} lg={10}>
                        <TabPanel value='1' sx={{ paddingTop: '0' }}>
                            <LiveView key={camera.id} id={camera.id} name={camera.name} channel={camera.channel} />
                        </TabPanel>
                        <TabPanel value='2' sx={{ paddingTop: '0' }}>
                            <Review key={camera.id} id={camera.id} name={camera.name} channel={camera.channel} />
                        </TabPanel>
                        <TabPanel value='3' sx={{ paddingTop: '0' }}>
                            <Storage key={camera.id} id={camera.id} name={camera.name} channel={camera.channel} />
                        </TabPanel>
                    </Grid>
                </TabContext>
            </Grid>
        </>
    )
}

export default ClipExtraction