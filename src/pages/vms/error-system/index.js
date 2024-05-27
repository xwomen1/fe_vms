import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
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
import Filter from './popups/filter'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'

const EventList = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [value, setValue] = useState('')
  const [reaload, setReload] = useState(0)
  const [page, setPage] = useState(1)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [devices, setDevices] = useState([])
  const [pageSize, setPageSize] = useState(25)
  const [loading, setLoading] = useState(false)
  const pageSizeOptions = [25, 50, 100]
  const token = localStorage.getItem('authConfig.storageTokenKeyName')

  const initValueFilter = {
    event_name: value,
    page: page,
    limit: pageSize,
    type: null,
    device_type: null
  }

  const [valueFilter, setValueFilter] = useState(initValueFilter)

  const formatDateTime = dateTimeString => {
    const date = new Date(dateTimeString)

    return format(date, 'HH:mm dd/MM/yyyy')
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

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const fetchDataList = useCallback(async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          event_name: valueFilter.event_name,
          page: page,
          limit: pageSize,
          type: valueFilter.type,
          device_type: valueFilter.device_type
        }
      }

      const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/incidents/logs`, config)
      setDevices(response.data)
      setTotalPage(Math.ceil(response.count / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [token, value, page, pageSize, reaload, valueFilter])

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleDelete = id => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/incidents/${id}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire('Xóa thành công', '', 'success')
            const updatedData = devices.filter(devices => devices.id !== id)
            setDevices(updatedData)
            setReload()
          })
          .catch(err => {
            Swal.fire('Đã xảy ra lỗi', err.message, 'error')
          })
      }
    })
  }

  const handleAsNvr = async id => {
    console.log(id, 'log')
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/incidents/logs/status/${id}`, config)
      setLoading()
      fetchDataList()
      Swal.fire('Thay đổi trạng thái thành công', '', 'success')
    } catch (error) {
      console.error('Error status:', error)
      Swal.fire(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [fetchDataList])

  const columns = [
    { id: 1, flex: 0.25, minWidth: 50, align: 'left', field: 'eventName', label: 'Tên sự cố' },
    { id: 2, flex: 0.15, minWidth: 150, align: 'left', field: 'severity', label: 'Mức độ' },
    { id: 3, flex: 0.15, minWidth: 150, align: 'left', field: 'deviceType', label: 'Loại thiết bị' },
    { id: 4, flex: 0.15, minWidth: 100, align: 'left', field: 'createdAt', label: 'Thời gian' },
    { id: 5, flex: 0.15, minWidth: 100, align: 'left', field: 'location', label: 'Vị trí' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'status', label: 'Trạng thái' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'left', field: 'source', label: 'Nguồn' }
  ]

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }
    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

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
                  value={value}
                  onChange={e => handleFilter(e.target.value)}
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
                  <TableCell style={{ textAlign: 'center' }}>Thao tác</TableCell>
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
                            {column.field === 'createdAt' ? formatDateTime(value) : value}
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          {row.eventName === 'Đã kết nối' ? (
                            <IconButton
                              onClick={() => handleAsNvr(row.id)}
                              size='small'
                              sx={{ color: 'text.secondary', visibility: 'hidden' }}
                            >
                              <Icon icon='tabler:check' />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleAsNvr(row.id)}
                              size='small'
                              sx={{ color: 'text.secondary' }}
                            >
                              <Icon icon='tabler:check' />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleDelete(row.id)}
                            size='small'
                            sx={{ color: 'text.secondary' }}
                          >
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Grid>
                      </TableCell>
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
      {isOpenFilter && (
        <Filter
          show={isOpenFilter}
          valueFilter={valueFilter}
          onClose={() => setIsOpenFilter(false)}
          callback={handleSetValueFilter}
        />
      )}
    </>
  )
}

export default EventList
