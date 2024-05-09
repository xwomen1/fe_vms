import { useState } from 'react'
import { Grid, Paper } from '@mui/material'

import authConfig from 'src/configs/auth'
import axios from 'axios'

import { Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

const RolePopup = ({ open, onClose }) => {
  const [DDNSOption, setDDNS] = useState([])

  const handleDDNSChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }

  const handleCancel = () => {
    onClose()
  }

  const fetchCameraTypes = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/combox?cameraType=camera',
        config
      )

      const nicTypes = response.data.map(item => ({
        label: item.name,
        value: item.value
      }))
      setDDNS(nicTypes)

      if (nicTypes.length > 0) {
        setSelectedNicType(nicTypes[0].value)
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
    }
  }

  const handleCamera = () => {
    fetchCameraTypes()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cấu hình video</DialogTitle>
      <DialogContent>
        <div style={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Camera' fullWidth />}
                  onFocus={handleCamera}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Stream Type' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Video type' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
            </Grid>
            <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Resolution' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Bitrate type' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Video Quality' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
            </Grid>
            <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Frame Rate' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='Video Encoding' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={3.8}>
                <Autocomplete
                  onChange={handleDDNSChange}
                  options={DDNSOption}
                  getOptionLabel={option => option.label}
                  renderInput={params => <CustomTextField {...params} label='H.264+' fullWidth />}
                  onFocus={handleCamera}

                  // loading={loading}
                />
              </Grid>

              <Grid item xs={4}>
                <CustomTextField label='Max Bitrate' type='text' fullWidth />
              </Grid>
            </Grid>
          </Grid>
          <br />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
