import React, { useState, useEffect, useCallback } from 'react'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import Checkbox from '@mui/material/Checkbox'
import Update from '../popups/Update'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  CardContent,
  CardActions,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Link from 'next/link'

const GroupAccess = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [idUpdate, setIdUpdate] = useState(null)
  const [pageSize, setPageSize] = useState(25)
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
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
    fetchDataList()
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

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups?`,
        config
      )

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
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <Button variant='contained'>Danh sách quản lý nhóm quyền truy cập</Button>
                </Grid>
              </Grid>
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
                  placeholder='Nhập tên truy cập cửa ...! '
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
              <Grid item>
                <Box sx={{ textAlign: 'right' }}>
                  <Button variant='contained' component={Link} href={`/pages/group-access/detail/add`}>
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
                <TableCell sx={{ padding: '16px' }}>Cấp truy cập cửa</TableCell>
                <TableCell sx={{ padding: '16px' }}>Nhóm người</TableCell>
                <TableCell sx={{ padding: '16px' }}>Người</TableCell>
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
                    <TableCell>
                      {user.doorAccesses && user.doorAccesses.length > 0
                        ? user.doorAccesses.map(door => door.objectName).join(', ')
                        : 'Không có tên'}
                    </TableCell>
                    <TableCell>
                      {user.userGroups && user.userGroups.length > 0
                        ? user.userGroups.map(door => door.objectName).join(', ')
                        : 'Không có tên'}
                    </TableCell>
                    <TableCell>{user.users}</TableCell>
                    <TableCell>{user.createdByUser}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setIdUpdate(user.id)
                          setIsOpenUpdate(true)
                        }}
                      >
                        <Icon icon='tabler:edit' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions sx={{ backgroundColor: 'white', padding: '8px' }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'right', mb: 1 }}>
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
        <Update
          show={isOpenUpdate}
          onClose={() => setIsOpenUpdate(false)}
          id={idUpdate}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </>
  )
}

export default GroupAccess
