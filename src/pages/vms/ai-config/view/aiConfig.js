import axios from "axios"
import authConfig from 'src/configs/auth'
import { Box, Button, Card, CardHeader, Grid, Menu, MenuItem, Pagination, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import Icon from 'src/@core/components/icon'
import toast from "react-hot-toast"

const AIConfig = () => {
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [cameraGroup, setCameraGroup] = useState([])
    const [alertAIList, setAlertAIList] = useState([])

    const [switchStates, setSwitchStates] = useState({})

    const [total, setTotal] = useState(1)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const columns = [
        {
            id: 1,
            flex: 0.15,
            minWidth: 50,
            align: 'right',
            field: 'image',
            label: 'Hình ảnh'

        },
        {
            id: 2,
            flex: 0.25,
            minWidth: 50,
            align: 'right',
            field: 'name',
            label: 'camera',
        },
        {
            id: 3,
            flex: 0.15,
            minWidth: 120,
            align: 'right',
            field: 'ipAddress',
            label: 'IP',
        },
        {
            id: 4,
            flex: 0.15,
            minWidth: 120,
            align: 'right',
            field: 'location',
            label: 'Khu vực',
        },
        {
            id: 5,
            flex: 0.15,
            minWidth: 50,
            align: 'right',
            field: 'face',
            label: 'Nhận diện khuôn mặt',
            renderCell: (row) => (
                <Switch
                    checked={switchStates[row.id]?.face || false}
                    onChange={(e) => handleSwitchChange(e, row.id, 'face')}
                />
            ),
        },
        {
            id: 6,
            flex: 0.15,
            minWidth: 50,
            align: 'right',
            field: 'licensePlate',
            label: 'Nhận diện biển số',
            renderCell: (row) => (
                <Switch
                    checked={switchStates[row.id]?.licensePlate || false}
                    onChange={(e) => handleSwitchChange(e, row.id, 'licensePlate')}
                />
            ),
        },
    ]
    useEffect(() => {
        fetchCameraGroup()
    }, [])

    const fetchCameraGroup = async () => {
        try {
            const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/cameras?sort=%2Bcreated_at&page=1`,
                config
            )
            setCameraGroup(res.data)
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    const fetchModelAICamera = async (cameraId) => {
        try {
            const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/camera/${cameraId}`,
                config
            )
            console.log('res', res.data)
            setAlertAIList(res.data)
        } catch (error) {
            console.error('Error fetching data: ', error)
            toast(error)
        }
    }

    useEffect(() => {
        cameraGroup.map((camera) => {
            fetchModelAICamera(camera.id)
        })

    }, [cameraGroup])

    const handleSwitchChange = (event, cameraId, type) => {
        setSwitchStates((prevState) => ({
            ...prevState,
            [cameraId]: {
                ...prevState[cameraId],
                [type]: event.target.checked,
            },
        }))
    }

    const handlePageChange = newPage => {
        setPage(newPage)
    }

    const handleOpenMenu = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleSelectPageSize = size => {
        setPageSize(size)
        setPage(1)
        handleCloseMenu()
    }

    return (
        <Card>
            <CardHeader title='Cấu hình AI' />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">STT</TableCell>
                                    {columns.map(column => (
                                        <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    cameraGroup.slice(0, pageSize).map((row, index) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={index}>
                                                <TableCell align="right">{index + 1}</TableCell>
                                                {columns.map(column => {
                                                    const value = row[column.field]

                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.renderCell ? column.renderCell(row) : value}
                                                        </TableCell>
                                                    )
                                                })}
                                                <TableCell align="right">
                                                    <Switch
                                                        checked={switchStates[row.id]?.global || false}
                                                        onChange={(e) => handleSwitchChange(e, row.id, 'global')}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <br />
                <Grid item xs={12}>
                    <Grid container spacing={2} style={{ padding: 10 }}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={1}>
                            <span style={{ fontSize: 15 }}> dòng/trang</span>
                        </Grid>
                        <Grid item xs={1} style={{ padding: 0 }}>
                            <Box>
                                <Button onClick={handleOpenMenu} endIcon={<Icon icon='tabler:selector' />}>
                                    {pageSize}
                                </Button>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                    {pageSizeOptions.map(size => (
                                        <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Pagination count={total} page={page} color='primary' onChange={(event, page) => handlePageChange(page)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}

export default AIConfig