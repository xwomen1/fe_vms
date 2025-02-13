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
import { CircularProgress } from '@material-ui/core'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import Checkbox from '@mui/material/Checkbox'
import Link from 'next/link'
import { format } from 'date-fns'

const Car_management = () => {
  const [keyword, setKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [userData, setUserData] = useState([])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [listImage, setListImage] = useState([])
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
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
          let urlDelete = `https://votv.ivms.vn/votv/vms/api/v0/licenseplates/${idDelete}`
          axios
            .delete(urlDelete, config)
            .then(() => {
              setIsSuccess(true)
              const updatedData = userData.filter(user => user.id !== idDelete)
              setUserData(updatedData)
            })
            .catch(err => {
              toast.error(err.message)
              setIsSuccess(false)
            })
            .finally(() => {
              setLoading(false)
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

      const response = await axios.get('https://votv.ivms.vn/votv/vms/api/v0/licenseplates', config)

      const data = response.data.map(item => ({
        mainImageId: item.mainImageId,
        name: item.name,
        lastAppearance: formatDate(item.lastAppearance)
      }))

      const exportData = [
        ['Image code', 'License plate', 'Last seen'],
        ...data.map(item => [item.mainImageId, item.name, item.lastAppearance])
      ]

      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'license plate list')

      const fileName = 'license_plate_list.xlsx'
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
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: value,
          page: page,
          limit: pageSize
        }
      }

      const response = await axios.get(
        'https://votv.ivms.vn/votv/vms/api/v0/licenseplates?sort=%2Bcreated_at&page=1',
        config
      )
      if (response.data && response.data.length > 0) {
        setUserData(response.data)
        const imageFaces = response.data[0].mainImageUrl

        setListImage(imageFaces)
      } else {
        console.log('No data returned from the server.')
        setUserData([])
        setListImage(null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error)
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
        let urlDelete = `https://votv.ivms.vn/votv/vms/api/v0/licenseplates/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Successfully!',
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

  const formatDate = dateString => {
    const date = new Date(dateString)

    return format(date, 'hh:mm:ss ')
  }

  const handlePageChange = newPage => {
    setPage(newPage)
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card>
          <CardHeader
            title='List of license plates'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            action={
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ float: 'right' }}>
                    <Button
                      aria-label='Delete'
                      style={{
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
                        marginRight: '5px'
                      }}
                      variant='contained'
                      onClick={exportToExcel}
                    >
                      <Icon icon='tabler:file-export' />
                    </Button>
                    <Button variant='contained' component={Link} href={`/pages/car_management/detail/add`}>
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
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
          />
          <CardContent>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox onChange={handleSelectAllChange} checked={selectAll} />
                    </TableCell>
                    <TableCell align='center'>NO.</TableCell>
                    <TableCell align='center'>Vehicle Photo</TableCell>
                    <TableCell align='center'>License plate number</TableCell>
                    <TableCell align='center'>Vehicle Type</TableCell>
                    <TableCell align='center'>Last seen</TableCell>
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
                          {user && user.mainImageId.length > 0 ? (
                            <Img
                              src={user.mainImageUrl}
                              style={{ maxWidth: '91px', height: '56px', minWidth: '56px' }}
                            />
                          ) : (
                            <Img
                              src={`data:image/svg+xml;utf8,${encodeURIComponent(MaskGroup)}`}
                              alt='Placeholder Image'
                            />
                          )}
                        </TableCell>
                        <TableCell align='center'>{user.name}</TableCell>
                        <TableCell align='center'>{user.vehicleType}</TableCell>

                        <TableCell align='center'>{formatDate(user.lastAppearance)}</TableCell>
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
                          <IconButton component={Link} href={`/pages/car_management/detail/${user.id}`}>
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
          </CardContent>
        </Card>
      )}
    </>
  )
}

const MaskGroup = `<svg width="21" height="23" viewBox="0 0 193 173" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M176.833 147.216C154.238 134.408 126.747 128.909 123.96 120.697C121.173 112.485 120.571 104.423 123.132 98.3208C125.692 92.2183 128.705 92.9717 130.211 86.1911C130.211 86.1911 133.977 86.9445 136.99 82.4242C140.003 77.9038 140.756 70.3698 140.756 66.6029C140.756 62.8359 135.484 60.5757 135.484 60.5757C135.484 60.5757 140.756 46.2612 137.743 31.9467C134.73 17.6322 124.939 -0.449244 92.553 1.05755V1.28356C66.1168 2.71501 57.6813 18.9883 54.8945 32.1727C51.8819 46.4872 57.1541 60.8017 57.1541 60.8017C57.1541 60.8017 51.8819 63.0619 51.8819 66.8289C51.8819 70.5959 52.635 78.1298 55.6477 82.6502C58.6604 87.1705 62.4262 86.4171 62.4262 86.4171C63.9326 93.1977 66.9453 92.4443 69.506 98.5468C72.0668 104.649 71.4643 112.786 68.6775 120.923C65.8908 129.059 38.4001 134.634 15.8051 147.442C-6.79001 160.25 -4.5305 173.058 -4.5305 173.058L197.319 172.907C197.168 172.831 199.428 160.024 176.833 147.216Z" fill="#797979"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="202" height="172" fill="white" transform="translate(-4.75635 0.982422)"/>
</clipPath>
</defs>
</svg>
`

export default Car_management
