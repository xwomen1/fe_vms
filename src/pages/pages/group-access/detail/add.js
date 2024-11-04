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

const AddGroupAccess = ({ show, onClose, setReload }) => {
  const [accessGroup, setAccessGroup] = useState({})
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [deviceGroups1, setDeviceGroups1] = useState([])
  const [deviceGroups2, setDeviceGroups2] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
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

    if (!accessGroup.doorAccessIds || accessGroup.doorAccessIds.length === 0) {
      newErrors.doorAccessIds = 'Please select at least one Door Access'
    }

    if (!accessGroup.userGroupIds || accessGroup.userGroupIds.length === 0) {
      newErrors.userGroupIds = 'Please select at least one Member Group'
    }

    if (!accessGroup.description) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)

    // Return true if no errors
    return Object.keys(newErrors).length === 0
  }

  const validate = () => {
    let tempErrors = {}
    if (!accessGroup.name) tempErrors.name = 'Group Name is required'
    if (!accessGroup.doorAccessIds || accessGroup.doorAccessIds.length === 0)
      tempErrors.doorAccessIds = 'At least one Door Access is required'
    if (!accessGroup.userGroupIds || accessGroup.userGroupIds.length === 0)
      tempErrors.userGroupIds = 'At least one Member Group is required'
    if (!accessGroup.description) tempErrors.description = 'Description is required'

    setErrors(tempErrors)

    return Object.keys(tempErrors).length === 0
  }

  useEffect(() => {
    fetchDevice()
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
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups/children-lv1',
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
    if (!validateFields()) {
      return
    }
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
      setReload()

      onClose()
    } catch (error) {
      toast.error(error.message)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <Dialog
          open={show}
          maxWidth='md'
          scroll='body'
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
            <Grid style={{ margin: '0.3rem' }}>
              <h1>Add Access Group</h1>
            </Grid>
            <Grid container spacing={0}>
              <Grid
                container
                item
                style={{ backgroundColor: 'white', width: '100%', padding: '10px', maxHeight: 600, paddingTop: '50px' }}
              >
                <Grid item xs={3.8}>
                  <CustomTextField
                    label='Group Name'
                    placeholder='Insert group name'
                    onChange={e => handleInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
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
                        'doorAccessIds',
                        newValue.map(item => item.id)
                      )
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Door Access '
                        error={!!errors.doorAccessIds}
                        helperText={errors.doorAccessIds}
                        fullWidth
                      />
                    )}
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
                      value.map((option, index) => (
                        <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
                      ))
                    }
                    onOpen={async () => {
                      await fetchDeviceGroups()
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Member Group '
                        error={!!errors.userGroupIds}
                        helperText={errors.userGroupIds}
                        fullWidth
                      />
                    )}
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={3.8}>
                  <Autocomplete
                    options={deviceGroups2}
                    getOptionLabel={option => option?.name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleInputChange('deviceKGroupId', newValue?.id)
                      } else {
                        handleInputChange('deviceKGroupId', null)
                      }
                    }}
                    renderInput={params => <CustomTextField {...params} label='Guest Group' fullWidth />}
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={0.1}></Grid>
                <Grid item xs={3.8}>
                  <CustomTextField
                    label='Description'
                    placeholder='Insert description '
                    onChange={e => handleInputChange('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    fullWidth
                  />
                </Grid>
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
            <Button variant='contained' onClick={AddAccessGroup}>
              Save
            </Button>
            <Button variant='outlined' onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default AddGroupAccess
