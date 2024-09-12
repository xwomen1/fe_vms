import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Table,
  Button,
  TableBody,
  TableCell,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Autocomplete } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

const DoorAccessUpdate = ({ show, onClose, id, setReload }) => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const [door, setDoor] = useState({
    name: '',
    description: '',
    policies: [{ doorGroupId: null, doorId: null, schedule: null, applyMode: 'CUSTOMIZE' }]
  })
  const [groupOptions, setGroupOptions] = useState([])
  const [doorOptions, setDoorOptions] = useState({})
  const [scheduleOptions, setScheduleOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [policyCount, setPolicyCount] = useState(0)

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    policies: []
  })

  const fetchDataList = async () => {
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses/${id}`,
        config
      )
      setDoor(response.data)

      const doorGroupIds = response.data.policies.map(policy => policy.doorGroupId).filter(Boolean)
      await Promise.all(doorGroupIds.map(fetchDoorOptions))

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
      setLoading(false)
    }
  }

  const fetchDoorOptions = async doorGroupId => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors?keyword=&limit=50&page=1&doorGroupIds=${doorGroupId}`,
        config
      )

      setDoorOptions(prevState => ({
        ...prevState,
        [doorGroupId]: response.data.rows
      }))
    } catch (error) {
      console.error('Error fetching door options:', error)
      toast.error(error.message)
    }
  }

  const fetchAllSchedules = async () => {
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      let allSchedules = []
      let page = 1
      let hasMoreData = true

      while (hasMoreData) {
        const response = await axios.get(
          `https://dev-ivi.basesystem.one/smc/access-control/api/v0/schedules?keyword=&limit=50&page=${page}`,
          config
        )

        if (response.data.rows.length > 0) {
          allSchedules = [...allSchedules, ...response.data.rows]
          page++
        } else {
          hasMoreData = false
        }
      }

      setScheduleOptions(allSchedules)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      fetchAllSchedules()
    }
  }, [show])

  useEffect(() => {
    if (show) {
      const fetchParentData = async () => {
        try {
          setLoading(true)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?',
            config
          )
          const parentGroups = response.data

          // Function to recursively fetch child groups
          const fetchChildGroups = async parentId => {
            const childResponse = await axios.get(
              `https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups/children-lv1?parentId=${parentId}`,
              config
            )
            const childGroups = childResponse.data
            for (let childGroup of childGroups) {
              if (childGroup.isParent) {
                // Recursively fetch child groups if it's a parent
                childGroup.children = await fetchChildGroups(childGroup.id)
              }
            }

            return childGroups
          }

          // Process each parent group to fetch its children recursively
          const processedGroups = []
          for (let parentGroup of parentGroups) {
            if (parentGroup.isParent) {
              parentGroup.children = await fetchChildGroups(parentGroup.id)
            }
            processedGroups.push(parentGroup)
          }

          // Flatten nested structure for Autocomplete options
          const flattenGroups = flattenNestedGroups(processedGroups)
          setGroupOptions(flattenGroups)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchParentData()
    }
  }, [show])

  const flattenNestedGroups = groups => {
    const flattenedGroups = []

    const flattenRecursive = group => {
      flattenedGroups.push(group)
      if (group.children) {
        for (let child of group.children) {
          flattenRecursive(child)
        }
      }
    }
    for (let group of groups) {
      flattenRecursive(group)
    }

    return flattenedGroups
  }

  const handleAutocompleteChange = (newValue, rowIndex, field) => {
    setDoor(prevDoor => {
      const updatedPolicies = [...prevDoor.policies]
      const updatedPolicy = { ...updatedPolicies[rowIndex] }

      if (field === 'doorGroupId') {
        updatedPolicy.doorGroupId = newValue ? newValue.id : null
        updatedPolicy.doorId = null
      } else if (field === 'doorId') {
        updatedPolicy.doorId = newValue ? newValue.id : null
      } else if (field === 'schedule') {
        updatedPolicy.schedule = newValue || null
      }

      updatedPolicies[rowIndex] = updatedPolicy

      return {
        ...prevDoor,
        policies: updatedPolicies
      }
    })

    if (field === 'doorGroupId' && newValue) {
      fetchDoorOptions(newValue.id)
    }
    setErrors(prevErrors => {
      const updatedPoliciesErrors = [...prevErrors.policies]
      updatedPoliciesErrors[rowIndex] = { ...updatedPoliciesErrors[rowIndex], [field]: false }

      return {
        ...prevErrors,
        policies: updatedPoliciesErrors
      }
    })
  }

  const handleClose = () => {
    setDoor({
      name: '',
      description: '',
      policies: [{ doorGroupId: null, doorId: null, schedule: null, applyMode: 'CUSTOMIZE' }]
    })
    onClose()
  }

  const handleAddPolicy = () => {
    setDoor(prevDoor => ({
      ...prevDoor,
      policies: [
        ...prevDoor.policies,
        {
          doorId: null,
          schedule: null,
          applyMode: 'CUSTOMIZE'
        }
      ]
    }))
    setPolicyCount(policyCount + 1) // Increment policyCount to create a new ID for the next policy
  }

  const handleDeletePolicy = index => {
    setDoor(prevDoor => ({
      ...prevDoor,
      policies: prevDoor.policies.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (field, value) => {
    setDoor(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: false
    }))
  }

  const handleSave = async () => {
    const newErrors = {
      name: !door.name,
      description: !door.description,
      policies: door.policies.map(policy => ({
        doorGroupId: !policy.doorGroupId,
        doorId: !policy.doorId,
        schedule: !policy.schedule
      }))
    }

    setErrors(newErrors)

    const hasErrors =
      newErrors.name || newErrors.description || newErrors.policies.some(policyError => policyError === true)

    const isPolicyValid = door.policies.every(
      policy => policy.doorId !== null && policy.applyMode !== null && policy.schedule !== null
    )

    if (!hasErrors && isPolicyValid) {
      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        // Ensure to retrieve doorId, applyMode, and scheduleId from the original policies array
        const updatedPolicies = door.policies.map(policy => ({
          doorId: policy.doorId,
          applyMode: policy.applyMode,
          scheduleId: policy.schedule?.id || null
        }))

        const newDoor = {
          name: door.name,
          description: door.description,
          policies: updatedPolicies
        }

        const response = await axios.post(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-accesses',
          newDoor,
          config
        )

        // Handle successful response
        toast.success('Successful')
        setReload()
        handleClose()
      } catch (error) {
        console.error('Error updating door access:', error)
        toast.error(error.message)
      } finally {
        setLoading(false)
        setReload()
        onClose()
      }
    }
  }

  return (
    <Card>
      <Dialog open={show} maxWidth='md' scroll='body' onClose={handleClose}>
        <DialogContent>
          <IconButton style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={handleClose}>
            <Icon icon='tabler:x' />
          </IconButton>
          <Typography variant='h3' gutterBottom>
            Quản lý quyền truy cập cửa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomTextField
                onChange={e => handleInputChange('name', e.target.value)}
                label='Tên cấp quyền'
                error={errors.name}
                helperText={errors.name && 'Không được để trống'}
                value={door.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                label='Mô tả'
                onChange={e => handleInputChange('description', e.target.value)}
                error={errors.description}
                helperText={errors.description && 'Không được để trống'}
                value={door.description}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nhóm</TableCell>
                      <TableCell>Cửa</TableCell>
                      <TableCell>Lịch hoạt động</TableCell>
                      <TableCell align='center'>
                        <IconButton size='small' onClick={() => handleAddPolicy()}>
                          <Icon icon='bi:plus' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {door.policies.map((policy, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            value={groupOptions.find(option => option.id === policy.doorGroupId) || null}
                            options={groupOptions}
                            getOptionLabel={option => option.name}
                            onChange={(event, newValue) => handleAutocompleteChange(newValue, index, 'doorGroupId')}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                error={errors.policies[index]?.doorGroupId}
                                helperText={errors.policies[index]?.doorGroupId && 'Không được để trống'}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            value={doorOptions[policy.doorGroupId]?.find(option => option.id === policy.doorId) || null}
                            options={doorOptions[policy.doorGroupId] || []}
                            getOptionLabel={option => option.name}
                            onChange={(event, newValue) => handleAutocompleteChange(newValue, index, 'doorId')}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                error={errors.policies[index]?.doorId}
                                helperText={errors.policies[index]?.doorId && 'Không được để trống'}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            value={scheduleOptions.find(option => option.id === policy.schedule?.id) || null}
                            options={scheduleOptions}
                            getOptionLabel={option => option.name}
                            onChange={(event, newValue) => handleAutocompleteChange(newValue, index, 'schedule')}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                error={errors.policies[index]?.schedule}
                                helperText={errors.policies[index]?.schedule && 'Không được để trống'}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton size='small' onClick={() => handleDeletePolicy(index)}>
                            <Icon icon='bi:trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='contained' color='primary'>
            Hủy
          </Button>
          <Button variant='contained' color='primary' onClick={handleSave}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DoorAccessUpdate
