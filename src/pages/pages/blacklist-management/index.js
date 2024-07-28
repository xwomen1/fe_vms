import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field"

const columns = [
    {
        id: 1,
        flex: 0.25,
        maxWidth: 150,
        align: 'center',
        field: 'image',
        label: 'Ảnh',
        renderCell: value => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={value} alt='' style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
            </Box>
        )
    },
    {
        id: 2,
        flex: 0.15,
        maxWidth: 150,
        align: 'center',
        field: 'quality',
        label: 'Chất lượng',
    },
    {
        id: 3,
        flex: 0.15,
        maxWidth: 150,
        align: 'center',
        field: 'threshold',
        label: 'Ngưỡng'
    },
    {
        id: 4,
        flex: 0.15,
        maxWidth: 150,
        align: 'center',
        field: 'similarity_level',
        label: 'Mức độ giống'
    }
]

const Blacklist = () => {
    const [keyword, setKeyword] = useState('')

    const [total, setTotalPage] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)

    const [dataList, setDataList] = useState([])
    const [files, setFiles] = useState([])

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)))
        }
    })

    const handleSearch = e => {
        setKeyword(e.target.value)
    }

    const handlePageChange = (event, newPage) => {
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

    const img = files.map(file => (
        <Button key={file.name} variant="outlined" startIcon={<Icon icon='tabler:file-import' />} >{file.name}</Button>
    ))

    return (
        <div style={{ padding: '30px' }}>
            <Typography variant="h3" sx={{ marginBottom: '30px' }}>Quản lý danh sách đen</Typography>
            <Card>
                <CardHeader
                    title="Danh sách đen"
                    action={
                        <Grid container spacing={5}>
                            <Grid item container xs={12}>
                                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Box {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        {files.length ? (
                                            img
                                        ) : (
                                            <Button variant="outlined" startIcon={<Icon icon='tabler:file-import' />}>
                                                Import file
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <CustomTextField label={'Ngưỡng'} />
                                </Grid>
                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <CustomTextField label={'Độ giống'} />
                                </Grid>
                                <Grid item xs={3}>
                                    <CustomTextField
                                        value={keyword}
                                        label={'Tìm kiếm'}
                                        placeholder='Tìm kiếm đối tượng'
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
                            <Grid item xs={12}>
                                <Button variant="contained" sx={{ margin: 2, float: 'right' }}>Xóa toàn bộ</Button>
                                <Button variant="contained" sx={{ margin: 2, float: 'right' }}>Tìm kiếm</Button>
                            </Grid>
                        </Grid>
                    }
                />
                <CardContent>
                    <Grid container spacing={0}>
                        <TableContainer component={Paper} sx={{ maxHeight: 1000 }}>
                            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '20px' }}>STT</TableCell>
                                        {columns.map(column => (
                                            <TableCell key={column.id} align={column.align} sx={{ maxWidth: column.maxWidth }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell style={{ maxWidth: '50px' }}>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataList?.slice(0, pageSize).map((row, index) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                {columns.map(({ field, renderCell, align, maxWidth }) => {
                                                    const value = row[field]

                                                    return (
                                                        <TableCell
                                                            key={field}
                                                            align={align}
                                                            sx={{ maxWidth, wordBreak: 'break-word', flexWrap: 'wrap' }}
                                                        >
                                                            {renderCell ? renderCell(value) : value}
                                                        </TableCell>
                                                    )
                                                })}
                                                <TableCell>
                                                    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <IconButton
                                                            onClick={() => {
                                                            }}
                                                        >
                                                            <Icon icon='tabler:trash' />
                                                        </IconButton>
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <br />
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
                            <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default Blacklist 