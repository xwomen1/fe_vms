import React, { useEffect, useState, useCallback, Fragment } from 'react'
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
  DialogTitle
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
import FileSaver from 'file-saver'

// ** MUI Imports
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// ** Icon Imports

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import Swal from 'sweetalert2'

const AccessRight = () => {
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenDel, setIsOpenDel] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)

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
  const [value, setValue] = useState('')
  const [files, setFiles] = useState([])
  const [openImportDialog, setOpenImportDialog] = useState(false)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false)
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  })

  const renderFilePreview = file => {
    return <Icon icon='tabler:file-spreadsheet' fontSize='1.75rem' />
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handleUploadFiles = async () => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('file', file)
    })

    try {
      const response = await axios.post(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/calendar/configuration/import-calendar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('Upload Successfully:', response.data)
      setOpenImportDialog(false)
      fetchFilteredOrAllUsers()
      Swal.fire({
        title: 'Successful!',
        text: 'Import Successful',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } catch (error) {
      console.error('Lỗi khi upload:', error)
      setOpenImportDialog(false)
      Swal.fire({
        title: 'Error!',
        text: error?.response.data?.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    }
  }

  const initValueFilter = {
    nameCalendar: value,
    limit: 25,
    page: 1,
    doorInId: null,
    doorOutId: null,
    groupId: null
  }
  const [valueFilter, setValueFilter] = useState(initValueFilter)

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

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

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
    fetchDataList1()
  }, [reload, valueFilter, value])

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
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

  const downloadFileExample = () => {
    const url = `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/download/91860e30-15c4-466d-acdc-e7d5439ea6ec`

    axios
      .get(url, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        FileSaver.saveAs(blob, 'access-permision.xlsx')
      })
      .catch(err => {
        console.error('Error downloading the file', err)
      })
  }

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

  const hasFilterData = () => {
    return valueFilter.doorInId || valueFilter.doorOutId || valueFilter.groupId
  }

  const importValue = () => {
    setOpenImportDialog(true)
  }

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'center' }}>
                  <Button variant='contained' sx={{ '& svg': { mr: 1 }, mr: 1 }}>
                    <a style={{ 'font-weight': 'initial', 'margin-left': 10 }} onClick={downloadFileExample}>
                      Download sample file
                    </a>{' '}
                  </Button>
                  <IconButton aria-label='import file' color='primary'>
                    <Icon icon='tabler:file-arrow-left' onClick={() => importValue()} />
                  </IconButton>
                  <IconButton aria-label='export file' color='primary' onClick={() => handleExport()}>
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
                  <Button
                    variant='contained'
                    aria-label='Add'
                    color='primary'
                    onClick={() => {
                      setIsOpenAdd(true)
                    }}
                    disabled={hasFilterData()}
                  >
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
          <Grid container spacing={2}>
            <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell>NO.</TableCell>
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

            <Grid item xs={1} style={{ padding: 0 }}>
              <Box>
                <IconButton onClick={handleOpenMenu}>
                  <Icon icon='tabler:selector' />
                  <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                </IconButton>
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
        </CardContent>
      </Card>
      <Dialog open={openImportDialog} onClose={handleCloseImportDialog}>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          {/* Thêm nội dung hoặc thành phần upload file ở đây */}
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Box
                sx={{
                  mb: 8.75,
                  width: 48,
                  height: 48,
                  display: 'flex',
                  borderRadius: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                }}
              >
                <Icon icon='tabler:upload' fontSize='1.75rem' />
              </Box>
              <Typography variant='h4' sx={{ mb: 2.5 }}>
                Drop files here or click to upload.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>(Only Excel files are accepted)</Typography>
            </Box>
          </div>
          {files.length ? (
            <Fragment>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='outlined' onClick={handleRemoveAllFiles} style={{ marginRight: 30 }}>
                  Remove All
                </Button>
                <Button variant='contained' onClick={handleUploadFiles} style={{ marginRight: 30 }}>
                  Upload Files
                </Button>
                <Button variant='contained' onClick={handleCloseImportDialog}>
                  Close
                </Button>
              </div>
            </Fragment>
          ) : null}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
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
