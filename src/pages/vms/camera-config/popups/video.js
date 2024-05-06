import { useEffect, useState } from 'react'
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import TCP from './TCP-IP'
import DDNs from './DDNS'
import Port from './Port'
import NTP from './NTP'

import {
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

const RolePopup = ({ open, onClose, onSelect, nvr }) => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [groupName, setGroupName] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null) // Thêm trạng thái để lưu trữ id của nhóm được chọn
  const [nvrs, setNvrs] = useState([])
  const [groupCode, setGroupCode] = useState([])
  const [value, setValue] = useState('1')
  const [DDNSOption, setDDNS] = useState([])

  const handleDDNSChange = (event, newValue) => {
    setSelectedNicType(newValue)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleCancel = () => {
    onClose()
  }

  const fetchCameraTypes = async () => {
    try {
      // setLoading(true)
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

  const handleCamera = () => {
    // if (DDNSOption.length === 0) {
    fetchCameraTypes()

    // }
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

                  // loading={loading}
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
