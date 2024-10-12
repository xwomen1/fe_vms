import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
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
  Input,
  Autocomplete,
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
import Link from 'next/link'
import CustomTextField from 'src/@core/components/mui/text-field'
import Swal from 'sweetalert2'
import { CircularProgress } from '@mui/material'
import { padding } from '@mui/system'

const InforAll = ({ idInfor }) => {
  const [device, setDevice] = useState([])
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [name, setName] = useState(null)
  const [idDoor, setIdDoor] = useState(null)
  const [regions, setRegions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [parentId, setParentId] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const postParentId = '3cf287c3-503a-4c49-8d1c-4c60710561f5'

  const directionOptions = [
    { label: 'Chiều vào', value: 'IN' },
    { label: 'Chiều ra', value: 'OUT' }
  ]

  const deviceTypeOptions = [
    { label: 'ACCESS CONTROL', value: 'ACCESS_CONTROL' },
    { label: 'ENROLL', value: 'ENROLL' },
    { label: 'BUS', value: 'BUS' }
  ]

  const fetchDataList1 = async () => {
    if (!idInfor) return

    setLoading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices/${idInfor}`, config)
      const deviceData = response.data
      setDevice(deviceData)
      setIdDoor(deviceData.doorId)
      console.log(deviceData.doorId)
      setName(deviceData.doorName)

      // Fetch regions and set Autocomplete value if doorName matches any region name
      await fetchRegions() // Ensure fetchRegions updates regions before proceeding
      if (deviceData.doorName !== null) {
        setRegions(currentRegions => {
          const matchingRegion = currentRegions.find(region => region.name.trim() === deviceData.doorName.trim())

          console.log(matchingRegion, 'match')

          if (matchingRegion) {
            setSelectedRegion(matchingRegion)
          }

          return currentRegions
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idInfor) {
      fetchDataList1()
    }
  }, [idInfor]) // Add idInfor as a dependency

  const fetchDeviceGroups = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const parentResponse = await axios.get(
        'https://dev-ivi.basesystem.one/smc/access-control/api/v0/device-access/device/device-groups/children-lv1',
        config
      )
      const parentGroups = parentResponse.data || [] // Ensure it's an array

      // Fetch child groups for each parent
      const childGroupsPromises = parentGroups.map(async parentGroup => {
        const childResponse = await axios.get(
          `https://dev-ivi.basesystem.one/access-control/api/v0/device-access/device-groups/children-lv1?parentId=${parentGroup.id}`,
          config
        )

        const childGroups = childResponse.data || [] // Ensure it's an array

        return childGroups.map(child => ({
          ...child,
          parentName: parentGroup.name, // Include parent name for better distinction
          parentId: parentGroup.id // Include parent id for filtering
        }))
      })

      const childGroupsArrays = await Promise.all(childGroupsPromises)
      const allGroups = parentGroups.concat(childGroupsArrays.flat())
      setDeviceGroups(allGroups)
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

  const handleUpdateDevice = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const params = {
        name: device.name,
        deviceGroupId: device.deviceGroupId,
        serialNumber: device.serialNumber,
        deviceType: device.deviceType,
        firmware: device.firmware,
        model: device.model,
        direction: device.direction,
        description: device.description,
        doorId: idDoor,
        doorName: name
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices/${idInfor}`,
        params,
        config
      )

      setLoading(false)
      Swal.fire({
        title: 'Success',
        text: 'Data has been updated successfully.',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })

      // Fetch regions and set Autocomplete value if doorName matches any region name
      await fetchRegions() // Ensure fetchRegions updates regions before proceeding
      setRegions(currentRegions => {
        const matchingRegion = currentRegions.find(region => region.name === name)
        if (matchingRegion) {
          setSelectedRegion(matchingRegion)
        }

        return currentRegions
      })
    } catch (error) {
      console.error('Error updating user details:', error)
      setLoading(false)

      toast.error(error.response?.data?.message || error.message)
    }
  }

  console.log(selectedRegion, 'selectedRegion')
  console.log(regions, 'regions')

  const handleInputChange = (field, value) => {
    setDevice(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }
  const parentIdToFilter = 'fa7f0b8b-56a7-44c7-96d6-997e7fc55304'

  const fetchRegions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = response.data
      console.log(data, 'data')

      const parentRegion = data.find(region => region.parentID === parentIdToFilter)
      console.log(parentRegion, 'data')
      if (parentRegion) {
        const childResponse = await axios.get(
          `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentIdToFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(childResponse, 'childResponse')

        const childData = childResponse.data

        const combinedData = childData.map(child => ({
          id: child.id,
          name: child.name
        }))
        console.log(combinedData, 'combinedData')

        setRegions(combinedData)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegions()
  }, [])

  const handleSelection = async (event, newValue) => {
    if (newValue) {
      const { id, name } = newValue
      setSelectedRegion(newValue) // Cập nhật giá trị selectedRegion ngay lập tức

      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }

        // First, check if the door group already exists
        const groupSearchResponse = await axios.get(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups',
          config
        )

        const existingGroup = Object.values(groupSearchResponse.data.rows).find(group => group.name === name)
        let doorGroupId

        if (existingGroup) {
          doorGroupId = existingGroup.id
        } else {
          // If the door group does not exist, create a new one
          const createGroupResponse = await axios.post(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups',
            {
              description: 'string',
              name: name,
              parentId: postParentId
            },
            config
          )

          doorGroupId = createGroupResponse.data.id
        }

        // Now, check if the door already exists
        const doorSearchResponse = await axios.get(
          'https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors',
          config
        )

        const existingDoor = Object.values(doorSearchResponse.data.rows).find(door => door.name === name)

        if (existingDoor) {
          setName(existingDoor.name)
          setIdDoor(existingDoor.id)
        } else {
          // Create the new door if it does not exist
          const createDoorResponse = await axios.post(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors',
            {
              description: 'string',
              doorGroupId: doorGroupId,
              name: name
            },
            config
          )

          setName(createDoorResponse.data.name)
          setIdDoor(createDoorResponse.data.id)
        }
      } catch (error) {
        console.error('Error handling selection:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Device Information'
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
                    <Button variant='contained' component={Link} href={`/device-management`}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ float: 'right', marginLeft: '2%' }}>
                    <Button aria-label='Bộ lọc' variant='contained' onClick={handleUpdateDevice}>
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            }
          />
        </Card>
        <Grid style={{ margin: '0.3rem' }}></Grid>
        <Grid container spacing={0}>
          <Grid
            container
            item
            component={Paper}
            style={{ backgroundColor: 'white', width: '100%', padding: '10px', maxHeight: 600, paddingTop: '50px' }}
          >
            <Grid item xs={2.8}>
              <CustomTextField
                label='Name'
                value={device ? device.name : ''}
                onChange={e => handleInputChange('name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <Autocomplete
                options={deviceGroups}
                getOptionLabel={option => option.name}
                value={
                  deviceGroups.find(
                    group => group.id === (device && device.deviceGroup ? device.deviceGroup.id : '')
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleInputChange('deviceGroupId', newValue.id)
                    setDevice(prevDevice => ({
                      ...prevDevice,
                      deviceGroup: { id: newValue.id, name: newValue.name }
                    }))
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Device Group' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Device ID '
                onChange={e => handleInputChange('serialNumber', e.target.value)}
                value={device ? device.serialNumber : ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <Autocomplete
                options={deviceTypeOptions}
                getOptionLabel={option => option.label}
                value={deviceTypeOptions.find(option => option.value === (device ? device.deviceType : '')) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleInputChange('deviceType', newValue.value)
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Device Type' fullWidth />}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Upgrade App Version'
                value={device ? device.firmware : ''}
                onChange={e => handleInputChange('firmware', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Product Name'
                value={device ? device.model : ''}
                onChange={e => handleInputChange('model', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <Autocomplete
                options={directionOptions}
                getOptionLabel={option => option.label}
                value={directionOptions.find(option => option.value === (device ? device.direction : '')) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setDevice(prevDevice => ({ ...prevDevice, direction: newValue.value }))
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Identifier Dimension' fullWidth />}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                placeholder='Enter Hardware Version Type...'
                disabled
                label='Hardware Version'
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField placeholder='Enter Energy Type...' disabled label='Energy Type' fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <Autocomplete
                options={regions}
                getOptionLabel={option => option.name}
                onChange={handleSelection}
                value={selectedRegion} // Set the selected value here
                renderInput={params => (
                  <>
                    {console.log({ ...params }, 'params')}
                    <CustomTextField
                      {...params}
                      label='Location'
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  </>
                )}
                loading={loading}
              />
            </Grid>

            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Note'
                value={device ? device.description : ''}
                onChange={e => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <p style={{ fontSize: '0.8rem' }}>Restore Device Settings</p>
            <Grid item xs={2.8} style={{ marginTop: 39, display: 'inline-flex', marginLeft: '-145px' }}>
              <Grid>
                <Button fullWidth variant='contained'>
                  All
                </Button>
              </Grid>
              <Grid fullWidth style={{ marginLeft: '3%' }}>
                <Button variant='contained'>Restore Network</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default InforAll
