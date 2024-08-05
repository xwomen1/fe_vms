import React, { Fragment, useEffect, useState, useCallback } from 'react'
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
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import Checkbox from '@mui/material/Checkbox'
import Link from 'next/link'
import { format } from 'date-fns'

const FaceManagement = () => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false)
  const [listImage, setListImage] = useState([])
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)

  const pageSizeOptions = [25, 50, 100]

  const initValueFilter = {
    keyword: '',
    limit: 25,
    page: 1
  }

  const [valueFilter, setValueFilter] = useState(initValueFilter)

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

  useEffect(() => {
    const atLeastOneSelected = selectedIds.length > 0

    setSelectAll(atLeastOneSelected)
  }, [selectedIds])

  const handleCheckboxChange = (event, id) => {
    const { checked } = event.target

    let updatedIds = [...selectedIds]
    if (checked && !updatedIds.includes(id)) {
      updatedIds.push(id)
    } else {
      updatedIds = updatedIds.filter(selectedId => selectedId !== id)
    }
    setSelectedIds(updatedIds)
    setIsDeleteDisabled(updatedIds.length === 0)
  }

  const handleSelectAllChange = event => {
    const { checked } = event.target

    const updatedIds = checked ? userData.map(user => user.id) : []

    setSelectedIds(updatedIds)
    setSelectAll(checked)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleDeleteSelected = () => {
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
        selectedIds.forEach(idDelete => {
          let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`
          axios
            .delete(urlDelete, config)
            .then(() => {
              setDialogTitle('Xóa khuân mặt thành công')
              setIsSuccess(true)
              const updatedData = userData.filter(user => user.id !== idDelete)
              setUserData(updatedData)
            })
            .catch(err => {
              setDialogTitle('xóa không thành công')
              setDialogMessage(err.message || 'xóa không thành công')
              setIsSuccess(false)
            })
            .finally(() => {
              setLoading(false)
              setDialogOpen(true)
            })
        })

        setSelectedIds([])
      }
    })
  }

  const exportToExcel = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: '',
          page: valueFilter.page,
          limit: valueFilter.limit
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/blacklist?sort=%2Bcreated_at&page=1',
        config
      )

      const data = response.data.map(item => ({
        mainImageId: item.mainImageId,
        name: item.name,
        time: item.time
      }))

      const exportData = [
        ['Mã ảnh', 'Tên', 'Lần cuối xuất hiện'],
        ...data.map(item => [item.mainImageId, item.name, item.time])
      ]

      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đen')

      const fileName = 'Danh sách đen.xlsx'
      XLSX.writeFile(wb, fileName)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

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
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
        actions: 'swal-actions'
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton()
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#ff9f43'
        }
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const fetchFilteredOrAllUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: value,
          page: valueFilter.page,
          limit: valueFilter.limit
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/blacklist?sort=%2Bcreated_at&page=1',
        config
      )
      if (response?.data && response?.data.length > 0) {
        setUserData(response?.data)
        const imageFaces = response?.data[0].mainImageUrl
        setListImage(imageFaces)
      } else {
        setUserData([])
        setListImage(null)
      }
    } catch (error) {
      console.error('Error fetching datas:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilteredOrAllUsers()
  }, [page, pageSize, total, value])

  const handleDelete = idDelete => {
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
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Thành công!',
              text: 'Xóa dữ liệu thành công',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#FF9F43'
                  confirmButton.style.color = 'white'
                }
              }
            })
            const updatedData = userData.filter(user => user.id !== idDelete)
            setUserData(updatedData)
          })
          .catch(err => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || err.message,
              icon: 'error',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#FF9F43'
                  confirmButton.style.color = 'white'
                }
              }
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    })
  }

  const buildUrlWithToken = url => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    if (token) {
      return `${url}?token=${token}`
    }

    return url
  }

  const Img = React.memo(props => {
    const [loaded, setLoaded] = useState(false)

    const { src } = props

    return (
      <>
        <div
          style={
            loaded
              ? { display: 'none' }
              : {
                  width: '100px',
                  height: '100px',
                  display: 'grid',
                  backgroundColor: '#C4C4C4',
                  placeItems: 'center'
                }
          }
        >
          <CircularProgress size={20} />
        </div>
        <img
          {...props}
          src={src}
          alt='Ảnh'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

  const formatDate = dateString => {
    const date = new Date(dateString)

    return format(date, 'hh:mm:ss dd/MM/yyyy')
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Danh sách khuôn mặt'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    aria-label='Xóa'
                    style={{
                      background: '#a9a9a9',
                      color: '#ffffff',
                      marginRight: '5px'
                    }}
                    disabled={isDeleteDisabled}
                    onClick={handleDeleteSelected}
                  >
                    <Icon icon='tabler:trash' />
                  </Button>
                  <Button
                    aria-label='export file'
                    style={{
                      background: '#a9a9a9',
                      color: '#ffffff',
                      marginRight: '5px'
                    }}
                    onClick={exportToExcel}
                  >
                    <Icon icon='tabler:file-export' />
                  </Button>
                  <Button variant='contained' style={{}} component={Link} href={`/pages/face_management/detail/add`}>
                    <Icon icon='tabler:plus' />
                    Thêm mới
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
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox onChange={handleSelectAllChange} checked={selectAll} />
                </TableCell>
                <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                <TableCell sx={{ padding: '16px' }}>Ảnh đối tượng</TableCell>
                <TableCell sx={{ padding: '16px' }}>Tên Đối tượng</TableCell>
                <TableCell sx={{ padding: '16px' }}>Lần cuối xuất hiện</TableCell>
                <TableCell sx={{ padding: '16px' }}>Loại đối tượng</TableCell>
                <TableCell sx={{ padding: '16px' }}>Trạng thái hoạt động </TableCell>
                <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <CircularProgress style={{ marginLeft: '20%' }} />}
              {Array.isArray(userData) && userData.length > 0 ? (
                userData.map(
                  (user, index) => (
                    console.log(user.status),
                    (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            onChange={event => handleCheckboxChange(event, user.id)}
                            checked={selectedIds.includes(user.id)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Img
                            src={buildUrlWithToken(
                              `https://sbs.basesystem.one/ivis/storage/api/v0/libraries/download/${user.mainImageId}`
                            )}
                            style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
                          />
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{formatDate(user.lastAppearance)}</TableCell>
                        <TableCell>Nhân viên</TableCell>
                        <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                          <div
                            style={{
                              backgroundColor:
                                user.status === true ? '#449D44' : user.status === false ? '#FF9F43' : '#FF9F43',
                              borderRadius: '10px',
                              padding: '5px 10px',
                              width: '70%',
                              display: 'inline-block',
                              color: 'white'
                            }}
                          >
                            {user.status === true
                              ? 'Đang hoạt động'
                              : user.status === false
                              ? 'Không hoạt động'
                              : user.status}
                          </div>
                        </TableCell>
                        {/* <TableCell
                          style={{
                            color: user.status ? '#FF9F43' : 'red'
                          }}
                        >
                          {user.status ? 'hoạt động' : 'không hoạt động'}
                        </TableCell> */}
                        <TableCell sx={{ padding: '16px' }}>
                          <IconButton component={Link} href={`/pages/face_management/detail/${user.id}`}>
                            <Icon icon='tabler:info-circle' />
                          </IconButton>

                          <IconButton onClick={() => handleDelete(user.id)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <br></br>
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
              <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default FaceManagement
