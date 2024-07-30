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
  MenuItem,
  CardActions,
  CardContent,
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
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'
import Edit from './popups/Update'
import Filter from './popups/filter'
import Add from './popups/add'
import Swal from 'sweetalert2'

const Vehicle = () => {
  const pageSizeOptions = [25, 50, 100]
  const [reload, setReload] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [total, setTotal] = useState(1)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [assetId, setAssetId] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const initValueFilter = {
    event_name: searchKeyword,
    page: page,
    limit: pageSize,
    brandId: null,
    parkingId: null,
    status: ''
  }

  const [valueFilter, setValueFilter] = useState(initValueFilter)

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
      },
      confirmButtonColor: '#FF9F43'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  useEffect(() => {
    fetchDataList()
  }, [page, pageSize, reload, valueFilter])

  const fetchDataList = useCallback(async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          plateNumber: searchKeyword,
          parkingId: valueFilter.parkingId,
          brandId: valueFilter.brandId,
          status: valueFilter.status,
          page: page,
          limit: pageSize
        }
      }
      const response = await axios.get('https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/', config)
      setData(response.data?.rows || [])
      setTotal(response.data?.totalPage || 1)
    } catch (error) {
      console.error('Error :', error)
    }
  }, [page, pageSize, searchKeyword, valueFilter])

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

  const handleSearch = () => {
    setPage(1)
    fetchDataList()
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleCloseEditPopup = () => {
    setIsOpenUpdate(false)
  }

  const handleCloseAddPopup = () => {
    setIsOpenAdd(false)
  }

  const handleCloseFilterPopup = () => {
    setIsOpenFilter(false)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleEdit = id => {
    setIsOpenUpdate(true)
    setAssetId(id)
  }

  const handleDelete = id => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa không ?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const urlDelete = `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/delete/${id}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            Swal.fire({
              title: 'Thành công!',
              text: 'Xóa thành công',
              icon: 'success',
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton()
                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#FF9F43'
                  confirmButton.style.color = 'white'
                }
              }
            })

            const updatedData = data.filter(data => data.id !== id)
            setData(updatedData)
            fetchDataList()
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
      }
    })
  }

  const columns = [
    { id: 1, flex: 0.25, minWidth: 50, align: 'left', field: 'plateNumber', label: 'Biển kiểm soát' },
    { id: 2, flex: 0.15, minWidth: 150, align: 'left', field: 'vehicleType.name', label: 'Loại phương tiện' },
    { id: 3, flex: 0.15, minWidth: 100, align: 'left', field: 'brandName', label: 'Hãng' },
    { id: 4, flex: 0.15, minWidth: 100, align: 'left', field: 'detail', label: 'Mô tả' },
    { id: 5, flex: 0.25, minWidth: 50, align: 'left', field: 'parking.0.codeParking', label: 'Mã thuê bao' },
    { id: 6, flex: 0.25, minWidth: 50, align: 'left', field: 'parking.0.codeParking', label: 'Mã thẻ' },
    { id: 7, flex: 0.25, minWidth: 50, align: 'left', field: 'status', label: 'Trạng thái kích hoạt' },
    { id: 8, flex: 0.25, minWidth: 50, align: 'left', label: 'Hành động' }
  ]

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <CardHeader
          title={<Button variant='contained'>Danh sách phương tiện</Button>}
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Button variant='contained' onClick={() => setIsOpenAdd(true)}>
                  <Icon fontSize='1.25rem' icon='tabler:plus' />
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained' onClick={() => setIsOpenFilter(true)}>
                  <Icon fontSize='1.25rem' icon='tabler:filter' />
                </Button>
              </Grid>
              <Grid item>
                <CustomTextField
                  placeholder='Nhập tên phương tiện ...! '
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
                <Button variant='contained' sx={{ ml: 2 }} onClick={handleSearch}>
                  Tìm kiếm <Icon fontSize='1.25rem' icon='tabler:search' />
                </Button>
              </Grid>
            </Grid>
          }
        />
        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
          <TableContainer component={Paper} sx={{ minHeight: 400 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                      {columns.slice(0, -1).map(column => {
                        const value = column.field
                          .split('.')
                          .reduce((o, i) => (o && o[i] !== undefined ? o[i] : ''), row)

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            handleEdit(row.id)
                          }}
                        >
                          <Icon fontSize='1.25rem' icon='tabler:edit' />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.id)}>
                          <Icon fontSize='1.25rem' icon='tabler:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align='center'>
                      Không có dữ liệu ...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <CardActions sx={{ backgroundColor: 'white', padding: 2 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={4} sx={{ textAlign: 'right', mb: 1 }}>
              <span style={{ fontSize: 15 }}>Dòng/trang</span>
            </Grid>
            <Grid item xs={12} sm={1}>
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <Pagination count={total} page={page} color='primary' onChange={handlePageChange} />
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      {isOpenUpdate && (
        <>
          <Edit
            open={isOpenUpdate}
            setReload={() => setReload(reload + 1)}
            onClose={handleCloseEditPopup}
            id={assetId}
          />
        </>
      )}
      {isOpenAdd && (
        <>
          <Add open={isOpenAdd} setReload={() => setReload(reload + 1)} onClose={handleCloseAddPopup} />
        </>
      )}
      {isOpenFilter && (
        <>
          <Filter
            open={isOpenFilter}
            valueFilter={valueFilter}
            onClose={handleCloseFilterPopup}
            callback={handleSetValueFilter}
          />
        </>
      )}
    </>
  )
}

export default Vehicle
