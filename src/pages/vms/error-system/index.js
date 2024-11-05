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
import CustomChip from 'src/@core/components/mui/chip'

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
          device_type: valueFilter.device_type,
          device_name: value || '',
          sort: '-created_at'
        }
      }

      const response = await axios.get(`https://votv.ivms.vn/votv/vms/api/v0/incidents/logs`, config)
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
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Agree',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Cancel',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleDelete = id => {
    showAlertConfirm({
      text: 'Do you want to delete it?'
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
        let urlDelete = `https://votv.ivms.vn/votv/vms/api/v0/incidents/${id}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Success!',
              text: 'Deleted successfully',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
            const updatedData = devices.filter(devices => devices.id !== id)
            setDevices(updatedData)
            setReload()
          })
          .catch(err => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || err.message,
              icon: 'error',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
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

      await axios.put(`https://votv.ivms.vn/votv/vms/api/v0/incidents/logs/status/${id}`, config)
      setLoading()
      fetchDataList()
    } catch (error) {
      console.error('Error status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [fetchDataList])

  const columns = [
    { id: 1, flex: 0.25, minWidth: 50, align: 'center', field: 'eventName', label: 'Issue name' },
    { id: 2, flex: 0.15, minWidth: 150, align: 'center', field: 'severity', label: 'Level' },
    { id: 3, flex: 0.15, minWidth: 150, align: 'center', field: 'deviceType', label: 'Device type' },
    { id: 4, flex: 0.15, minWidth: 100, align: 'center', field: 'createdAt', label: 'Time ' },
    { id: 5, flex: 0.15, minWidth: 100, align: 'center', field: 'location', label: 'Location' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'center', field: 'status', label: 'Status' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'center', field: 'source', label: 'Source' }
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
          title='List of issues'
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
                    aria-label='Filter '
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
                  placeholder='Search'
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setValue('')}>
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
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>NO.</TableCell>
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
                      <TableCell align='center'>{(page - 1) * pageSize + index + 1}</TableCell>
                      {columns.map(column => {
                        const value = row[column.field]

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.field === 'createdAt' ? (
                              formatDateTime(value)
                            ) : column.field === 'status' ? (
                              row.status ? (
                                <CustomChip
                                  rounded
                                  size='small'
                                  skin='light'
                                  sx={{ lineHeight: 1, padding: '16px', textAlign: 'center' }}
                                  label={row.status === 'Chưa xử lý' ? 'Chưa xử lý' : 'Đã kết nối'}
                                  color={row.status === 'Chưa xử lý' ? 'primary' : 'success'}
                                />
                              ) : (
                                row.status
                              )
                            ) : (
                              value
                            )}
                          </TableCell>
                        )
                      })}
                      <TableCell align='center'>
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          {row.type === 'Deactive' && (
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
                    <TableCell colSpan={columns.length + 1}>No data ...</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <br />
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
