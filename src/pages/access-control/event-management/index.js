import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  CardHeader,
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
import { format } from 'date-fns'

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
  const [totalPage, setTotalPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [devices, setDevices] = useState([])
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState(false)
  const pageSizeOptions = [25, 50, 100]
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const formatDateTime = dateTime => {
    const date = typeof dateTime === 'number' ? new Date(dateTime) : new Date(dateTime)
    return format(date, 'HH:mm:ss dd/MM/yyyy')
  }

  const formatTime = dateTime => {
    const date = typeof dateTime === 'number' ? new Date(dateTime) : new Date(dateTime)
    return format(date, 'dd/MM/yyyy HH:mm:ss')
  }

  const formatDate = dateTime => {
    const date = typeof dateTime === 'number' ? new Date(dateTime) : new Date(dateTime)
    return format(date, 'dd/MM/yyyy')
  }

  const calculateTotalTime = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end - start // milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours} giờ ${minutes} phút `
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
  useEffect(() => {
    fetchDataList()
  }, [])

  const fetchDataList = useCallback(async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: searchKeyword,
          page: page,
          limit: pageSize
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/user/door`,
        config
      )
      setDevices(response.data.data)
      setTotalPage(Math.ceil(response.data.count / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [token, page, pageSize, searchKeyword])

  const handleSearch = () => {
    setPage(1)
    fetchDataList()
  }

  const columns = [
    { id: 1, flex: 0.25, minWidth: 50, align: 'left', field: 'userName', label: 'Họ và tên' },
    { id: 2, flex: 0.15, minWidth: 150, align: 'left', field: 'accessCode', label: 'Mã nhân viên' },
    { id: 3, flex: 0.15, minWidth: 100, align: 'left', field: 'doorIn', label: 'Cửa vào' },
    { id: 4, flex: 0.15, minWidth: 100, align: 'left', field: 'doorOut', label: 'Cửa ra' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'timeMin', label: 'Thời gian vào' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'left', field: 'timeMax', label: 'Thời gian ra' },
    { id: 8, flex: 0.25, minWidth: 50, align: 'left', field: 'totalTime', label: 'Tổng thời gian' }
  ]

  return (
    <Card>
      <CardHeader
        title='Danh sách sự kiện'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
        action={
          <Grid container spacing={2}>
            <Grid item></Grid>
            <Grid item>
              <CustomTextField
                placeholder='Nhập tên sự kiện ...! '
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size='small'
                      title='Clear'
                      aria-label='Clear'
                      onClick={() => {
                        setSearchKeyword('')
                        fetchDataList()
                      }}
                    >
                      <Icon fontSize='1.25rem' icon='tabler:x' />
                    </IconButton>
                  )
                }}
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
              <Button variant='contained' style={{ margin: '0px 2px' }} onClick={handleSearch}>
                Tìm kiếm <Icon fontSize='1.25rem' icon='tabler:search' />
              </Button>
            </Grid>
          </Grid>
        }
      />
      <Grid container spacing={0}>
        <TableContainer component={Paper} sx={{ minHeight: 600, minWidth: 500 }}>
          <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(devices) && devices.length > 0 ? (
                devices.map((row, index) => (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                    {columns.map(column => {
                      const value = row[column.field]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.field === 'timeMin' || column.field === 'timeMax'
                            ? formatTime(value)
                            : column.field === 'date'
                            ? formatDate(row.timeMin)
                            : column.field === 'totalTime'
                            ? calculateTotalTime(row.timeMin, row.timeMax)
                            : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>Không có dữ liệu ...</TableCell>
                </TableRow>
              )}
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
          <Pagination count={totalPage} page={page} color='primary' onChange={handlePageChange} />
        </Grid>
      </Grid>
    </Card>
  )
}

export default EventList
