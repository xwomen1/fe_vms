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

import Filter from '../popups/filter'

import View from '../popups/view'

const AccessRight = () => {
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)

  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const [isOpenView, setIsOpenView] = useState(false)

  const [dataList, setDataList] = useState([])

  const [errorMessage, setErrorMessage] = useState('')

  const [idView, setIdView] = useState(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [rows, setRows] = useState([])
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

  const fetchDataList = async () => {
    setLoading(true)
    setErrorMessage('')
    let allData = []
    let currentPage = 1
    const limit = valueFilter.limit || 25

    try {
      while (true) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            nameCalendar: value,
            page: currentPage,
            limit: limit,
            doorInId: valueFilter.doorInId || '',
            doorOutId: valueFilter.doorOutId || '',
            groupId: valueFilter.groupId || ''
          }
        }

        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/`,
          config
        )

        const fetchedData = response.data.rows
        if (fetchedData.length === 0) {
          break
        }
        allData = [...allData, ...fetchedData]
        currentPage++
        if (fetchedData.length < limit) {
          break
        }
      }

      setDataList(allData)
    } catch (error) {
      console.error('Error fetching data:', error.message)
      setErrorMessage(`Không có dữ liệu ... (${error.message})`)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  console.log(dataList, 'dataList')
  console.log(rows, 'rows')

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleSetRows = () => {
    let modifiedData = []
    let totalRecords = 0
    let totalPages = 0

    totalRecords = dataList.reduce((acc, curr) => acc + curr.users.length, 0)
    console.log(totalRecords, 'totalRecords')

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
  }, [reload, valueFilter, value])

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

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'center' }}>
                  <IconButton aria-label='import file' disabled color='primary'>
                    <Icon icon='tabler:file-import' />
                  </IconButton>
                  <IconButton aria-label='export file' disabled color='primary'>
                    <Icon icon='tabler:file-export' />
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
                  <Button variant='contained' aria-label='Add' color='primary' disabled>
                    Add
                  </Button>
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
                      <IconButton
                        size='small'
                        title='Clear'
                        aria-label='Clear'
                        onClick={() => {
                          setValue('') // Đặt giá trị thành '' khi bấm vào biểu tượng x
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

        <CardContent>
          <Grid container spacing={0}>
            <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
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
              <Pagination
                count={totalPage}
                page={page}
                color='primary'
                onChange={(event, page) => handlePageChange(page)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isOpenFilter && (
        <Filter
          valueFilter={valueFilter}
          show={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          callback={handleSetValueFilter}
        />
      )}

      {isOpenView && (
        <View
          show={isOpenView}
          onClose={() => setIsOpenView(false)}
          id={idView}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </>
  )
}

export default AccessRight
