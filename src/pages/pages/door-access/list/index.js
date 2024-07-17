import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
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
import UpdateDoor from '../detail/DoorAccessUpdate'
import Add from '../detail/add'

const DoorAccess = () => {
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [idUpdate, setIdUpdate] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  useEffect(() => {
    fetchDataList()
  }, [reload, page, pageSize])

  const handlePageChange = (event, newPage) => {
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

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: pageSize
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses/`,
        config
      )

      setDataList(
        response.data.rows.map(item => ({
          ...item,
          doorGroupName: item.policies.map(policy => policy.doorGroupName).join(', ') // Lấy tất cả doorGroupName và nối thành chuỗi
        }))
      )
      setTotal(response.data.totalPage)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Grid>
        <Button variant='contained'> Danh sách quản lý truy cập cửa</Button>
      </Grid>
      <br></br>
      <Card>
        <CardHeader
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
                <Box sx={{ float: 'right' }}>
                  <Button
                    onClick={() => {
                      setIsOpenAdd(true)
                    }}
                    aria-label='Thêm mới'
                    variant='contained'
                  >
                    thêm mới
                    <Icon icon='tabler:plus' />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          }
        />
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                <TableCell sx={{ padding: '16px' }}>Tên</TableCell>
                <TableCell sx={{ padding: '16px' }}>Mô tả</TableCell>
                <TableCell sx={{ padding: '16px' }}>Cửa</TableCell>
                <TableCell sx={{ padding: '16px' }}>Lịch</TableCell>
                <TableCell sx={{ padding: '16px' }}>Người cập nhật</TableCell>
                <TableCell sx={{ padding: '16px' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(dataList) && dataList.length > 0 ? (
                dataList.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Button
                        size='small'
                        onClick={() => {
                          setIdUpdate(user.id)
                          setIsOpenUpdate(true)
                        }}
                        sx={{ color: 'blue', right: '10px' }}
                      >
                        {user.name}
                      </Button>
                    </TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.doorGroupName}</TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.lastUpdatedByUser?.fullName}</TableCell>
                    <TableCell>
                      {' '}
                      <Box>
                        <Button
                          onClick={() => {
                            setIdUpdate(user.id)
                            setIsOpenUpdate(true)
                          }}
                        >
                          <Icon icon='tabler:edit' />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
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
            <Grid item xs={1.5} style={{ padding: 0, marginLeft: '12%' }}>
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
              <Pagination
                count={total}
                color='primary'
                page={page}
                onChange={(event, newPage) => handlePageChange(event, newPage)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
      {isOpenUpdate && (
        <UpdateDoor
          show={isOpenUpdate}
          onClose={() => setIsOpenUpdate(false)}
          id={idUpdate}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {isOpenAdd && (
        <Add show={isOpenAdd} onClose={() => setIsOpenAdd(false)} setReload={() => setReload(reload + 1)} />
      )}
    </>
  )
}

export default DoorAccess
