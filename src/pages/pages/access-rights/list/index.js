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
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import Filter from '../popups/filter'
import Add from '../popups/add'
import View from '../popups/view'
import Update from '../popups/Update'
import devices from 'devextreme/core/devices'

const AccessRight = () => {
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [dataList, setDataList] = useState([])
  const [dataList1, setDataList1] = useState([])
  const [page1, setPage1] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [idDelete, setIdDelete] = useState(null)
  const [scheduleId, setScheduleId] = useState(null)
  const [doorAccessId, setDoorAccessId] = useState(null)
  const [accessGroupId, setAccessGroupId] = useState(null)
  const [idView, setIdView] = useState(null)
  const [idUpdate, setIdUpdate] = useState(null)
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [rows, setRows] = useState([])

  const tabList = [
    {
      id: 'overview',
      value: 'Overview'
    },
    {
      id: 'setPermissions',
      value: 'Permission Setup'
    }
  ]

  const [tab, setTab] = useState(tabList[0].id)
  const [value, setValue] = useState('')
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const initValueFilter = {
    nameCalendar: value,
    limit: 25,
    page: 1,
    doorInId: null,
    doorOutId: null,
    groupId: null
  }
  const [valueFilter, setValueFilter] = useState(initValueFilter)

  const columns = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'nameCalendar',
      label: 'Schedule Name'
    },
    {
      id: 2,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'name',
      label: 'Full Name'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 100,
      align: 'center',
      label: 'Department',
      field: 'groupName'
    },
    {
      id: 4,
      flex: 0.15,
      minWidth: 200,
      align: 'center',
      field: 'doorInName',
      label: 'Door In'
    },
    {
      id: 5,
      flex: 0.15,
      minWidth: 200,
      align: 'center',
      field: 'doorOutName',
      label: 'Door Out'
    },
    {
      id: 6,
      flex: 0.15,
      type: 'date',
      minWidth: 130,
      align: 'center',
      label: 'Start Date',
      field: 'startDate',
      valueGetter: params => new Date(params.value)
    },
    {
      id: 7,
      flex: 0.15,
      type: 'date',
      minWidth: 130,
      align: 'center',
      label: 'End Date',
      field: 'endDate',
      valueGetter: params => new Date(params.value)
    }
  ]

  const columns1 = [
    {
      id: 1,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'nameCalendar',
      label: 'Schedule Name'
    },
    {
      id: 2,
      flex: 0.15,
      minWidth: 150,
      align: 'center',
      label: 'Department',
      field: 'groupName'
    },
    {
      id: 3,
      flex: 0.15,
      minWidth: 230,
      align: 'center',
      field: 'doorInName',
      label: 'Door In'
    },
    {
      id: 4,
      flex: 0.15,
      minWidth: 230,
      align: 'center',
      field: 'doorOutName',
      label: 'Door Out'
    },
    {
      id: 5,
      flex: 0.25,
      minWidth: 50,
      align: 'center',
      field: 'sizeUser',
      label: 'Number of People'
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
          limit: valueFilter.limit,
          doorInId: valueFilter.doorInId || '',
          doorOutId: valueFilter.doorOutId || '',
          groupId: valueFilter.groupId || ''
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/`,
        config
      )

      setDataList(response.data.rows)
    } catch (error) {
      console.error('Error fetching data3:', error.message)
      setErrorMessage(`Không có dữ liệu ... (${error.message})`)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

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
    fetchDataList1(page1, pageSize)
  }, [page1, pageSize])

  const fetchDataList1 = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          nameCalendar: value,
          page: page1,
          limit: pageSize,
          doorInId: valueFilter.doorInId || '',
          doorOutId: valueFilter.doorOutId || '',
          groupId: valueFilter.groupId || ''
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/`,
        config
      )

      setDataList1(response.data.rows)
      setTotal(response.data.totalPage)
    } catch (error) {
      console.error('Error fetching data3:', error.message)
      setErrorMessage(`Không có dữ liệu ... (${error.message})`)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPageSize1 = size => {
    setPageSize(size)
    setPage1(1)
    handleCloseMenu()
  }

  const handlePageChange1 = (event, newPage) => {
    setPage1(newPage)
  }

  useEffect(() => {
    handleSetRows()
  }, [dataList, pageSize, page, reload, value])

  useEffect(() => {
    fetchDataList()
    fetchDataList1()
  }, [])
  console.log(dataList1)
  useEffect(() => {
    if (tab === 'overview') {
      fetchDataList()
    }
    if (tab === 'setPermissions') {
      fetchDataList1()
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
    const excelData = dataList1.reduce((acc, row) => {
      if (row.calendarDays && Array.isArray(row.calendarDays)) {
        row.calendarDays.forEach(calendarDay => {
          acc.push({
            'Schedule Name': row.nameCalendar,
            Department: row.groupName,
            'Ngày trong tuần': calendarDay.dayOfWeek,
            'Giờ bắt đầu': calendarDay.timePeriods[0]?.startTimeInMinute,
            'Giờ kết thúc': calendarDay.timePeriods[0]?.endTimeInMinute,
            'Door In': row.doorInName,
            'Door Out': row.doorOutName,
            'Start Date': row.startDate,
            'End Date': row.endDate,
            'Number of People': row.sizeUser
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
            Confirm
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Are you sure you want to delete this?</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
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
          Ok
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
          toast.success('Deleted Successfully')
          setIdDelete(null)
          setReload(reload + 1)
        })
        .catch(error => {
          setErrorMessage(`Error During Deletion ... (${error.message})`)
          toast.error(error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }
  console.log(page1)

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              <Button variant='contained'>Access Permissions</Button>
            </>
          }
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'center' }}>
                  <IconButton
                    aria-label='import file'
                    color='primary'
                    disabled={tab === 'setPermissions' ? false : true}
                  >
                    <Icon icon='tabler:file-import' />
                  </IconButton>
                  <IconButton
                    aria-label='export file'
                    color='primary'
                    onClick={() => handleExport()}
                    disabled={tab === 'setPermissions' ? false : true}
                  >
                    <Icon icon='tabler:file-export' />
                  </IconButton>
                  <IconButton
                    aria-label='Thêm mới'
                    color='primary'
                    onClick={() => {
                      setIsOpenAdd(true)
                    }}
                    disabled={tab === 'setPermissions' ? false : true}
                  >
                    <Icon icon='tabler:square-plus' />
                  </IconButton>
                  <IconButton
                    aria-label='Bộ lọc'
                    onClick={() => {
                      setIsOpenFilter(true)
                    }}
                    color='primary'
                  >
                    <Icon icon='tabler:filter' />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  value={value}
                  onChange={e => handleFilter(e.target.value)}
                  placeholder='Search…'
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear'>
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
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
        />
        <TabContext value={tab}>
          <TabList
            variant='scrollable'
            scrollButtons={false}
            onChange={handleTabsChange}
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, '& .MuiTab-root': { py: 3.5 } }}
          >
            {tabList.map((item, index) => (
              <Tab key={index} value={item.id} label={item.value} />
            ))}
          </TabList>
          <CardContent>
            <TabPanel sx={{ p: 0 }} value='overview'>
              <Grid container spacing={0}>
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                  <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
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
                            No Data Available
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
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1}>
                  <span style={{ fontSize: 15 }}> line/page</span>
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
                    count={totalPage}
                    page={page}
                    color='primary'
                    onChange={(event, page) => handlePageChange(page)}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='setPermissions'>
              <Grid container spacing={2}>
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        {columns1.map(column => (
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
                          <TableCell colSpan={columns1.length + 2} align='center'>
                            Loading data...
                          </TableCell>
                        </TableRow>
                      ) : errorMessage ? (
                        <TableRow>
                          <TableCell style={{ color: 'red' }} colSpan={columns1.length + 2} align='center'>
                            Error: {errorMessage}
                          </TableCell>
                        </TableRow>
                      ) : dataList1.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns1.length + 2} align='center'>
                            No Data Available
                          </TableCell>
                        </TableRow>
                      ) : (
                        dataList1.slice(0, pageSize).map((row, index) => (
                          <TableRow hover tabIndex={-1} key={row.id}>
                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                            {columns1.map(column => {
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
                                <IconButton
                                  onClick={() => {
                                    setIdDelete(row.id)
                                    setIsOpenDel(true)
                                  }}
                                >
                                  <Icon icon='tabler:trash' />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setIdUpdate(row.id)
                                    setScheduleId(row.scheduleId)
                                    setDoorAccessId(row.doorAccessId)
                                    setAccessGroupId(row.accessGroupId)
                                    setIsOpenUpdate(true)
                                  }}
                                >
                                  <Icon icon='tabler:edit' />
                                </IconButton>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1}>
                  <span style={{ fontSize: 15 }}> line/page</span>
                </Grid>
                <Grid item xs={1} style={{ padding: 0 }}>
                  <Box>
                    <Button onClick={handleOpenMenu} endIcon={<Icon icon='tabler:selector' />}>
                      {pageSize}
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                      {pageSizeOptions.map(size => (
                        <MenuItem key={size} onClick={() => handleSelectPageSize1(size)}>
                          {size}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Pagination count={total} color='primary' page={page1} onChange={handlePageChange1} />
                </Grid>
              </Grid>
            </TabPanel>
          </CardContent>
        </TabContext>
      </Card>

      {isOpenFilter && (
        <Filter
          valueFilter={valueFilter}
          show={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          callback={handleSetValueFilter}
        />
      )}

      {isOpenAdd && (
        <Add show={isOpenAdd} onClose={() => setIsOpenAdd(false)} setReload={() => setReload(reload + 1)} />
      )}

      {isOpenDel && DeleteView()}

      {isOpenView && (
        <View
          show={isOpenView}
          onClose={() => setIsOpenView(false)}
          id={idView}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {isOpenUpdate && (
        <Update
          show={isOpenUpdate}
          onClose={() => setIsOpenUpdate(false)}
          idScheduleId={scheduleId}
          idDoorAccessId={doorAccessId}
          idAccessGroupId={accessGroupId}
          id={idUpdate}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </>
  )
}

export default AccessRight
