import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import Icon from 'src/@core/components/icon'


const DigitalMaps = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const pageSizeOptions = [25, 50, 100]
    const [anchorEl, setAnchorEl] = useState(null)

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
        <>
            <Card>
                <CardHeader
                    title='Model AI List'
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
                                {/* <Button
                                    variant='outlined'
                                    onClick={() => {
                                        setTypePopup('add')
                                        setIsOpenAdd(true)
                                    }}
                                >
                                    Add New
                                </Button> */}
                            </Grid>
                            <Grid item>
                                {/* <CustomTextField
                                    value={keyword}
                                    placeholder='Search Events'
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
                                /> */}
                            </Grid>
                        </Grid>
                    }
                />

                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
                                <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            {/* {columns.map(column => (
                                                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </TableCell>
                                            ))} */}
                                            <TableCell align='center'>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* {dataList.slice(0, pageSize).map((row, index) => (
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
                                                                setDataModelAI(row)
                                                                setIsOpenView(true)
                                                                setTypePopup('view')
                                                            }}
                                                        >
                                                            <Icon icon='tabler:info-circle' />
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
                                        ))} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
        </>
    )
}

export default DigitalMaps