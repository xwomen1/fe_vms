import React, { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
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
  Autocomplete,
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
import Swal from 'sweetalert2'
import CustomTextField from 'src/@core/components/mui/text-field'

const AddDoor = () => {
  const [inforDoor, setInforDoor] = useState({})
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [deviceGroups1, setDeviceGroups1] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchDeviceGroups()
    fetchDeviceGroups1()
  }, [])

  const fetchDeviceGroups1 = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const parentResponse = await axios.get(
        'https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1',
        config
      )
      const parentGroups = parentResponse.data || []

      // Fetch child groups for each parent
      const childGroupsPromises = parentGroups.map(async parentGroup => {
        const childResponse = await axios.get(
          `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1?parentId=${parentGroup.id}`,
          config
        )

        const childGroups = childResponse.data || []

        return childGroups.map(child => ({
          ...child,
          parentName: parentGroup.name,
          parentId: parentGroup.id
        }))
      })

      const childGroupsArrays = await Promise.all(childGroupsPromises)
      const allGroups = parentGroups.concat(childGroupsArrays.flat())
      setDeviceGroups1(allGroups)
    } catch (error) {
      console.error('Error fetching device groups:', error)
      toast.error(error.message || 'Error fetching device groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeviceGroups()
  }, [])

  const fetchDeviceGroups = async () => {
    setLoading(true)
    try {
      // Hàm đệ quy để lấy nhóm con và xây dựng cây phân cấp
      const fetchChildGroups = async parentGroup => {
        const childResponse = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?parentId=${parentGroup.id}`,
          config
        )
        const childGroups = childResponse.data || []

        const childGroupsWithParentInfo = await Promise.all(
          childGroups.map(async child => {
            const subChildGroups = await fetchChildGroups(child)
            return {
              ...child,
              children: subChildGroups,
              parentName: parentGroup.name,
              parentId: parentGroup.id
            }
          })
        )

        return childGroupsWithParentInfo
      }

      const parentResponse = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1',
        config
      )
      const parentGroups = parentResponse.data || []

      const allGroups = await Promise.all(
        parentGroups.map(async parentGroup => {
          const childGroups = await fetchChildGroups(parentGroup)
          return {
            ...parentGroup,
            children: childGroups
          }
        })
      )

      setDeviceGroups(allGroups)
    } catch (error) {
      console.error('Error fetching device groups:', error)
      toast.error(error.message || 'Error fetching device groups')
    } finally {
      setLoading(false)
    }
  }

  const flattenGroups = groups => {
    let flattened = []
    groups.forEach(group => {
      flattened.push(group)
      if (group.children && group.children.length > 0) {
        flattened = flattened.concat(flattenGroups(group.children))
      }
    })
    return flattened
  }

  const flattenedDeviceGroups = flattenGroups(deviceGroups)

  const handleInputChange = (field, value) => {
    setInforDoor(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  const AddDoor = async () => {
    setLoading(true)
    try {
      const updateData = {
        description: inforDoor.description,
        doorGroupId: selectedGroup ? selectedGroup.id : inforDoor.doorGroupId,
        name: inforDoor.name,
        deviceId: inforDoor.deviceGroupId
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/`,
        updateData,
        config
      )
      toast.success('Thêm thành công!')
      window.location.href = `/pages/door-management/list`
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Thêm mới cửa'
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
                  <Button variant='contained' component={Link} href={`/pages/door-management/list`}>
                    Hủy
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right', marginLeft: '2%' }}>
                  <Button aria-label='Bộ lọc' variant='contained' onClick={AddDoor}>
                    Lưu
                  </Button>
                </Box>
              </Grid>
            </Grid>
          }
        />
        <Grid style={{ margin: '0.3rem' }}></Grid>
        <Grid container spacing={0}>
          <Grid
            container
            item
            component={Paper}
            style={{ backgroundColor: 'white', width: '100%', padding: '10px', maxHeight: 600, paddingTop: '50px' }}
          >
            <Grid item xs={3.8}>
              <CustomTextField
                label='Tên'
                placeholder='Nhập tên cửa'
                onChange={e => handleInputChange('name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                options={flattenedDeviceGroups}
                getOptionLabel={option => option.name}
                placeholder='Chọn nhóm cửa ...'
                onChange={(event, newValue) => setSelectedGroup(newValue)}
                renderInput={params => <CustomTextField {...params} label='Nhóm Cửa' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <CustomTextField label='Access level' placeholder='Nhập access level...' fullWidth disabled />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Miêu tả'
                placeholder='Nhập mô tả'
                onChange={e => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8} style={{ marginTop: 20 }}>
              <CustomTextField label='Thời gian cập nhật' placeholder='Thời gian cập nhật...' disabled fullWidth />
            </Grid>
            <Grid item xs={12}>
              <p>Cấu hình lịch</p>
            </Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                options={deviceGroups1}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleInputChange('deviceGroupId', newValue.id)
                  } else {
                    handleInputChange('deviceGroupId', null)
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Nhóm thiết bị' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                options={flattenedDeviceGroups}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => setSelectedGroup(newValue)}
                renderInput={params => <CustomTextField {...params} label='Loại thiết bị' fullWidth />}
                loading={loading}
                disabled
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                options={flattenedDeviceGroups}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => setSelectedGroup(newValue)}
                renderInput={params => <CustomTextField {...params} label='Chiều định danh' fullWidth />}
                loading={loading}
                disabled
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8} style={{ marginTop: 20 }}>
              <Autocomplete
                options={flattenedDeviceGroups}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => setSelectedGroup(newValue)}
                renderInput={params => <CustomTextField {...params} label='Thiết bị' fullWidth />}
                loading={loading}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}
export default AddDoor
