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
import CustomChip from 'src/@core/components/mui/chip'
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
  const [dialogTitle, setDialogTitle] = useState('')
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
    console.log(id, 'id,id')

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

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleDeleteSelected = () => {
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
        selectedIds.forEach(idDelete => {
          let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`
          axios
            .delete(urlDelete, config)
            .then(() => {
              setDialogTitle('Deleted Successfully')
              const updatedData = userData.filter(user => user.id !== idDelete)
              setUserData(updatedData)
            })
            .catch(err => {
              setDialogTitle('Delete failed')
            })
            .finally(() => {
              setLoading(false)
            })
        })

        setSelectedIds([])
      }
    })
  }

  const formatDate = dateString => {
    const date = new Date(dateString)

    return format(date, 'hh:mm:ss dd/MM/yyyy')
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
        lastAppearance: formatDate(item.lastAppearance),
        status: item.status
      }))

      const exportData = [
        ['Image Code', 'Name', 'Last seen', 'Status'],
        ...data.map(item => [item.mainImageId, item.name, item.lastAppearance, item.status])
      ]

      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Blacklist')

      const fileName = 'blacklist.xlsx'
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
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
        actions: 'swal-actions'
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton()
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#002060'
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
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/blacklist/${idDelete}`
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
                  confirmButton.style.backgroundColor = '#002060'
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
          alt='Image'
          onLoad={() => setLoaded(true)}
          style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
        />
      </>
    )
  })

  return (
    <>
      <Card>
        <CardHeader
          title='Face List'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    aria-label='Delete'
                    style={{
                      color: '#ffffff',
                      marginRight: '5px'
                    }}
                    variant='contained'
                    disabled={isDeleteDisabled}
                    onClick={handleDeleteSelected}
                  >
                    <Icon icon='tabler:trash' />
                  </Button>
                  <Button
                    aria-label='export file'
                    style={{
                      color: '#ffffff',
                      marginRight: '5px'
                    }}
                    variant='contained'
                    onClick={exportToExcel}
                  >
                    <Icon icon='tabler:file-export' />
                  </Button>
                  <Button variant='contained' style={{}} component={Link} href={`/pages/face_management/detail/add`}>
                    <Icon icon='tabler:plus' />
                    Add new
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
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 9999
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <Checkbox onChange={handleSelectAllChange} checked={selectAll} />
                  </TableCell>
                  <TableCell align='center'>NOs.</TableCell>
                  <TableCell align='center'>Object Image</TableCell>
                  <TableCell align='center'>Object Name</TableCell>
                  <TableCell align='center'>Last seen</TableCell>
                  <TableCell align='center'>Object Type</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell align='center'>
                        <Checkbox
                          onChange={event => handleCheckboxChange(event, user.id)}
                          checked={selectedIds.includes(user.id)}
                        />
                      </TableCell>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>
                        <Img src={user.mainImageUrl} style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }} />
                      </TableCell>
                      <TableCell align='center'>{user.name}</TableCell>
                      <TableCell align='center'>{formatDate(user.lastAppearance)}</TableCell>
                      <TableCell align='center'>Staff</TableCell>
                      <TableCell align='center'>
                        <div>
                          <CustomChip
                            rounded
                            size='small'
                            skin='light'
                            sx={{ lineHeight: 1 }}
                            label={user.status === false ? 'Inactive' : 'Active'}
                            color={user.status === false ? 'primary' : 'success'}
                          />
                        </div>
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton component={Link} href={`/pages/face_management/detail/${user.id}`}>
                          <Icon icon='tabler:info-circle' />
                        </IconButton>

                        <IconButton onClick={() => handleDelete(user.id)}>
                          <Icon icon='tabler:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align='center'>
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
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
              <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default FaceManagement
