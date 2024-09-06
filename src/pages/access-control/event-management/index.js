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
  CardContent,
  CardActions,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import * as XLSX from 'xlsx'

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
  const [filterPopupOpen, setFilterPopupOpen] = useState(false)

  const [filterValues, setFilterValues] = useState({
    deviceIds: '',
    groupId: '',
    startDate: null,
    endDate: null
  })
  const [userGroups, setUserGroups] = useState([]) // Dùng để lưu danh sách user groups
  const [selectedUserGroup, setSelectedUserGroup] = useState(null) // Dùng để lưu user group được chọn
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUserGroups(response.data.rows) // Giả sử API trả về danh sách user groups
      } catch (error) {
        console.error('Error fetching user groups:', error)
      }
    }

    fetchUserGroups()
  }, [])

  const handleStartDateChange = date => {
    setFilterValues(prev => ({ ...prev, startDate: date }))
  }

  const handleEndDateChange = date => {
    setFilterValues(prev => ({ ...prev, endDate: date }))
  }

  const handleOpenFilterPopup = () => {
    setFilterPopupOpen(true)
  }

  const handleCloseFilterPopup = () => {
    setFilterPopupOpen(false)
  }

  const formatTime = dateTime => {
    const date = typeof dateTime === 'number' ? new Date(dateTime) : new Date(dateTime)

    return format(date, 'dd/MM/yyyy HH:mm:ss')
  }
  console.log(devices, 'device')

  const handleExportExcel = async () => {
    const devices = await fetchAllData()
    console.log(devices, 'devoce')

    const formattedData = devices?.map((device, index) => ({
      No: index + 1,
      FullName: device.fullName,
      AccessCode: device.accessCode,
      Event: device.deviceDirection,
      Time: formatTime(device.dateEvent),
      Door: device.hostName,
      DeviceName: device.deviceName,
      DeviceType: device.deviceGroupName
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Data')

    XLSX.writeFile(workbook, 'event_data.xlsx')
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
  }, [page, pageSize])
  useEffect(() => {
    if (searchKeyword === '') {
      fetchDataList1()
    }
  }, [searchKeyword])
  function isoToEpoch(isoDateString) {
    var milliseconds = Date.parse(isoDateString)
    var epochSeconds = Math.round(milliseconds)

    return epochSeconds
  }

  const fetchDataList1 = useCallback(async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: pageSize,
          deviceName: filterValues.deviceName,
          hostName: filterValues.hostName,
          startDate: isoToEpoch(filterValues.startDate) || null,
          endDate: isoToEpoch(filterValues.endDate) || null,
          groupId: filterValues.groupId || null // Thêm groupId vào params
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/search`, config)
      setDevices(response.data.rows)
      setTotalPage(Math.ceil(response.data.count / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [token, page, pageSize, filterValues])

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
          limit: pageSize,
          deviceName: filterValues.deviceName,
          hostName: filterValues.hostName,
          startDate: isoToEpoch(filterValues.startDate) || null,
          endDate: isoToEpoch(filterValues.endDate) || null,
          groupId: filterValues.groupId || null // Thêm groupId vào params
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/search`, config)
      setDevices(response.data.rows)
      setTotalPage(Math.ceil(response.data.count / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [token, page, pageSize, searchKeyword, filterValues])

  const fetchDevicesByPage = async page => {
    const response = await axios.get(
      `https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/search?page=${page}`
    )

    return response.data
  }

  const handleSearch = () => {
    setPage(1)
    fetchDataList()
  }

  const fetchAllData = async () => {
    let allDevices = []
    let page = 1
    let totalPages = 1

    try {
      const initialResponse = await fetchDevicesByPage(page)
      totalPages = initialResponse.totalPage

      allDevices = initialResponse.rows

      // Lặp qua từng trang và lấy dữ liệu
      while (page < totalPages) {
        page += 1
        const response = await fetchDevicesByPage(page)
        allDevices = allDevices.concat(response.rows)
      }

      return allDevices
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu: ', error)

      return []
    }
  }

  const columns = [
    { id: 1, flex: 0.25, minWidth: 50, align: 'left', field: 'userName', label: 'Full Name' },
    { id: 2, flex: 0.15, minWidth: 150, align: 'left', field: 'accessCode', label: 'Access Code' },
    { id: 3, flex: 0.15, minWidth: 100, align: 'left', field: 'deviceDirection', label: 'Event' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'timeMin', label: 'Time ' },

    { id: 4, flex: 0.15, minWidth: 100, align: 'left', field: 'doorOut', label: 'Door' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'timeMin', label: 'Device Name' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'left', field: 'timeMax', label: 'Device Type' }
  ]

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <CardHeader
        title={
          <>
            <Button variant='contained'>Event List</Button>
          </>
        }
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
              <Button variant='contained' onClick={handleOpenFilterPopup}>
                <Icon fontSize='1.25rem' icon='tabler:filter' />
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' onClick={handleExportExcel}>
                <Icon fontSize='1.25rem' icon='tabler:file-export' />
              </Button>
            </Grid>

            <Grid item>
              <CustomTextField
                placeholder='Enter event'
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
                Search <Icon fontSize='1.25rem' icon='tabler:search' />
              </Button>
            </Grid>
          </Grid>
        }
      />
      <CardContent sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={0}>
          <TableContainer component={Paper} sx={{ maxHeight: '100%', minWidth: '100%', overflow: 'auto' }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
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
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.accessCode}</TableCell>
                      <TableCell>{row.deviceDirection}</TableCell>
                      <TableCell>{formatTime(row.dateEvent)}</TableCell>

                      <TableCell>{row.hostName}</TableCell>
                      <TableCell>{row.deviceName}</TableCell>
                      <TableCell>{row.deviceGroupName}</TableCell>

                      {/* {columns.map(column => {
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
                      })} */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>Not data available ...</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </CardContent>
      <CardActions sx={{ backgroundColor: 'white' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>

          <Grid item xs={1}>
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
            <Pagination count={totalPage} page={page} color='primary' onChange={handlePageChange} />
          </Grid>
        </Grid>
      </CardActions>
      <Dialog
        open={filterPopupOpen}
        onClose={handleCloseFilterPopup}
        PaperProps={{
          style: {
            overflow: 'visible' // Đảm bảo popup không bị cắt khi hiển thị các thành phần bên trong
          }
        }}
      >
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <DatePickerWrapper>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
              <div>
                <DatePicker
                  selected={filterValues.startDate}
                  onChange={handleStartDateChange}
                  dateFormat='dd/MM/yyyy'
                  customInput={<CustomInput label='Start date' />}
                  popperProps={{
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: 'viewport' // Đảm bảo rằng DatePicker không bị cắt bởi viewport
                        }
                      }
                    ]
                  }}
                />
              </div>
              <div>
                <DatePicker
                  selected={filterValues.endDate}
                  onChange={handleEndDateChange}
                  dateFormat='dd/MM/yyyy'
                  customInput={<CustomInput label='End date' />}
                  popperProps={{
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: 'viewport'
                        }
                      }
                    ]
                  }}
                />
              </div>
            </Box>
          </DatePickerWrapper>
          <FormControl fullWidth margin='normal'>
            <InputLabel>User Group</InputLabel>
            <Select
              value={selectedUserGroup || ''}
              onChange={e => {
                const selectedGroup = userGroups.find(group => group.id === e.target.value)
                setSelectedUserGroup(e.target.value) // Lưu id được chọn
                setFilterValues(prev => ({ ...prev, groupId: selectedGroup.id })) // Truyền id vào filterValues
              }}
            >
              {userGroups.map(group => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Các phần tử khác */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilterPopup}>Cancel</Button>
          <Button
            variant='contained'
            onClick={() => {
              handleSearch()
              handleCloseFilterPopup()
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default EventList
