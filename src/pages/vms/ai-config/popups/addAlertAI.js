import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import Daily from '../mocdata/daily'
import toast from 'react-hot-toast'

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

const columns = [
    {
        id: 1,
        flex: 0.15,
        minWidth: 50,
        align: 'right',
        field: 'modelName',
        label: 'Tên Model AI'
    },
]

const AddAlertAI = ({ show, onClose, setReload, data, cameraId, typePopup }) => {
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(1)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)
    const [alertIdList, setAlertIdList] = useState([])
    const [dataList, setDataList] = useState([])

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
        }
    }

    useEffect(() => {
        const arr = []
        data.map((alert, index) => {
            arr.push(alert.cameraModelAI.id)
        })
        setAlertIdList(arr)
    }, [data])

    useEffect(() => {
        fetchModelAIs()
    }, [page, pageSize])

    const fetchModelAIs = async () => {
        setLoading(true)

        const params = {
            ...config,
            params: {
                sort: '+created_at',
                limit: pageSize,
                page: page,
            }
        }

        try {
            const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai`, params)
            setDataList(res.data)
            setTotal(res.data.size)
        } catch (error) {
            if (error && error?.response?.data) {
                console.error('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.error('Error fetching data:', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
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

    const onSubmit = (values) => {

        onClose()
    }

    const handleSubmit = (values) => {
        setLoading(true)
        if (typePopup === 'update') {
            handleUpdateAlert(values)
        } else if (typePopup === 'add') {
            handleAddAlert(values)
        }
    }

    const handleAddAlert = (values) => {
        const params = {
            camera_id: cameraId,
            cameraaiproperty: [
                {
                    cameraModelAI: { ...values },
                    cameraAiZone: {
                        vfences: [],
                        vzone: {}
                    },
                    calendarDays: [],
                    isactive: true
                }
            ]
        }

        axios.post(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties`, params, config)
            .then((res) => {
                setReload()
                onClose()
                toast.success(res.message)
            })
            .catch((error) => {
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

    const handleUpdateAlert = (values) => {
        const params = {
            cameraaiproperty: [
                ...data,
                {
                    cameraModelAI: { ...values },
                    cameraAiZone: {
                        vfences: [],
                        vzone: {}
                    },
                    calendarDays: [],
                    isactive: true
                }
            ]
        }

        axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/user/ai-properties/${cameraId}`, params, config)
            .then((res) => {
                setReload()
                onClose()
                toast.success(res.message)
            })
            .catch((error) => {
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

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        pb: theme => `${theme.spacing(8)} !important`,
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 8, textAlign: 'left' }}>
                        <Typography variant='h3' sx={{ mb: 3 }}>
                            Danh sách Model AI
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            {columns.map(column => (
                                                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                            <TableCell align="right">Tồn tại</TableCell>
                                            <TableCell align='right'>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dataList.slice(0, pageSize).map((row, index) => (
                                                <TableRow hover tabIndex={-1} key={index} >
                                                    <TableCell>{index + 1}</TableCell>
                                                    {columns.map(column => {
                                                        const value = row[column.field]

                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.renderCell ? column.renderCell(value) : value}
                                                            </TableCell>
                                                        )
                                                    })}
                                                    <TableCell align="right">
                                                        <Typography color={alertIdList.some(alert => alert === row.id) ? '#28C76F' : 'primary'}>
                                                            {alertIdList.some(alert => alert === row.id) ? 'Đã thêm' : 'Chưa thêm'}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align='right'>
                                                        <IconButton
                                                            size='small'
                                                            sx={{ color: 'text.secondary' }}
                                                            onClick={() => {
                                                                handleSubmit(row)
                                                            }}
                                                            disabled={alertIdList.some(alert => alert === row.id) ? true : false}
                                                        >
                                                            <Icon icon="tabler:square-rounded-plus" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ padding: 10 }}>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}>
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
                                    <Pagination
                                        count={total}
                                        page={page}
                                        color='primary'
                                        onChange={(event, page) => handlePageChange(page)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'right',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default AddAlertAI