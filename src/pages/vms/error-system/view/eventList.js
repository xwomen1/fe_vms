import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Filter from '../popups/filter'
import View from '../popups/view'
import Add from '../popups/add'

const initValueFilter = {
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  keyword: '',
  limit: 25,
  page: 1
}

const EventList = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config1 = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const config = {
    bundlePolicy: 'max-bundle',
    iceServers: [
      {
        urls: 'stun:dev-ivis-camera-api.basesystem.one:3478'
      },
      {
        urls: 'turn:dev-ivis-camera-api.basesystem.one:3478',
        username: 'demo',
        credential: 'demo'
      }
    ]
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

  const columns = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'left',
      field: 'imageObject',
      label: 'Tên sự cố'
    },
    {
      id: 2,
      flex: 0.15,
      minWidth: 150,
      align: 'left',
      label: 'Mức độ'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'left',
      field: 'description',
      label: 'Thời gian'
    },
    {
      id: 4,
      flex: 0.15,
      minWidth: 100,
      align: 'left',
      field: 'timestamp',
      label: 'Vị trí'
    },
    {
      id: 5,
      flex: 0.25,
      minWidth: 50,
      align: 'left',
      field: 'camName',
      label: 'Trạng thái'
    },
    {
      id: 6,
      flex: 0.25,
      minWidth: 50,
      align: 'left',
      field: 'location',
      label: 'Nguồn'
    }
  ]

  return (
    <>
      <Card>
        <CardHeader
          title='Danh sách sự cố'
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
                <Box sx={{ float: 'right' }}>
                  <Button
                    aria-label='Bộ lọc'
                    onClick={() => {
                      setIsOpenFilter(true)
                    }}
                    variant='contained'
                  >
                    <Icon icon='tabler:filter' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
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
        <Grid container spacing={0}>
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
                  {/* <TableCell>Thao tác</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Sự cố hệ thống Cam1</TableCell>
                  <TableCell>Thấp</TableCell>
                  <TableCell>11:00 15/5/2024</TableCell>
                  <TableCell>Cầu thang tầng 3</TableCell>
                  <TableCell>đang hoạt động</TableCell>
                  <TableCell>camera PC1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Sự cố hệ thống Cam1</TableCell>
                  <TableCell>Thấp</TableCell>
                  <TableCell>11:00 14/5/2024</TableCell>
                  <TableCell>Cầu thang tầng 3</TableCell>
                  <TableCell>đang hoạt động</TableCell>
                  <TableCell>camera PC1</TableCell>
                </TableRow>
              </TableBody>
              {/* <TableBody>
                {deviceList?.rows.slice(0, pageSize).map((row, index) => {
                  return (
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
                              setIsOpenView(true)
                              setEventDetail(row)
                            }}
                          >
                            <Icon icon='tabler:eye' />
                          </IconButton>
                          <IconButton
                            size='small'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => {
                              setIsOpenEdit(true)
                              setEventDetail(row)
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
                  )
                })}
              </TableBody> */}
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
            <Pagination count={total} page={page} color='primary' onChange={(event, page) => handlePageChange(page)} />
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default EventList
