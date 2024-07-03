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

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleCancel = () => {
    onClose()
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/networkconfig/{idNVR}?idNVR=${nvr}`,
          config
        )

        setNvrs(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cấu hình video</DialogTitle>
      <DialogContent>
      <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
       
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
        <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Camera</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Stream type</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Video type</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          
    
        </Grid>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
        <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Resolution</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Bitrate type</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Video Quality</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          
    
        </Grid>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
        <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Frame Rate</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Video Encoding</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={0.2}>
              
            </Grid>
            <Grid item xs={3.8}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>H.264+</InputLabel>
                <Select
                  labelId='time-validity-label'
                  id='time-validity-select'
                 
                >
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          
            
        <Grid item xs={4}>
          <CustomTextField label='Max Bitrate' type='text'  fullWidth />
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
