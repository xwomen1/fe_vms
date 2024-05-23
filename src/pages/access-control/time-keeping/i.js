import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import IconButton from '@mui/material/IconButton'
import Swal from 'sweetalert2'
import axios from 'axios'
import TableHeader from 'src/views/apps/event-management/index'
import { format } from 'date-fns'
import authConfig from 'src/configs/auth'
import Icon from 'src/@core/components/icon'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [assettype, setAssetType] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const showAlertConfirm = (options, intl) => {
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
      }
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
    setPageSize(size)
    setPage(1) // Reset to the first page when the page size changes
    handleCloseMenu()
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const formatDate = date => format(new Date(date), 'yyyy-MM-dd hh:mm:ss')

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        const offset = (page - 1) * pageSize

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: pageSize,
            keyword: value,
            page: page
          }
        }

        const response = await axios.get(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/event/user/door',
          config
        )

        setAssetType(response.data.data)
        setTotalPages(Math.ceil(response.data.count / pageSize)) // Round up the totalPages
        console.log(Math.ceil(response.data.count / pageSize))
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [page, pageSize, value, assettype])

  const calculateTotalTime = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diff = endDate - startDate

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours}h ${minutes}m ${seconds}s`
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên nhân viên</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Thời gian vào</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Cửa vào</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Thời gian ra</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Cửa ra</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tổng thời gian</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Mã định danh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assettype.map((assetType, index) => (
                    <TableRow key={assetType.user_id}>
                      <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.userName}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{formatDate(assetType.timeMin)}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.doorIn}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{formatDate(assetType.timeMax)}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.doorOut}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        {calculateTotalTime(assetType.timeMin, assetType.timeMax)}
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.accessCode}</TableCell>
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
                    <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
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
                  <Pagination count={totalPages} color='primary' page={page} onChange={handlePageChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
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
