import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Grid, IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import axios from 'axios'
import { useEffect, useState } from "react"
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'
import toast from "react-hot-toast"
import CustomTextField from "src/@core/components/mui/text-field"
import AddModelAI from "../popups/addModelAI"

const columns = [
    {
        id: 1,
        flex: 0.15,
        minWidth: 50,
        align: 'right',
        field: 'modelName',
        label: 'Tên Model AI'
    },
    {
        id: 2,
        flex: 0.25,
        minWidth: 50,
        align: 'right',
        field: 'characteristicName',
        label: 'Đối tượng'
    },
    {
        id: 3,
        flex: 0.15,
        minWidth: 120,
        align: 'right',
        field: 'characteristicValue',
        label: 'Độ nhạy'
    },
]

const ModelAIList = () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }

    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(1)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)

    const [keyword, setKeyword] = useState('')
    const [dataList, setDataList] = useState([])
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenView, setIsOpenView] = useState(false)
    const [isOpenDel, setIsOpenDel] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const [dataModelAI, setDataModelAI] = useState(null)
    const [typePopup, setTypePopup] = useState(null)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        fetchModelAIs()
    }, [page, pageSize, keyword, reload])

    const fetchModelAIs = async () => {
        setLoading(true)

        const params = {
            ...config,
            params: {
                keyword: keyword || '',
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
            console.error('Error fetching data:', error)
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }


    const handleSearch = (e) => {
        setKeyword(e.target.value)
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

    const DeleteView = () => (
        <Dialog
            open={isOpenDel}
            maxWidth='sm'
            scroll='body'
            onClose={() => setIsOpenDel(false)}
            onBackdropClick={() => setIsOpenDel(false)}
        >
            <DialogContent
                sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant='h3' sx={{ mb: 3 }}>
                        Xác nhận
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Bạn có chắc chắn muốn xóa không ?</Typography>
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <Button
                    variant='contained'
                    onClick={() => {
                        handleDelete()
                        setIsOpenDel(false)
                    }}>
                    Đồng ý
                </Button>
                <Button variant='tonal' color='secondary'
                    sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )

    const handleDelete = () => {
        if (idDelete != null) {
            setLoading(true)

            axios.delete(`https://sbs.basesystem.one/ivis/vms/api/v0/camera-model-ai/${idDelete}`, config)
                .then(() => {
                    toast.success('Xóa thành công')
                    setIdDelete(null)
                    setReload(reload + 1)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                    toast.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Danh sách Model AI'
                    titleTypographyProps={{ sx: { mb: [2, 0] } }}
                    sx={{
                        py: 4,
                        flexDirection: ['column', 'row'],
                        '& .MuiCardHeader-action': { m: 0 },
                        alignItems: ['flex-start', 'center']
                    }}
                    action={
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setTypePopup('add')
                                        setIsOpenAdd(true)
                                    }}
                                >
                                    Thêm mới
                                </Button>
                            </Grid>
                            <Grid item>
                                <CustomTextField
                                    value={keyword}
                                    placeholder='Tìm kiếm sự kiện '
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
                                    onChange={(e) => handleSearch(e)}
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
                            </Grid>
                        </Grid>
                    }
                />

                <CardContent>
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
                                            <TableCell align='right'>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dataList.slice(0, pageSize).map((row, index) => (
                                                <TableRow hover tabIndex={-1} key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    {columns.map(column => {
                                                        const value = row[column.field]

                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.renderCell ? column.renderCell(value) : value}
                                                            </TableCell>
                                                        )
                                                    })}
                                                    <TableCell>
                                                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton
                                                                size='small'
                                                                sx={{ color: 'text.secondary' }}
                                                                onClick={() => {
                                                                    setDataModelAI(row)
                                                                    setIsOpenView(true)
                                                                    setTypePopup('view')
                                                                }}
                                                            >
                                                                <Icon icon="tabler:info-circle" />
                                                            </IconButton>
                                                            <IconButton
                                                                size='small'
                                                                sx={{ color: 'text.secondary' }}
                                                                onClick={() => {
                                                                    setDataModelAI(row)
                                                                    setIsOpenView(true)
                                                                    setTypePopup('add')
                                                                }}
                                                            >
                                                                <Icon icon="tabler:edit" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setIdDelete(row.id)
                                                                    setIsOpenDel(true)
                                                                }}
                                                            >
                                                                <Icon icon='tabler:trash' />
                                                            </IconButton>
                                                        </Grid>
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
                </CardContent>
            </Card>
            {isOpenAdd &&
                <AddModelAI
                    show={isOpenAdd}
                    typePopup={typePopup}
                    onClose={() => {
                        setTypePopup(null)
                        setIsOpenAdd(false)
                    }}
                    setReload={() => setReload(reload + 1)}
                />
            }
            {isOpenView &&
                <AddModelAI
                    show={isOpenView}
                    data={dataModelAI}
                    typePopup={typePopup}
                    onClose={() => {
                        setTypePopup(null)
                        setIsOpenView(false)
                    }}
                    setReload={() => setReload(reload + 1)}
                />
            }
            {isOpenDel && DeleteView()}

        </>
    )
}

export default ModelAIList