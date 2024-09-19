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
  const [data, setData] = useState(null)
  const [filteredDoorAccesses, setFilteredDoorAccesses] = useState([])
  const [filteredUserGroups, setFilteredUserGroups] = useState([])
  const [errors, setErrors] = useState({})

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const validateFields = () => {
    const newErrors = {}

    if (!accessGroup.name) {
      newErrors.name = 'Group Name is required'
    }

    if (accessGroup.doorAccessIds?.length === 0) {
      newErrors.doorAccessIds = 'Please select at least one Door Access'
    }

    if (accessGroup.userGroupIds?.length === 0) {
      newErrors.userGroupIds = 'Please select at least one Member Group'
    }

    if (!accessGroup.description) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)

    // Return true if no errors
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchAllData()
    fetchGroupMembersData()
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

  const fetchGroupMembersData = async () => {
    try {
      const response = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1?parentId=59ad2698-329d-46d6-8bf5-2f11fb2dd974',
        config
      )

      // Lưu dữ liệu vào state
      setDeviceGroups1(response.data || [])
    } catch (error) {
      console.error('Error fetching group members data:', error)
      toast.error(error.message)
    }
  }

  const fetchAllData = async () => {
    try {
      // Gọi nhiều API cùng lúc
      const [doorAccessResponse, userGroupsResponse, accessGroupResponse, guestGroupsResponse] = await Promise.all([
        axios.get(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses?keyword=&limit=50&page=1',
          config
        ),
        axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1', config),
        axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/access-groups/${id}`, config),
        axios.get(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1?type=GUEST',
          config
        ) // Thêm API nhóm khách
      ])

      // Lưu dữ liệu vào state
      setData({
        doorAccesses: doorAccessResponse.data.rows || [],
        userGroups: userGroupsResponse.data || [],
        accessGroup: accessGroupResponse.data || {},
        guestGroups: guestGroupsResponse.data[0] || [] // Lưu dữ liệu nhóm khách
      })
      console.log(guestGroupsResponse.data[0], 'gúet')

      const transformedDoorAccesses = accessGroupResponse.data.doorAccesses.map(item => ({
        objectId: item.objectId,
        name: item.objectName
      }))

      const transformedUserGroups = accessGroupResponse.data.userGroups.map(item => ({
        objectId: item.objectId,
        name: item.objectName
      }))

      setAccessGroup({
        ...accessGroupResponse.data,
        doorAccesses: transformedDoorAccesses,
        userGroups: transformedUserGroups
      })

      // Lấy danh sách userGroups.pathOfTrees (mảng các id)
      const pathOfTrees = accessGroupResponse.data.userGroups.map(group => group.pathOfTrees).flat()

      // Gọi API cho từng parentId lấy từ pathOfTrees
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    }
  }

  const handleVautoClick = () => {
    if (data) {
      const doorAccessData = data.doorAccesses.filter(item => item.name.includes('Vauto'))
      setFilteredDoorAccesses(doorAccessData)
    }
  }

  const handleGroupMemberClick = () => {
    if (data) {
      const userGroupData = data.userGroups.filter(group => group.name.includes('Member'))
      setFilteredUserGroups(userGroupData)
    }
  }

  const UpdateAccessGroup = async () => {
    if (!validateFields()) return
    setLoading(true)
    try {
      const updateData = {
        description: accessGroup.description,
        doorAccessIds: accessGroup.doorAccesses.map(item => item.objectId),
        name: accessGroup.name,
        userGroupIds: accessGroup.userGroups.map(item => item.objectId),
        userIds: []
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

  return (
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
            Detail
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <CustomTextField
                label='Name'
                value={accessGroup ? accessGroup.name : ''}
                onChange={e => handleInputChange('name', e.target.value)}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                label='Description'
                value={accessGroup ? accessGroup.description : ''}
                onChange={e => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={data ? data.doorAccesses.map(item => ({ objectId: item.id, name: item.name })) : []}
                value={accessGroup ? accessGroup.doorAccesses : []}
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.objectId === value.objectId}
                onChange={(event, newValue) => {
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
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Door Access'
                    error={!!errors.doorAccessIds}
                    helperText={errors.doorAccessIds}
                    fullWidth
                  />
                )}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={deviceGroups1.map(item => ({ objectId: item.id, name: item.name }))}
                value={accessGroup ? accessGroup.userGroups : []}
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.objectId === value.objectId}
                onChange={(event, newValue) => {
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
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Group Member'
                    error={!!errors.userGroupIds}
                    helperText={errors.userGroupIds}
                    fullWidth
                  />
                )}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={deviceGroups2}
                value={accessGroup ? accessGroup.deviceKGroupId : []}
                getOptionLabel={option => option.name}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleInputChange('deviceKGroupId', newValue.id)
                  } else {
                    handleInputChange('deviceKGroupId', null)
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Group Guest' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disabled
                renderInput={params => <CustomTextField {...params} label='User list' fullWidth />}
                loading={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            px: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(12)} !important`],
            pb: theme => `${theme.spacing(12)} !important`
          }}
        >
          <Button variant='contained' onClick={UpdateAccessGroup}>
            Save
          </Button>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DoorAccessUpdate
