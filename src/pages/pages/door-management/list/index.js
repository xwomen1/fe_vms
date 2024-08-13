import React, { useState, useEffect, useCallback } from 'react'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import Filter from '../popups/filter'
import Checkbox from '@mui/material/Checkbox'
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
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Link from 'next/link'

const DoorManagement = () => {
  const [treeData, setTreeData] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(25)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [value, setValue] = useState('')

  const initValueFilter = {
    limit: 25,
    page: 1,
    doorStatuses: ''
  }
  const [valueFilter, setValueFilter] = useState(initValueFilter)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [])

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
    fetchDataList()
  }, [page, pageSize, valueFilter, value])

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1',
        config
      )
      const parentData = response.data

      const treeWithChildren = await Promise.all(
        parentData.map(async parent => {
          const children = await fetchChildren(parent.id)

          return { ...parent, children }
        })
      )

      setTreeData(treeWithChildren)

      if (parentData.length > 0) {
        const rootNodeId = parentData[0].id
        fetchDevices(rootNodeId)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchChildren = async parentId => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?parentId=${parentId}`,
        config
      )
      const children = response.data // Lấy dữ liệu từ response

      const promises = children.map(async child => {
        const subChildren = await fetchChildren(child.id)

        return { ...child, children: subChildren }
      })

      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching children data:', error)
      toast.error(error.response.data.message)

      return []
    }
  }

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

  useEffect(() => {
    fetchDevices()
  }, [valueFilter, value])

  console.log('doorStatuses:', valueFilter)

  const fetchDevices = async nodeId => {
    if (nodeId) {
      try {
        const params = {
          doorGroupIds: nodeId,
          doorStatuses: valueFilter.doorStatuses,
          keyword: value,
          limit: valueFilter.limit,
          page: valueFilter.page
        }

        const url = `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors`

        const response = await axios.get(url, {
          params: params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        const devicesWithParentId = response.data.rows.map(device => ({
          ...device,
          parentId: nodeId
        }))

        setDeviceData(devicesWithParentId)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy dữ liệu.')
      }
    }
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleNodeSelect = async (event, nodeId) => {
    fetchDevices(nodeId)
  }

  const renderTree = nodes => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
          <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{nodes.name}</span>
        </div>
      }
    >
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  )

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  const handleSelectAllChange = event => {
    if (event.target.checked) {
      const allIds = deviceData.map(device => device.id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  useEffect(() => {
    const allIds = deviceData.map(device => device.id)
    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length
    setSelectAll(isAllSelected)
  }, [deviceData, selectedIds])

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
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleDelete = () => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa cửa khỏi hệ thống không ?'
    }).then(({ value }) => {
      if (value) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: selectedIds
        }
        const urlDelete = `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/multi`
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
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })

            const updatedData = deviceData.filter(device => !selectedIds.includes(device.id))
            setDeviceData(updatedData)
            setSelectedIds([])
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
                  confirmButton.style.backgroundColor = '#002060'
                  confirmButton.style.color = 'white'
                }
              }
            })
          })
      }
    })
  }

  const Doorlock = async () => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Khóa cửa sẽ dừng hoạt động của cửa trong tòa nhà, bạn có chắc chắn khóa cửa này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel'
      },
      confirmButtonColor: '#002060'
    })

    if (confirmResult.isConfirmed) {
      setLoading(true)
      try {
        const updateData = {
          ids: selectedIds,
          mode: 'LOCKED'
        }

        const response = await axios.post(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/change-mode',
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success('Khóa thành công!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi khóa cửa.')
      } finally {
        setLoading(false)
      }
    }
  }

  const FreeLock = async () => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Xả cửa sẽ cho phép người dùng vào bất kỳ phòng nào trong tòa nhà, bạn có chắc chắn xả cửa này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel'
      },
      confirmButtonColor: '#002060'
    })

    if (confirmResult.isConfirmed) {
      setLoading(true)
      try {
        const updateData = {
          ids: selectedIds,
          mode: 'FREE'
        }

        const response = await axios.post(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/change-mode',
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success('Xả cửa thành công!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xả cửa.')
      } finally {
        setLoading(false)
      }
    }
  }

  const SetUp = async () => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Đặt lại chế độ sẽ thay đổi cài đặt trước đó, bạn có chắc chắn muốn đặt lại chế độ cửa này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel'
      },
      confirmButtonColor: '#002060'
    })

    if (confirmResult.isConfirmed) {
      setLoading(true)
      try {
        const updateData = {
          ids: selectedIds,
          mode: 'NORMAL'
        }

        const response = await axios.post(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/change-mode',
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success('Đặt lại chế độ thành công!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại chế độ.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleExport = () => {
    if (deviceData.length === 0) {
      console.error('No data available to export')

      return
    }

    const encodeCSVData = value => {
      if (value === null || value === undefined) return ''
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '')}"`
      }

      return value.toString()
    }

    const csvData = deviceData.map(device => ({
      'Tên cửa': encodeCSVData(device.name),
      'Tên thiết bị': encodeCSVData(device.deviceName),
      'Miêu tả': encodeCSVData(device.description),
      'Trạng thái': encodeCSVData(device.status)
    }))

    const headers = Object.keys(csvData[0])

    const csvContent = [
      headers.join(','),
      ...csvData.map(item => headers.map(header => encodeCSVData(item[header])).join(','))
    ].join('\n')

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'devices.csv')
    document.body.appendChild(link)
    link.click()

    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Card>
        <CardHeader
          title={<Button variant='contained'>Door</Button>}
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
                  <Button variant='contained' component={Link} href={`/pages/door-management/detail/add`}>
                    <Icon icon='tabler:plus' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' onClick={handleExport}>
                    <Icon icon='tabler:download' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setIsOpenFilter(true)
                    }}
                  >
                    <Icon icon='tabler:filter' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' disabled={selectedIds.length === 0} onClick={handleDelete}>
                    <Icon icon='tabler:trash' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    style={{ borderRadius: '20px' }}
                    onClick={Doorlock}
                    variant='contained'
                    disabled={selectedIds.length === 0}
                  >
                    Lock
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    onClick={FreeLock}
                    style={{ borderRadius: '20px' }}
                    variant='contained'
                    disabled={selectedIds.length === 0}
                  >
                    Discharge
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button
                    onClick={SetUp}
                    style={{ borderRadius: '20px' }}
                    variant='contained'
                    disabled={selectedIds.length === 0}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  value={value}
                  onChange={e => handleFilter(e.target.value)}
                  placeholder='Search '
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' onClick={() => setKeyword('')}>
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
        />
      </Card>
      <Grid style={{ margin: '0.3rem' }}></Grid>
      <Grid container spacing={2} style={{ height: '90%' }}>
        <Grid item xs={2.5} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <TreeView
              style={{ width: '100%' }}
              defaultCollapseIcon={<Icon icon='bi:chevron-down' />}
              defaultExpandIcon={<Icon icon='bi:chevron-right' />}
              onNodeSelect={handleNodeSelect}
            >
              {treeData.map(parent => renderTree(parent))}
            </TreeView>
          </Paper>
        </Grid>
        <Grid item xs={9.5} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <TableContainer>
              <Table>
                <TableHead style={{ background: '#F6F6F7' }}>
                  <TableRow>
                    <TableCell>
                      <Checkbox checked={selectedIds.length > 0} onChange={handleSelectAllChange} />
                    </TableCell>
                    <TableCell>Door Name</TableCell>
                    <TableCell>Device Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last editor</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceData.map(device => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(device.id)}
                          onChange={event => handleCheckboxChange(event, device.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {' '}
                        <Button
                          size='small'
                          component={Link}
                          href={`/pages/door-management/detail/${device.id}`}
                          sx={{ color: 'blue', right: '10px' }}
                        >
                          {device.name}
                        </Button>
                      </TableCell>
                      <TableCell>{device.deviceName}</TableCell>
                      <TableCell>{device.description}</TableCell>
                      <TableCell>{device.status}</TableCell>
                      <TableCell>{device.lastUpdatedByUser?.fullName}</TableCell>
                      <TableCell>
                        {' '}
                        <Box>
                          <Button size='small' component={Link} href={`/pages/door-management/detail/${device.id}`}>
                            <Icon icon='tabler:edit' />
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br></br>
              <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={1.5} style={{ padding: 0, marginLeft: '12%' }}>
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
                  <Pagination
                    count={total}
                    color='primary'
                    page={page}
                    onChange={(event, newPage) => handlePageChange(event, newPage)}
                  />
                </Grid>
              </Grid>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {isOpenFilter && (
        <Filter
          valueFilter={valueFilter}
          show={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
          callback={handleSetValueFilter}
        />
      )}
    </>
  )
}

export default DoorManagement
