import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Box, Button, Card, CardHeader, Grid, Autocomplete, Paper } from '@mui/material'
import Link from 'next/link'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'

const InforDoor = ({ idSetting }) => {
  const [inforDoor, setInforDoor] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [deviceGroups, setDeviceGroups] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const deviceTypeOptions = [
    { label: 'ACCESS CONTROL', value: 'ACCESS_CONTROL' },
    { label: 'ENROLL', value: 'ENROLL' },
    { label: 'BUS', value: 'BUS' }
  ]

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    if (idSetting) {
      fetchDataList()
    }
  }, [idSetting])

  const fetchDataList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/${idSetting}`,
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

  useEffect(() => {
    fetchDeviceGroups()
  }, [])

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
      setDeviceGroups(allGroups)
    } catch (error) {
      console.error('Error fetching device groups:', error)
      toast.error(error.message || 'Error fetching device groups')
    } finally {
      setLoading(false)
    }
  }

  const updateDoor = async () => {
    setLoading(true)
    try {
      const updateData = {
        description: inforDoor.description,
        doorGroupId: selectedGroup ? selectedGroup.id : inforDoor.doorGroupId,
        name: inforDoor.name
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors/${idSetting}`,
        updateData,
        config
      )

      Swal.fire({
        title: 'Successful!',
        text: 'Update successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      console.log(response.data, 'updateData')
    } catch (error) {
      console.error('Error updating door:', error)
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Door Config'
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
              <Grid item xs={5.8}>
                <Autocomplete
                  options={deviceGroups}
                  getOptionLabel={option => option.name}
                  renderInput={params => <CustomTextField {...params} label='Device group' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={5.8}>
                <Autocomplete
                  options={deviceTypeOptions}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Device type' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={5.8} style={{ marginTop: 20 }}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  disabled
                  renderInput={params => <CustomTextField {...params} label='Designation direction' fullWidth />}
                  loading={loading}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={5.8} style={{ marginTop: 20 }}>
                <Autocomplete
                  getOptionLabel={option => option.name}
                  renderInput={params => <CustomTextField {...params} label='Device' fullWidth />}
                  disabled
                  loading={loading}
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
