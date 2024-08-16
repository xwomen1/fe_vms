import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Button, CardHeader, IconButton } from '@mui/material'
import Swal from 'sweetalert2'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import Add from './popup/add'
import Edit from './popup/edit'
import toast from 'react-hot-toast'
import Filter from './popup/filter'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [assettype, setAssetType] = useState([])
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [assetId, setAssetId] = useState(null)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [openPopupEdit, setOpenPopupEdit] = useState(false)
  const [openPopupFilter, setOpenPopupFilter] = useState(false)

  const handleAddFilterClick = (groupIds, groupName) => {
    setOpenPopupFilter(true)
  }

  const handleCloseFilterPopup = () => {
    setOpenPopupFilter(false)
  }

  const handleAddPClick = (groupIds, groupName) => {
    setOpenPopupP(true)
  }

  const handleClosePPopup = () => {
    setOpenPopupP(false)
  }

  const handleEditClick = (id, groupName) => {
    setOpenPopupEdit(true)
    setAssetId(id)
  }

  const handleCloseEditPopup = () => {
    setOpenPopupEdit(false)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleSearch = () => {
    setPage(1)
    fetchDataAsset()
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
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#FF9F43'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPage(1)
    setPageSize(size)
    handleCloseMenu()
  }

  //todoHue: 30/7/2024:BE thiếu status

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
        let urlDelete = ` https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/delete/${idDelete}`
        axios
          .delete(urlDelete)
          .then(() => {
            const updatedData = assettype.filter(assettype => assettype.id !== idDelete)
            setAssetType(updatedData)
            fetchDataAsset()
            toast.success('Xoá thành công')
          })
          .catch(err => {
            console.error('Error moving group:', err)
            toast.error(err?.response?.data || 'Thất bại')
          })
      }
    })
  }

  const fetchDataAsset = async (filteredParams = null) => {
    if (filteredParams) {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            ...filteredParams,
            limit: pageSize,
            page: page,
            keyword: value
          }
        }

        const response = await axios.get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/asset/`, config)

        setAssetType(response.data.rows)
        setTotal(response.data.totalPage)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    } else {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: pageSize,
            page: page,
            keyword: value
          }
        }

        const response = await axios.get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/asset/`, config)

        setAssetType(response.data.rows)
        setTotal(response.data.totalPage)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
  }
  useEffect(() => {
    fetchDataAsset()
  }, [page, pageSize])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <>
                <Button variant='contained'>Danh sách tài sản</Button>
              </>
            }
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
                  {' '}
                  <Button variant='contained' style={{ margin: '0px 2px' }} onClick={handleAddFilterClick}>
                    <Icon fontSize='1.25rem' icon='tabler:filter' />
                  </Button>
                </Grid>
                <Grid item>
                  {' '}
                  <Button variant='contained' style={{ margin: '0px 2px' }} onClick={handleAddPClick}>
                    <Icon fontSize='1.25rem' icon='tabler:plus' />
                  </Button>
                </Grid>
                <Grid item>
                  <CustomTextField
                    placeholder='Nhập tên  ...! '
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size='small'
                          title='Clear'
                          aria-label='Clear'
                          onClick={() => {
                            setValue('')
                            fetchDataAsset()
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
                  <Button variant='contained' style={{ margin: '0px 2px' }} onClick={handleSearch}>
                    <Icon fontSize='1.25rem' icon='tabler:search' />
                  </Button>
                </Grid>
              </Grid>
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Mã tài sản</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên tài sản</TableCell>
                    <TableCell sx={{ padding: '16px' }}>S/N</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Mô tả</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Loại tài sản</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Bãi đỗ xe</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trạng thái kích hoạt</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assettype.map((assetType, index) => (
                    <TableRow key={assetType.id}>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType?.code}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType?.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType?.codeSN}</TableCell>

                      <TableCell sx={{ padding: '16px' }}>{assetType?.detail}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType?.assetType?.name}</TableCell>

                      <TableCell sx={{ padding: '16px' }}>{assetType?.parking?.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {' '}
                        {assetType.status === 'ACTIVE' ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <Grid container spacing={2}>
                          <IconButton
                            size='small'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => handleEditClick(assetType.id)}
                          >
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(assetType.id)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1.5} style={{ padding: 0 }}>
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
                </Grid>
                <Grid item xs={6}>
                  <Pagination count={total} color='primary' page={page} onChange={handlePageChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {openPopupP && (
        <>
          <Add open={openPopupP} onClose={handleClosePPopup} fetchGroupData={fetchDataAsset} />
        </>
      )}
      {openPopupEdit && (
        <>
          <Edit open={openPopupEdit} onClose={handleCloseEditPopup} fetchGroupData={fetchDataAsset} assetId={assetId} />
        </>
      )}
      {openPopupFilter && (
        <>
          <Filter open={openPopupFilter} onClose={handleCloseFilterPopup} fetchGroupData={fetchDataAsset} />
        </>
      )}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
