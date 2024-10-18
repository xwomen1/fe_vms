import React, { useState, useEffect, useCallback } from 'react'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import * as XLSX from 'xlsx'
import Link from 'next/link'
import Checkbox from '@mui/material/Checkbox'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogTitle,
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

const AccessControlDevice = () => {
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameNull, setNameNull] = useState(false)
  const [name50, setName50] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [rootParentId, setRootParentId] = useState(null)
  const token = localStorage.getItem('authToken') // Replace 'authToken' with your actual token key

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchDataList()
    if (!selectedNode) {
      fetchInitialDeviceData()
    }
  }, [selectedNode])

  const fetchChildren = async parentId => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/device-access/device-groups/children-lv1?parentId=${parentId}`,
        config
      )
      const children = response.data

      const promises = children.map(async child => {
        const subChildren = await fetchChildren(child.id)

        return { ...child, children: subChildren }
      })

      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching children data:', error)
      toast.error(error.message)

      return []
    }
  }

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/device-access/device/device-groups/children-lv1',
        config
      )
      const parentData = response.data

      const largestParentId = parentData.length > 0 ? parentData[0].id : null
      setRootParentId(largestParentId)

      const promises = parentData.map(async parent => {
        const children = await fetchChildren(parent.id)

        return { ...parent, children }
      })

      const data = await Promise.all(promises)
      setTreeData(data)
      if (!selectedNode) {
        setDeviceData(data.flatMap(parent => parent.devices))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchInitialDeviceData = useCallback(async () => {
    if (selectedNode) return

    try {
      const params = {
        keyword: searchKeyword
      }

      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/device-access/devices?deviceGroupId=643a2358824177002890430a',
        {
          ...config,
          params: params
        }
      )

      const devicesWithParentId = response.data.map(device => ({
        ...device,
        parentId: '643a2358824177002890430a'
      }))
      setDeviceData(devicesWithParentId)
    } catch (error) {
      console.error('Error fetching initial device data:', error)
      toast.error(error.message)
    }
  }, [searchKeyword, selectedNode])

  const handleNodeSelect = useCallback(
    async (event, nodeId) => {
      if (nodeId) {
        setSelectedNode(nodeId)

        const params = {
          keyword: searchKeyword
        }

        try {
          const url = `https://dev-ivi.basesystem.one/smc/access-control/api/v0/device-access/devices?deviceGroupId=${nodeId}`

          const response = await axios.get(url, {
            params: params,
            ...config
          })

          const devicesWithParentId = response.data.map(device => ({
            ...device,
            parentId: nodeId
          }))
          setDeviceData(devicesWithParentId)
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
          toast.error(error.message)
        }
      }
    },
    [searchKeyword]
  )

  const handleSearch = () => {
    if (!selectedNode) {
      fetchInitialDeviceData()
    } else {
      handleNodeSelect(null, selectedNode)
    }
  }

  const handlePlusClick = node => {
    setSelectedNode(node.id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setNewName('')
    setName50(false)
    setNameNull(false)
  }

  const handleDelete = node => {
    setSelectedNode(node.id)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const handleSave = async () => {
    if (!newName.trim()) {
      setNameNull(true)
      setName50(false)

      return
    }

    if (newName.length > 50) {
      setNameNull(false)
      setName50(true)

      return
    }

    if (!newName || !selectedNode) {
      toast.error('Vui lòng nhập tên và chọn một node hợp lệ.')

      return
    }

    try {
      const response = await axios.post(
        'https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups',
        {
          name: newName,
          parentId: selectedNode
        },
        config
      )
      toast.success('Successfully Added')
      fetchDataList() // Làm mới dữ liệu sau khi thêm mới
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Có lỗi xảy ra khi thêm mới.')
    } finally {
      handleClose()
    }
  }

  const renderTree = nodes => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
          <span style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{nodes.name}</span>
          {!rootParentId || rootParentId !== nodes.id ? (
            <>
              <IconButton style={{ width: '35px', height: '35px' }}>
                <Icon icon='tabler:plus' onClick={() => handlePlusClick(nodes)} />
              </IconButton>
              <IconButton style={{ width: '35px', height: '35px' }}>
                <Icon icon='tabler:trash' onClick={() => handleDelete(nodes)} />
              </IconButton>
            </>
          ) : (
            <IconButton style={{ width: '35px', height: '35px' }}>
              <Icon icon='tabler:plus' onClick={() => handlePlusClick(nodes)} />
            </IconButton>
          )}
        </div>
      }
    >
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  )

  const exportToExcel = () => {
    const data = deviceData.map(device => ({
      Name: device.name,
      Position: device.doorName,
      'Device Group': device.deviceGroup,
      'Device Type': device.deviceType,
      'IP Address': device.ipAddress,
      Status: device.status,
      Firmware: device.firmware
    }))

    const workbook = XLSX.utils.book_new()

    const worksheet = XLSX.utils.json_to_sheet(data)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Device Data')

    XLSX.writeFile(workbook, 'device_data.xlsx')
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              <Button variant='contained'>Device Management</Button>
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
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' onClick={exportToExcel}>
                    <Icon icon='tabler:file-export' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' disabled>
                    <Icon icon='tabler:trash' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  placeholder='Enter device name'
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
                  Search <Icon fontSize='1.25rem' icon='tabler:search' />
                </Button>
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
        <Grid item xs={9.5} style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
          <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <TableContainer>
              <Table>
                <TableHead style={{ background: '#F6F6F7' }}>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Device Type</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>App Version</TableCell>
                    <TableCell>Hardware Version</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceData.map(device => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Button
                          size='small'
                          component={Link}
                          href={`/device-management/Update/${device.id}`}
                          sx={{ color: 'blue', right: '10px' }}
                        >
                          {device.name}
                        </Button>
                      </TableCell>
                      <TableCell>{device.doorName}</TableCell>
                      <TableCell>{device.deviceType}</TableCell>
                      <TableCell>{device.ipAddress}</TableCell>
                      <TableCell>{device.status}</TableCell>
                      <TableCell>{device.firmware}</TableCell>
                      <TableCell>{device.hardwareVersion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Create Device Group</DialogTitle>
        <DialogContent>
          <CustomTextField
            autoFocus
            margin='dense'
            label='Group Name '
            fullWidth
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <div>
            {' '}
            <p style={{ color: 'red', textAlign: 'center', display: nameNull ? 'block' : 'none' }}>
              Please enter the group name
            </p>
            <p style={{ color: 'red', textAlign: 'center', display: name50 ? 'block' : 'none' }}>
              The group name must not exceed 50 characters
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained'>
            Cancel
          </Button>
          <Button onClick={handleSave} variant='contained'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete} fullWidth>
        <DialogTitle style={{ fontSize: '20px' }}>Delete Device Group</DialogTitle>
        <DialogContent>
          You need to remove all devices from the group before you can proceed with deleting the group
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant='contained'>
            Cancel
          </Button>
          {/* <Button onClick={handleDeleteOnclick} variant='contained'>
            Ok
          </Button> */} 
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AccessControlDevice
