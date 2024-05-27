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
  const parentIdToFilter = 'fa7f0b8b-56a7-44c7-96d6-997e7fc55304'
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

      // Fetch regions and set Autocomplete value if doorName matches any region name
      await fetchRegions() // Ensure fetchRegions updates regions before proceeding
      setRegions(currentRegions => {
        const matchingRegion = currentRegions.find(region => region.name === deviceData.doorName)
        if (matchingRegion) {
          setSelectedRegion(matchingRegion)
        }

        return currentRegions
      })
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
        'https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1',
        config
      )
      const parentGroups = parentResponse.data || [] // Ensure it's an array

      // Fetch child groups for each parent
      const childGroupsPromises = parentGroups.map(async parentGroup => {
        const childResponse = await axios.get(
          `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/device-groups/children-lv1?parentId=${parentGroup.id}`,
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
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')

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

      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  const handleInputChange = (field, value) => {
    setDevice(prevDevice => ({
      ...prevDevice,
      [field]: value
    }))
  }

  const fetchRegions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = response.data

      const parentRegion = data.find(region => region.id === parentIdToFilter)

      if (parentRegion) {
        const childResponse = await axios.get(
          `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=${parentIdToFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const childData = childResponse.data

        const combinedData = [
          {
            id: parentRegion.id,
            name: parentRegion.name
          },
          ...childData.map(child => ({
            id: child.id,
            name: child.name
          }))
        ]

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

      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }

        const data = {
          description: 'string',
          name: name,
          parentId: postParentId
        }

        let response
        try {
          response = await axios.post(
            'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups',
            data,
            config
          )

          // Use the id from the successful creation
          const doorGroupId = response.data.id

          const doorData = {
            description: 'string',
            doorGroupId: doorGroupId,
            name: name
          }

          // Post to create a new door
          await axios.post('https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors', doorData, config)
        } catch (createError) {
          if (createError.response && createError.response.status === 400) {
            const searchResponse = await axios.get(
              'https://dev-ivi.basesystem.one/smc/access-control/api/v0/door-groups',
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )

            const existingGroup = Object.values(searchResponse.data.rows).find(group => group.name === name)

            if (existingGroup) {
              const doorData = {
                description: 'string',
                doorGroupId: existingGroup.id,
                name: name
              }

              // Post to create a new door
              await axios.post('https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors', doorData, config)
            } else {
              throw new Error('Không tìm thấy door-group phù hợp.')
            }
          } else {
            throw createError
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const searchResponse = await axios.get('https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const existingDoor = Object.values(searchResponse.data.rows).find(group => group.name === name)
          setName(existingDoor.name)
          setIdDoor(existingDoor.id)
        }
        console.error('Error posting data:', error)
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
            title='Thông tin thiết bị'
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
                      Hủy
                    </Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ float: 'right', marginLeft: '2%' }}>
                    <Button aria-label='Bộ lọc' variant='contained' onClick={handleUpdateDevice}>
                      Lưu
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
                label='Tên'
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
                renderInput={params => <CustomTextField {...params} label='Nhóm thiết bị' fullWidth />}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='ID thiết bị '
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
                renderInput={params => <CustomTextField {...params} label='loại thiết bị' fullWidth />}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Nâng cấp phiên bản app'
                value={device ? device.firmware : ''}
                onChange={e => handleInputChange('firmware', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Tên sản phẩm '
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
                renderInput={params => <CustomTextField {...params} label='Chiều định danh' fullWidth />}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                placeholder='  Nhập loại Hardware Version...'
                disabled
                label='Hardware Version'
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField placeholder='  Nhập loại năng lượng...' disabled label='Loại năng lượng' fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <Autocomplete
                options={regions}
                getOptionLabel={option => option.name}
                onChange={handleSelection}
                value={selectedRegion} // Set the selected value here
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Vị trí'
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
                )}
                loading={loading}
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                label='Ghi chú'
                value={device ? device.description : ''}
                onChange={e => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <p style={{ fontSize: '0.8rem' }}>Khôi phục cài đặt thiết bị</p>
            <Grid item xs={2.8} style={{ marginTop: 39, display: 'inline-flex', marginLeft: '-145px' }}>
              <Grid>
                <Button fullWidth variant='contained'>
                  Toàn bộ
                </Button>
              </Grid>
              <Grid fullWidth style={{ marginLeft: '3%' }}>
                <Button variant='contained'>Khôi phục cài đặt mạng </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default InforAll
