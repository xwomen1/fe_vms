import React, { useEffect, useState, useCallback } from 'react'
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
  CardContent,
  CardActions,
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
import UpdateSchedule from '../detail/scheduleUpdate'
import Add from '../detail/add'

const ScheduleAccess = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [idUpdate, setIdUpdate] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState(1) // Khởi tạo giá trị total
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [page, setPage] = useState(1) // Khởi tạo giá trị page

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  useEffect(() => {
    fetchDataList()
  }, [reload])

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

  useEffect(() => {
    fetchDataList() // Fetch lại dữ liệu khi page hoặc pageSize thay đổi
  }, [page, pageSize])

  const fetchDataList = useCallback(async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: searchKeyword,
          page: page,
          limit: pageSize
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules?`, config)

      setDataList(response.data.rows)
      setTotal(response.data.totalPage)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [token, page, pageSize, searchKeyword])

  const handleSearch = () => {
    setPage(1)
    fetchDataList()
  }

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <CardHeader
          title={
            <>
              <Button variant='contained'>Lịch hoạt động</Button>
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
                <CustomTextField
                  placeholder='Nhập tên lịch ...! '
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
                <Button variant='contained' style={{ marginLeft: '10px' }} onClick={handleSearch}>
                  Tìm kiếm <Icon fontSize='1.25rem' icon='tabler:search' />
                </Button>
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'right' }}>
                  <Button aria-label='Thêm mới' variant='contained' onClick={() => setIsOpenAdd(true)}>
                    thêm mới
                    <Icon icon='tabler:plus' />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          }
        />
        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
          <Table>
            <TableHead style={{ background: '#F6F6F7' }}>
              <TableRow>
                <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                <TableCell sx={{ padding: '16px' }}>Tên</TableCell>
                <TableCell sx={{ padding: '16px' }}>Mô tả</TableCell>
                <TableCell sx={{ padding: '16px' }}>Người tạo</TableCell>
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
                        onClick={() => {
                          setIdUpdate(user.id)
                          setIsOpenUpdate(true)
                        }}
                        size='small'
                        sx={{ color: 'blue' }}
                      >
                        {user.name}
                      </Button>
                    </TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.createdByUser?.fullName}</TableCell>
                    <TableCell>
                      <Box>
                        <Button
                          aria-label='Sửa'
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
                  <TableCell colSpan={5} align='center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions sx={{ backgroundColor: 'white', padding: '8px' }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'right', marginBottom: '8px' }}>
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
            <Grid item xs={12} sm={6} md={5}>
              <Pagination
                count={total}
                color='primary'
                page={page}
                onChange={(event, newPage) => handlePageChange(event, newPage)}
                sx={{ display: 'flex', justifyContent: 'center' }}
              />
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      {isOpenUpdate && (
        <UpdateSchedule
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

export default ScheduleAccess
