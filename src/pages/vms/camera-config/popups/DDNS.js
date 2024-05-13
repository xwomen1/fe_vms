import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, Checkbox, Autocomplete, DialogActions, Button } from '@mui/material'

const DDNS = cameras => {
  const [DDNSOption, setDDNS] = useState([])
  const defaultValue = cameras.camera?.ddnsType?.name || ''

  const [DDNS, setSelectedDDNSType] = useState({
    label: cameras.camera?.ddnsType?.name || '',
    value: cameras.camera?.ddnsType?.name || ''
  })

  const handleDDNSChange = (event, newValue) => {
    setSelectedDDNSType(newValue || defaultValue)
  }
  useEffect(() => {
    setSelectedDDNSType({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const fetchDDNS = async () => {
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

      const nicTypes = response.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setDDNS(nicTypes)

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
    fetchDDNS()
  }
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
              value={DDNS}
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
        <Grid item xs={12}>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button type='submit' variant='contained'>
              Lưu
            </Button>
            <Button variant='tonal'>Mặc định</Button>
            <Button variant='tonal' color='secondary'>
              Hủy
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default DDNS
