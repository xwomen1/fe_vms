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
import AddNew from '../detail/add'

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
  const [isOpenAdd, setIsOpenAdd] = useState(false)

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClosePopup = () => {
    setIsOpenAdd(false)
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
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardHeader
          title={
            <>
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <Button variant='contained'>Access group management</Button>
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
                  placeholder='Searching..! '
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
                  Search <Icon fontSize='1.25rem' icon='tabler:search' />
                </Button>
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setIsOpenAdd(true)
                    }}
                  >
                    Add
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
                <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                <TableCell sx={{ padding: '16px' }}>Name</TableCell>
                <TableCell sx={{ padding: '16px' }}>Description</TableCell>
                <TableCell sx={{ padding: '16px' }}>Door Access</TableCell>
                <TableCell sx={{ padding: '16px' }}>Group</TableCell>
                <TableCell sx={{ padding: '16px' }}>Member</TableCell>
                <TableCell sx={{ padding: '16px' }}>Creator</TableCell>
                <TableCell sx={{ padding: '16px' }}>Action</TableCell>
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
                        : 'None'}
                    </TableCell>
                    <TableCell>
                      {user.userGroups && user.userGroups.length > 0
                        ? user.userGroups.map(door => door.objectName).join(', ')
                        : 'None'}
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
                    Data not available
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
        <Update show={isOpenUpdate} onClose={() => setIsOpenUpdate(false)} id={idUpdate} setReload={fetchDataList} />
      )}
      {isOpenAdd && <AddNew show={isOpenAdd} onClose={handleClosePopup} setReload={fetchDataList} />}
    </>
  )
}

export default GroupAccess
