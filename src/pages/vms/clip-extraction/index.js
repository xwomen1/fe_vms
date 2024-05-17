import axios from "axios"
import authConfig from 'src/configs/auth'
import { TabContext, TabPanel, TreeItem } from "@mui/lab"
import { Box, Card, CardContent, CardHeader, Grid, MenuItem, MenuList, Tab, Typography, styled } from "@mui/material"
import MuiTabList from '@mui/lab/TabList'
import { useEffect, useState } from "react"
import LiveView from "./view/liveView"
import Review from "./view/review"
import Storage from "./view/storage"

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

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        '&:hover': {
            backgroundColor: theme.palette.action.selected
        }
    },
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    fontWeight: theme.typography.fontWeightMedium,
    '& .MuiMenuItem-label': {
        fontWeight: 'inherit',
        paddingRight: theme.spacing(3)
    }
}))

const ClipExtraction = () => {
    const [value, setValue] = useState('1')
    const [cameraList, setCameraList] = useState([])
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
    const [selectedIndex, setSelectedIndex] = useState(null)

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        fetchCameraList()
    }, [])

    const fetchCameraList = async () => {
        try {
            const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1`,
                config
            )
            setCameraList(res.data)
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleSetCamera = (camera, index) => {
        setCamera({ id: camera.id, name: camera.name, channel: 'Sub' })
        setSelectedIndex(index)
    }

    return (
        <>
            <Grid container spacing={0} style={{ marginTop: 10 }}>
                <TabContext value={value}>
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <TabList onChange={handleChange} aria-label='customized tabs example'>
                            <Tab value='1' label='Trực tiếp' key={1} />
                            <Tab value='2' label='Xem lại' key={2} />
                            <Tab value='3' label='Lưu trũ' key={3} />
                        </TabList>
                    </Grid>
                    <Grid item xs={2}>
                        <Card>
                            <CardContent>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>Danh sách camera</Typography>
                                </Box>
                                <MenuList>
                                    {cameraList.map((camera, index) => (
                                        <StyledMenuItem
                                            key={index}
                                            selected={selectedIndex === index}
                                            onClick={() => handleSetCamera(camera, index)}
                                        >
                                            {camera.name}
                                        </StyledMenuItem>
                                    ))}
                                </MenuList>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={10}>
                        <TabPanel value='1' sx={{ paddingTop: '0' }}>
                            <LiveView key={camera.id} id={camera.id} name={camera.name} channel={camera.channel} />
                        </TabPanel>
                        <TabPanel value='2' sx={{ paddingTop: '0' }}>
                            <Review key={camera.id} id={camera.id} name={camera.name} channel={camera.channel} />
                        </TabPanel>
                        <TabPanel value='3' sx={{ paddingTop: '0' }}>
                            <Storage />
                        </TabPanel>
                    </Grid>
                </TabContext>
            </Grid>
        </>
    )
}

export default ClipExtraction