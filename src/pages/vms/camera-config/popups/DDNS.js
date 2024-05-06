import { useRouter } from 'next/router'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Autocomplete } from '@mui/material'

import Paper from '@mui/material/Paper'

const DDNS = cameras => {
  const [DDNSOption, setDDNS] = useState([])

  const handleDDNSChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }

  const fetchNicTypes = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/combox?cameraType=network_ddns_type',
        config
      )

      const nicTypes = response.data.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setDDNS(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNicType(nicTypes[0].value) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleComboboxFocus = () => {
    // if (DDNSOption.length === 0) {
    fetchNicTypes()

    // }
  }
  console.log('param', cameras?.camera.ddnsType)
  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            {formatDDNS(cameras?.camera.ddns)} Enable DDNS
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}></Grid>
          <Grid item xs={5.8}>
            <Autocomplete
              value={cameras.camera?.ddnsType?.name || ''}
              onChange={handleDDNSChange}
              options={DDNSOption}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='DDNS Type' fullWidth />}
              onFocus={handleComboboxFocus}

              // loading={loading}
            />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='User Name' value={cameras?.camera?.userName} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Server Address' value={cameras?.camera.serverAddressNTP} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Password' value={cameras?.camera.password} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Port' value={cameras?.camera.port} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Confirm' value={cameras?.camera.confirm} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Domain' value={cameras?.camera.domain} fullWidth />
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default DDNS
