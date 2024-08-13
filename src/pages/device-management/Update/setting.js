import { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { Box, Button, Card, CardHeader, FormControlLabel, Paper, Grid, Checkbox } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'

const Setting = ({ idSetting }) => {
  const [device, setDevice] = useState({
    ipAddress: '',
    settings: {
      gateway: '',
      netmask: '',
      mac: ''
    }
  })

  const [isDHCPEnabled, setIsDHCPEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const fetchDataList1 = async () => {
    if (!idSetting) return

    setLoading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices/${idSetting}`, config)
      const deviceData = response.data
      setDevice(deviceData)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idSetting) {
      fetchDataList1()
    }
  }, [idSetting]) // Add idInfor as a dependency

  const handleChange = e => {
    const { name, value } = e.target
    setDevice(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSettingsChange = e => {
    const { name, value } = e.target
    setDevice(prevState => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        [name]: value
      }
    }))
  }

  const handleDHCPChange = e => {
    setIsDHCPEnabled(e.target.checked)
  }

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
        ipAddress: device.ipAddress,
        settings: {
          gateway: device.settings.gateway,
          netmask: device.settings.netmask,
          mac: device.settings.mac
        }
      }

      const response = await axios.put(
        `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices/${idSetting}`,
        params,
        config
      )
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
    } catch (error) {
      console.error('Error updating user details:', error)
      setLoading(false)

      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#FF9F43'
            confirmButton.style.color = 'white'
          }
        }
      })
    }
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Network Configuration'
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
            style={{ backgroundColor: 'white', width: '100%', padding: '10px', height: '300px', paddingTop: '50px' }}
          >
            <Grid container spacing={2} style={{ marginLeft: '20px' }}>
              <Grid item xs={12}>
                <p>TCP/IP</p>
                <FormControlLabel
                  control={<Checkbox checked={isDHCPEnabled} onChange={handleDHCPChange} />}
                  label='Use DHCP'
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='IP Address'
                placeholder='Enter IP Address...'
                name='ipAddress'
                value={device ? device.ipAddress : ''}
                onChange={handleChange}
                disabled={isDHCPEnabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Gateway'
                placeholder='Enter Gateway...'
                name='gateway'
                onChange={handleSettingsChange}
                value={device.settings ? device.settings.gateway : ''}
                disabled={isDHCPEnabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Subnet Mask'
                placeholder='Enter Subnet Mask...'
                name='netmask'
                onChange={handleSettingsChange}
                value={device.settings ? device.settings.netmask : ''}
                disabled={isDHCPEnabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Mac Address'
                name='mac'
                onChange={handleSettingsChange}
                disabled={isDHCPEnabled}
                placeholder='Enter Mac Address...'
                value={device.settings ? device.settings.mac : ''}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Setting
