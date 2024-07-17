import React, { useEffect, useState, forwardRef } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Card,
  Dialog,
  Chip,
  DialogContent,
  Slide,
  Autocomplete,
  Grid,
  IconButton,
  Typography,
  DialogActions,
  Button
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

const DoorAccessUpdate = ({ show, onClose, id, setReload }) => {
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [deviceGroups1, setDeviceGroups1] = useState([])
  const [deviceGroups2, setDeviceGroups2] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [accessGroup, setAccessGroup] = useState(null)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (show) {
      fetchDataList1()
      fetchDevice()
      fetchDeviceGroups()
      fetchDeviceGroups1()
    }
  }, [show])

  const fetchDataList1 = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups/${id}`,
        config
      )

      // Chuyển đổi dữ liệu từ objectName sang đối tượng có objectId và name
      const transformedDoorAccesses = response.data.doorAccesses.map(item => ({
        objectId: item.objectId,
        name: item.objectName
      }))

      const transformedUserGroups = response.data.userGroups.map(item => ({
        objectId: item.objectId,
        name: item.objectName
      }))

      // Cập nhật state với dữ liệu đã chuyển đổi
      setAccessGroup({
        ...response.data,
        doorAccesses: transformedDoorAccesses,
        userGroups: transformedUserGroups
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

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
  console.log()

  const UpdateAccessGroup = async () => {
    setLoading(true)
    try {
      const updateData = {
        description: accessGroup.description,
        doorAccessIds: accessGroup.doorAccesses.map(item => item.objectId),
        name: accessGroup.name,
        userGroupIds: accessGroup.userGroups.map(item => item.objectId),
        userIds: [] // Nếu bạn có dữ liệu userIds, bạn có thể thay đổi chỗ này
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups/${id}`,
        updateData,
        config
      )
      toast.success('Sửa thành công!')
      setReload()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    setAccessGroup(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  return (
    <>
      <Card>
        <Dialog
          open={show}
          maxWidth='md'
          scroll='body'
          TransitionComponent={Slide}
          onClose={onClose}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(12)} !important`,
              px: theme => [`${theme.spacing(20)} !important`, `${theme.spacing(12)} !important`],
              pt: theme => [`${theme.spacing(20)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'grey.500'
              }}
            >
              <IconButton onClick={onClose}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </IconButton>
            </Box>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Chi tiết quản lý nhóm quyền truy cập
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomTextField
                  label='Tên'
                  value={accessGroup ? accessGroup.name : ''}
                  onChange={e => handleInputChange('name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CustomTextField
                  label='Miêu tả'
                  value={accessGroup ? accessGroup.description : ''}
                  onChange={e => handleInputChange('description', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={deviceGroups.map(item => ({ objectId: item.id, name: item.name }))}
                  value={accessGroup ? accessGroup.doorAccesses : []}
                  getOptionLabel={option => option.name}
                  isOptionEqualToValue={(option, value) => option.objectId === value.objectId}
                  onChange={(event, newValue) => {
                    console.log(newValue.map(item => item.objectId))
                    console.log(newValue, 'value')
                    setAccessGroup(prevDevice => ({
                      ...prevDevice,
                      doorAccesses: newValue
                    }))
                    handleInputChange(
                      'doorAccessIds',
                      newValue.map(item => item.objectId)
                    )
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option.objectId} label={option.name} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={params => <CustomTextField {...params} label='Cấp quyền truy cập cửa' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={flattenedDeviceGroups.map(item => ({ objectId: item.id, name: item.name }))}
                  value={accessGroup ? accessGroup.userGroups : []}
                  getOptionLabel={option => option.name}
                  isOptionEqualToValue={(option, value) => option.objectId === value.objectId}
                  onChange={(event, newValue) => {
                    console.log(newValue.map(item => item.objectId))
                    setAccessGroup(prevDevice => ({
                      ...prevDevice,
                      userGroups: newValue
                    }))
                    handleInputChange(
                      'userGroupIds',
                      newValue.map(item => item.objectId)
                    )
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option.objectId} label={option.name} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={params => <CustomTextField {...params} label='Nhóm người' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={deviceGroups2}
                  value={accessGroup ? accessGroup.deviceKGroupId : []}
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
              <Grid item xs={6}>
                <Autocomplete
                  disabled
                  renderInput={params => <CustomTextField {...params} label='Danh sách người dùng' fullWidth />}
                  loading={loading}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button onClick={onClose} variant='contained' color='primary'>
              Hủy
            </Button>
            <Button onClick={UpdateAccessGroup} variant='contained' color='primary'>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default DoorAccessUpdate
