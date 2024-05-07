import { useRouter } from 'next/router'

import { useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Switch } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

const TCP = (cameras, nic) => {
  const [nicTypeOptions, setNicTypeOptions] = useState([])
  const [selectedNicType, setSelectedNicType] = useState(cameras.camera.nicType?.name || '')

  const handleNicTypeChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }
  const [loading, setLoading] = useState(false)

  const fetchNicTypes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/combox?cameraType=network_nic_type',
        config
      )

      const nicTypes = response.data.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setNicTypeOptions(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNicType(nicTypes[0].value) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComboboxFocus = () => {
    if (nicTypeOptions.length === 0) {
      fetchNicTypes()
    }
  }

  const formatDDNS = ddns => <Checkbox checked={ddns} disabled />

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <Autocomplete
              defaultValue={cameras.camera?.dhcp || ''}
              onChange={handleNicTypeChange}
              options={nicTypeOptions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Loại NIC' fullWidth />}
              onFocus={handleComboboxFocus}
              loading={loading}
            />
          </Grid>
          {console.log(cameras.camera.nicType?.name)}

          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <Switch checked={cameras.camera?.dhcp} color='primary' />
            DHCP
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='MTU' value={cameras.camera.mtu} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField label='Multicast Address' fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            {formatDDNS(cameras?.camera.ddns)} Enable Multicast Discovery
          </Grid>
          <Grid item xs={0.4}></Grid>

          <Grid item xs={5.8}>
            <CustomTextField label='Preferred DNS Server' value={cameras.camera.prefDNS} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField
              label='Alternate DNS Server
              '
              value={cameras.camera.alterDNS}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={0.4}></Grid>
      </Grid>
      <br />
    </div>
  )
}

export default TCP
