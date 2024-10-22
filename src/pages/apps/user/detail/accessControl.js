import React, { useEffect, useState, useCallback } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

import View from './popup/view'
import { useRouter } from 'next/router'

const AccessRight = () => {
  const [reload, setReload] = useState(0)
  const router = useRouter()
  const { userId } = router.query
  console.log(userId, 'userId')

  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [dataList, setDataList] = useState([])
  const [dataList1, setDataList1] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [idDelete, setIdDelete] = useState(null)
  const [idView, setIdView] = useState(null)
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [userData, setUserData] = useState([])
  const [rows, setRows] = useState([])

  const tabList = [
    {
      id: 'overview',
      value: 'Tổng quan'
    }
  ]

  const [tab, setTab] = useState(tabList[0].id)
  const [value, setValue] = useState('')
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const initValueFilter = {
    nameCalendar: value,
    limit: 25,
    page: 1,
    doorInId: null,
    doorOutId: null,
    groupId: null
  }
  const [valueFilter, setValueFilter] = useState(initValueFilter)

  const formatDate = timestamp => {
    const date = new Date(timestamp) // Chuyển đổi timestamp thành đối tượng Date

    // Lấy các thành phần ngày, tháng, năm
    const day = String(date.getDate()).padStart(2, '0') // Đảm bảo ngày có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
    const year = date.getFullYear() // Lấy năm

    return `${day}/${month}/${year}` // Trả về định dạng ngày/tháng/năm
  }

  const columns = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'left',
      field: 'nameCalendar',
      label: 'Name Schedule'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'left',
      field: 'name',
      label: 'Name'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'left',
      label: 'Department',
      field: 'groupName'
    },
    {
      id: 4,
      flex: 0.15,
      minWidth: 200,
      align: 'left',
      field: 'doorInName',
      label: 'Door in'
    },
    {
      id: 5,
      flex: 0.15,
      minWidth: 200,
      align: 'left',
      field: 'doorOutName',
      label: 'Door out'
    },
    {
      id: 6,
      flex: 0.15,
      minWidth: 130,
      align: 'left',
      field: 'availableAt',
      label: 'Available At',
      valueGetter: params => params.value
    },
    {
      id: 7,
      flex: 0.15,
      minWidth: 130,
      align: 'left',
      field: 'expiredAt',
      label: 'Expired At',
      valueGetter: params => params.value
    }
  ]

  const fetchDataList = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          nameCalendar: value,
          page: valueFilter.page,
          limit: valueFilter.limit
        }
      }

      let dataConfig = []
      let dataUser = {}
      try {
        const responseConfig = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/?userId=${userId}`,
          config
        )
        dataConfig = responseConfig.data.rows
      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.error('Error fetching configuration data:', errorMessage)
        toast.error(`Error fetching configuration data: ${errorMessage}`)
      }

      try {
        const responseUser = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/${userId}`, config)
        dataUser = responseUser.data
      } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.error('Error fetching user data:', errorMessage)
        toast.error(`Error fetching user data: ${errorMessage}`)
      }

      const combinedData = dataConfig.map(item => ({
        ...item,
        availableAt: dataUser.availableAt ? formatDate(dataUser.availableAt) : 'none',
        expiredAt: dataUser.expiredAt ? formatDate(dataUser.expiredAt) : 'none'
      }))

      setDataList(combinedData)
    } catch (error) {
      console.error('Unexpected error:', error.message)
      setErrorMessage(`Unexpected error: ${error.message}`)
      toast.error(`Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSetRows = () => {
    let modifiedData = []
    let totalRecords = 0
    let totalPages = 0

    totalRecords = dataList.reduce((acc, curr) => acc + curr.users.length, 0)
    totalPages = Math.ceil(totalRecords / pageSize)

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    let remainingUsers = 0
    for (const item of dataList) {
      remainingUsers += item.users.length
      if (modifiedData.length === 0 && remainingUsers >= startIndex) {
        const startIdx = Math.max(0, startIndex - (remainingUsers - item.users.length))
        const endIdx = Math.min(item.users.length, endIndex - (remainingUsers - item.users.length))
        modifiedData.push(...item.users.slice(startIdx, endIdx).map(user => ({ ...user, ...item })))
      } else if (modifiedData.length > 0) {
        modifiedData.push(
          ...item.users.slice(0, Math.max(0, 25 - modifiedData.length)).map(user => ({ ...user, ...item }))
        )
      }
      if (modifiedData.length >= pageSize) break
    }

    setTotalPage(totalPages)
    setRows(modifiedData)
  }

  useEffect(() => {
    handleSetRows()
  }, [dataList, pageSize, page, reload, value])

  useEffect(() => {
    fetchDataList()
  }, [])

  useEffect(() => {
    if (tab === 'overview') {
      fetchDataList()
    }
  }, [tab, reload, valueFilter, value])

  const handleTabsChange = (event, newValue) => {
    setTab(newValue)
  }

  const handSearch = val => {
    setKeyword(val)
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

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

  const handleExport = async () => {
    const excelData = dataList.reduce((acc, row) => {
      if (row.calendarDays && Array.isArray(row.calendarDays)) {
        row.calendarDays.forEach(calendarDay => {
          acc.push({
            Name: row.nameCalendar,
            'Phòng ban': row.groupName,
            'Ngày trong tuần': calendarDay.dayOfWeek,
            'Giờ bắt đầu': calendarDay.timePeriods[0]?.startTimeInMinute,
            'Giờ kết thúc': calendarDay.timePeriods[0]?.endTimeInMinute,
            'Cửa vào': row.doorInName,
            'Cửa ra': row.doorOutName,
            'Start date': row.startDate,
            'End date': row.endDate,
            'Số lượng người': row.sizeUser
          })
        })
      }

      return acc
    }, [])

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch')

    // Tạo tệp Excel và tải về
    XLSX.writeFile(wb, 'Lịch.xlsx')
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
            Accept
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Do you want to delete it?</Typography>
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
          }}
        >
          Yes
        </Button>
        <Button variant='tonal' color='secondary' sx={{ mr: 1 }} onClick={() => setIsOpenDel(false)}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )

  const handleDelete = () => {
    if (idDelete != null) {
      setLoading(true)
      setErrorMessage('')

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      axios
        .delete(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/delete/${idDelete}`,
          config
        )
        .then(() => {
          toast.success('Deleted successfully')
          setIdDelete(null)
          setReload(reload + 1)
        })
        .catch(error => {
          setErrorMessage(`lỗi trong quá trình xóa ... (${error.message})`)
          toast.error(error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <Card>
      <CardHeader titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <CustomTextField
                  value={value}
                  sx={{ mr: 2 }}
                  placeholder='Search schedule'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton>
                          <Icon icon='tabler:search' />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onChange={e => handleFilter(e.target.value)}
                />
                <Button variant='contained' onClick={() => handleExport()}>
                  <Icon icon='tabler:file-arrow-right' />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>NO.</TableCell>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} align='center'>
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : errorMessage ? (
                    <TableRow>
                      <TableCell style={{ color: 'red' }} colSpan={columns.length + 2} align='center'>
                        Error: {errorMessage}
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} align='center'>
                        Data is not available
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.slice(0, pageSize).map((row, index) => (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                        {columns.map(column => {
                          const value = row[column.field]

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          )
                        })}
                        <TableCell>
                          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton
                              size='small'
                              sx={{ color: 'text.secondary' }}
                              onClick={() => {
                                setIdView(row.id)
                                setIsOpenView(true)
                              }}
                            >
                              <Icon icon='tabler:info-circle' />
                            </IconButton>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {errorMessage.length > 0 && (
                <Box sx={{ color: 'red', textAlign: 'center', width: '100%' }}>
                  <Typography style={{ color: 'red' }} variant='body2'>
                    Error: {errorMessage}
                  </Typography>
                </Box>
              )}
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPage}
              page={page}
              onChange={(event, value) => handlePageChange(value)}
              variant='outlined'
              shape='rounded'
            />
          </Grid>
        </Grid>
      </CardContent>

      {/* Filter Dialog */}
      <Dialog open={isOpenFilter} onClose={() => setIsOpenFilter(false)}>
        <DialogContent>{/* Your filter form components */}</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenFilter(false)} color='primary'>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isOpenDel} onClose={() => setIsOpenDel(false)}>
        <DialogContent>
          <Typography>Do you want to delete it?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenDel(false)} color='primary'>
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      {isOpenView && (
        <View
          show={isOpenView}
          onClose={() => setIsOpenView(false)}
          id={idView}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </Card>
  )
}

export default AccessRight
