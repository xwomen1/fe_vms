import React, { useState, useEffect } from 'react'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import Link from 'next/link'
import Checkbox from '@mui/material/Checkbox'
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

const AccessControlDevice = () => {
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState([]) // State để lưu trữ dữ liệu cây
  const [deviceData, setDeviceData] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchDataList()
  }, [])

  const fetchDataList = async () => {
    setLoading(true)
    try {
      // Lấy dữ liệu thằng cha từ API
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1`,
        config
      )
      const parentData = response.data
      console.log(parentData[0].devices, 'parentData')
      setDeviceData(parentData[0].devices)

      // Lấy dữ liệu thằng con tương ứng với mỗi thằng cha
      const promises = parentData.map(async parent => {
        const response = await axios.get(
          `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1?parentId=${parent.id}`,
          config
        )

        return { ...parent, children: response.data }
      })

      // Đợi cho tất cả các promises hoàn thành
      const childrenData = await Promise.all(promises)

      // Cập nhật state treeData với dữ liệu thằng cha và thằng con
      setTreeData(childrenData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNodeSelect = async (event, node) => {
    if (node && node) {
      try {
        let url
        if (node.parent) {
          // Nếu có parent, nghĩa là đây là thằng con
          url = `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices?deviceGroupId=${node}`
        } else {
          // Nếu không có parent, nghĩa là đây là thằng cha
          url = `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices?deviceGroupId=${node}`
        }

        // Gọi API
        const response = await axios.get(url, config)

        setDeviceData(response.data.results)

        // Xử lý dữ liệu từ response nếu cần
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Quản lý thiết bị'
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
                  <Button aria-label='Bộ lọc' variant='contained'>
                    <Icon icon='tabler:file-export' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button aria-label='Bộ lọc' variant='contained'>
                    <Icon icon='tabler:filter' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button aria-label='Bộ lọc' variant='contained'>
                    <Icon icon='tabler:trash' />
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  placeholder='Tìm kiếm sự kiện '
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
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
              defaultCollapseIcon={<Icon icon='bi:chevron-down' />}
              defaultExpandIcon={<Icon icon='bi:chevron-right' />}
              onNodeSelect={handleNodeSelect}
            >
              {treeData.map(parent => (
                <TreeItem key={parent.id} nodeId={parent.id} label={parent.name}>
                  {parent.children &&
                    parent.children.map(child => <TreeItem key={child.id} nodeId={child.id} label={child.name} />)}
                </TreeItem>
              ))}
            </TreeView>
          </Paper>
        </Grid>
        <Grid item xs={9.5} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Vị trí</TableCell>
                    <TableCell>Loại thiết bị</TableCell>
                    <TableCell>Địa chỉ IP</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Phiên bản app</TableCell>
                    <TableCell>PB phần cứng</TableCell>
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
    </>
  )
}

export default AccessControlDevice
