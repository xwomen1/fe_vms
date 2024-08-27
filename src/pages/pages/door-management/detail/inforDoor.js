import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Box, Button, Card, CardHeader, Grid, Autocomplete, Paper } from '@mui/material'
import Link from 'next/link'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'

const InforDoor = ({ idInfor }) => {
  const [inforDoor, setInforDoor] = useState({})
  const [loading, setLoading] = useState(false)
  const [deviceGroups, setDeviceGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (idInfor) {
      fetchDataList()
    }
  }, [idInfor])

  useEffect(() => {
    fetchDeviceGroups()
  }, [])

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/${idInfor}`,
        config
      )
      const deviceData = response.data
      setInforDoor(deviceData)
      setSelectedGroup(deviceData.doorGroup)
      console.log(deviceData, 'deviceData')
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeviceGroups = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

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

  const formatDate = timestamp => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const updateDoor = async () => {
    setLoading(true)
    try {
      const updateData = {
        description: inforDoor.description,
        doorGroupId: selectedGroup ? selectedGroup.id : inforDoor.doorGroupId,
        name: inforDoor.name,
        deviceId: inforDoor.deviceId
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/${idInfor}`,
        updateData,
        config
      )

      toast.success('Cập nhật thành công!')
      console.log(response.data, 'updateData')
    } catch (error) {
      console.error('Error updating door:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Door information'
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
                      Cancel
                    </Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ float: 'right', marginLeft: '2%' }}>
                    <Button aria-label='Bộ lọc' variant='contained' onClick={updateDoor}>
                      Save
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
                  label='Name'
                  value={inforDoor ? inforDoor.name : ''}
                  onChange={e => handleInputChange('name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  options={flattenedDeviceGroups}
                  getOptionLabel={option => option.name}
                  value={selectedGroup}
                  onChange={(event, newValue) => setSelectedGroup(newValue)}
                  renderInput={params => <CustomTextField {...params} label='Door group' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={3.8}>
                <CustomTextField
                  label='Access level'
                  value={inforDoor ? inforDoor.doorAccesses?.map(access => access.name).join(', ') : ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={3.8} style={{ marginTop: 20 }}>
                <CustomTextField
                  label='Description'
                  value={inforDoor ? inforDoor.description : ''}
                  onChange={e => handleInputChange('description', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={3.8} style={{ marginTop: 20 }}>
                <CustomTextField
                  label='Last editor'
                  value={inforDoor ? inforDoor.lastUpdatedByUser?.fullName : ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={3.8} style={{ marginTop: 20 }}>
                <CustomTextField
                  label='Updated time'
                  value={inforDoor ? formatDate(inforDoor.updatedAt) : ''}
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </div>
    </>
  )
}

export default InforDoor
