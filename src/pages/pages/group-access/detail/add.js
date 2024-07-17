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

const AddGroupAccess = () => {
  const [accessGroup, setAccessGroup] = useState({})
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [deviceGroups1, setDeviceGroups1] = useState([])
  const [deviceGroups2, setDeviceGroups2] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchDevice()
    fetchDeviceGroups()
    fetchDeviceGroups1()
  }, [])

  const fetchDevice = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const parentResponse = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses?keyword=&limit=50&page=1`,
        config
      )
      setDeviceGroups(parentResponse.data?.rows)
    } catch (error) {
      console.error('Error fetching device groups:', error)
      toast.error(error.message || 'Error fetching device groups')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAccessGroup(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  const fetchDeviceGroups = async () => {
    setLoading(true)
    try {
      const fetchChildGroups = async parentGroup => {
        const childResponse = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1?parentId=${parentGroup.id}`,
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
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1',
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

      setDeviceGroups1(allGroups)
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

  const flattenedDeviceGroups = flattenGroups(deviceGroups1)

  const fetchDeviceGroups1 = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const parentResponse = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1?type=GUEST',
        config
      )
      const parentGroups = parentResponse.data || []

      setDeviceGroups2(parentGroups)
    } catch (error) {
      console.error('Error fetching device groups:', error)
      toast.error(error.message || 'Error fetching device groups')
    } finally {
      setLoading(false)
    }
  }

  const AddAccessGroup = async () => {
    setLoading(true)
    try {
      const updateData = {
        description: accessGroup.description,
        doorAccessIds: accessGroup.doorAccessIds,
        name: accessGroup.name,
        userGroupIds: accessGroup.userGroupIds,
        userIds: [] // Nếu bạn có dữ liệu userIds, bạn có thể thay đổi chỗ này
        // deviceKGroupId: accessGroup.deviceKGroupId
      }

      const response = await axios.post(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups`,
        updateData,
        config
      )
      toast.success('Thêm thành công!')
      window.location.href = `/pages/group-access/list`
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
          title='Thêm mới quản lý nhóm quyền truy cập'
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
                  <Button variant='contained' component={Link} href={`/pages/group-access/list`}>
                    Hủy
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right', marginLeft: '2%' }}>
                  <Button aria-label='Bộ lọc' variant='contained' onClick={AddAccessGroup}>
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
                label='Tên nhóm quyền truy cập'
                placeholder='Nhập tên nhóm quyền truy cập'
                onChange={e => handleInputChange('name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                multiple
                options={deviceGroups}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => {
                  console.log(newValue.map(item => item.id))
                  handleInputChange(
                    'doorAccessIds'
                    // newValue.map(item => item.id)
                  )
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip key={option.id} label={option.name} {...getTagProps({ index })} />)
                }
                renderInput={params => <CustomTextField {...params} label='Cấp quyền truy cập cửa' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                multiple
                options={flattenedDeviceGroups}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => {
                  console.log(newValue.map(item => item.id))
                  handleInputChange(
                    'userGroupIds',
                    newValue.map(item => item.id)
                  )
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip key={option.id} label={option.name} {...getTagProps({ index })} />)
                }
                renderInput={params => <CustomTextField {...params} label='Nhóm người' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <Autocomplete
                options={deviceGroups2}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => {
                  console.log(newValue.id)
                  if (newValue) {
                    handleInputChange('deviceKGroupId', newValue.id)
                  } else {
                    handleInputChange('deviceKGroupId', null)
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Nhóm khách' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={3.8}>
              <CustomTextField
                label='Mô tả'
                placeholder='Nhập mô tả'
                onChange={e => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default AddGroupAccess
