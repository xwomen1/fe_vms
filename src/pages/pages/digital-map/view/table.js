import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"
import AddMap from "../popups/addMap"
import toast from "react-hot-toast"
import { delApi, getApi } from "src/@core/utils/requestUltils"
import EditMap from "../popups/editMap"



const DigitalMapTable = () => {
    const [reload, setReload] = useState(0)
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)
    const [data, setData] = useState([])
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenView, setIsOpenView] = useState(false)
    const [isOpenDel, setIsOpenDel] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const [digitalMapId, setDigitalMapId] = useState(null)

    const columns = [
        {
            id: 1,
            flex: 0.15,
            minWidth: 50,
            align: 'center',
            field: 'name',
            label: 'Name'
        },
        {
            id: 2,
            flex: 0.25,
            minWidth: 50,
            align: 'center',
            field: 'areaName',
            label: 'Area Name'
        },
        {
            id: 3,
            flex: 0.15,
            minWidth: 120,
            align: 'center',
            field: 'areaCode',
            label: 'Area Code',
        }

    ]

    const handleSearch = e => {
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

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await getApi(
                `https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps?keyword=${keyword}&page=${page}&limit=${pageSize}&sort=-created_at`
            )

            const data = response.data
            if (data?.length > 0) {
                setData(data)
            }
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

    const handleDelete = async () => {
        if (idDelete != null) {
            setLoading(true)

            try {
                await delApi(`https://sbs.basesystem.one/ivis/infrares/api/v0/digital-maps/${idDelete}`)
                setReload(reload + 1)
                setIdDelete(null)
                toast.success('Deleted Successfully')
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
    }

    useEffect(() => {
        fetchData()
    }, [keyword, page, pageSize, reload])


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
                    // pb: theme => `${theme.spacing(8)} !important`,
                    // px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    // pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant='h3' sx={{ mb: 3 }}>
                        Confirm
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Are you sure you want to delete?</Typography>
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    // justifyContent: 'center',
                    // px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    // pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
            >
                <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        handleDelete()
                        setIsOpenDel(false)
                    }}
                >
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )

    return (
        <>
            <Card>
                <CardHeader
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
                                    variant='outlined'
                                    onClick={() => {
                                        setIsOpenAdd(true)
                                    }}
                                >
                                    Add New
                                </Button>
                            </Grid>
                            <Grid item>
                                <CustomTextField
                                    value={keyword}
                                    placeholder='Search ...'
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
                                    onChange={e => handleSearch(e)}
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
                            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        {columns.map(column => (
                                            <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell align='center'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                {loading && (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: ' 100%',
                                            position: 'absolute',
                                            zIndex: 10,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                )}
                                <TableBody>
                                    {data.slice(0, pageSize).map((row, index) => (
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
                                                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                                                    <IconButton
                                                        size='small'
                                                        sx={{ color: 'text.secondary' }}
                                                        onClick={() => {
                                                            setDigitalMapId(row.id)
                                                            setIsOpenView(true)
                                                        }}
                                                    >
                                                        <Icon icon='tabler:edit' />
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
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ padding: 10 }}>
                                <Grid item xs={3}></Grid>

                                <Grid item xs={1} style={{ padding: 0 }}>
                                    <Box>
                                        <IconButton onClick={handleOpenMenu}>
                                            <Icon icon='tabler:selector' />
                                            <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                                        </IconButton>
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
                                    <Pagination page={page} color='primary' onChange={(event, page) => handlePageChange(page)} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
            {isOpenAdd && (
                <AddMap show={isOpenAdd} onClose={() => setIsOpenAdd(false)} setReload={() => setReload(reload + 1)} />
            )}
            {isOpenView && (
                <EditMap show={isOpenView} onClose={() => setIsOpenView(false)} id={digitalMapId} setReload={() => setReload(reload + 1)} />
            )}
            {isOpenDel && DeleteView()}
        </>
    )
}

export default DigitalMapTable