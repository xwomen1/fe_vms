import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import Swal from 'sweetalert2'
import ReactMapGL, { Marker, Popup } from '@goongmaps/goong-map-react'
import { MapPin } from 'tabler-icons-react'

const Device = ({ onClose, nvr }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [channel, setChannel] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  const [regions, setRegions] = useState([])

  const [cameras, setCamera] = useState(null)

  const [cameraGroupSelect, setCameraGroupSelect] = useState({
    label: cameras?.cameraGroup?.name || '',
    value: cameras?.cameraGroup?.name || ''
  })

  const [regionsSelect, setRegionsSelect] = useState({
    label: cameras?.regions?.name || '',
    value: cameras?.regions?.name || ''
  })
  const [isOfflineSetting, setisOfflineSetting] = useState(false)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [cameraName, setCameraName] = useState(null)
  const [userName, setUserName] = useState(null)
  const [ipAddress, setIpAddress] = useState(null)
  const [http, setHttp] = useState(null)
  const [onvif, setOnvif] = useState(null)

  const [viewport, setViewport] = React.useState({
    longitude: 105.83416,
    latitude: 21.027763,
    zoom: 14
  })

  const handleLatitudeChange = event => {
    setLat(event.target.value)
  }

  const handleLongitudeChange = event => {
    setLng(event.target.value)
  }

  const handleHttpChange = event => {
    setHttp(event.target.value)
  }

  const handleOnvifChange = event => {
    setOnvif(event.target.value)
  }

  const handleMapClick = location => {
    const clickedLat = location.lngLat[1]
    const clickedLng = location.lngLat[0]
    setLat(clickedLat)
    setLng(clickedLng)
  }
  const GOONG_MAP_KEY = 'MaRpQPZORjHfEMC3tpTGCLlPqo5qXDkzvcemJZWO'

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleCameraNameChange = event => {
    setCameraName(event.target.value)
  }

  const handleUserNameChange = event => {
    setUserName(event.target.value)
  }

  const handleIpAddressChange = event => {
    setIpAddress(event.target.value)
  }

  const handleCheckboxChange = () => {
    setisOfflineSetting(isOfflineSetting === true ? false : true)
  }

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', groupId: '' } // Thêm groupId vào đây
    setRows([...rows, newRow])
  }

  console.log(nvr)
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (nvr != null) {
          // Kiểm tra xem popup Network đã mở chưa
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
          console.log('token', token)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, config)
          setCamera(response.data)
          setCameraName(response.data.name)
          setUserName(response.data.username)
          setPassword(response.data.password)
          setIpAddress(response.data.ipAddress)
          setHttp(response.data.httpPort)
          setOnvif(response.data.onvif)
          console.log(nvr)
          setLat(response.data.lat)
          setLng(response.data.long)
          setisOfflineSetting(response.data.isOfflineSetting)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [nvr])

  const handleSaveClick = async () => {
    handleSave() // Gọi hàm handleSave truyền từ props
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        name: cameraName,
        userName: userName,
        password: password,
        ipAddress: ipAddress,
        http: http,
        onvif: onvif,

        isOfflineSetting: isOfflineSetting
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/${nvr}`, data, config)
      setLoading(false)
      Swal.fire('Lưu thành công!', '', 'success')

      onClose()
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire(error.message, error.response?.data?.message)
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleComboboxFocusRegions = () => {
    if (regions.length === 0) {
      fetchRegions()
    }
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} onChange={handleCheckboxChange} />

  const channelOptions = [
    { channel: 'ONVIF' },
    { channel: 'IVI' },
    { channel: 'HIKVISION' },
    { channel: 'DAHUA' },
    { channel: 'AXIS' },
    { channel: 'BOSCH' },
    { channel: 'HANWHA' },
    { channel: 'PANASONIC' }
  ]

  const fetchRegions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://sbs.basesystem.one/ivis/infrares/api/v0/regions?limit=25&page=1&parentID=abbe3f3c-963b-4d23-a766-42a8261607c3',
        config
      )

      const nicTypes = response.data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setRegions(nicTypes)
      console.log(nicTypes)
      if (nicTypes.length > 0) {
        setRegionsSelect(nicTypes[0].value)
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCameraGroupChange = (event, newValue) => {
    setCameraGroupSelect(newValue)
  }

  const handleRegionsChange = (event, newValue) => {
    setRegionsSelect(newValue)
  }

  return (
    <div style={{ width: '100%' }}>
      {loading && <CircularProgress />}

      <Grid container spacing={2} style={{ minWidth: 500 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Tên thiết bị'
              type='text'
              value={cameraName}
              onChange={handleCameraNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Tên người dùng'
              type='text'
              value={userName}
              onChange={handleUserNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <CustomTextField label='Mật khẩu' type='text' value={password} onChange={handlePasswordChange} fullWidth />
          </Grid>

          <Grid item xs={3.9}>
            <CustomTextField
              label='Địa chỉ IP'
              type='text'
              value={ipAddress}
              onChange={handleIpAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Cổng http' type='text' value={http} onChange={handleHttpChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>

          <Grid item xs={4}>
            <CustomTextField label='Cổng onvif ' type='text' value={onvif} onChange={handleOnvifChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              options={channelOptions}
              getOptionLabel={option => option.channel}
              renderInput={params => <CustomTextField {...params} label='Giao thức' fullWidth />}
            />
          </Grid>

          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={regionsSelect}
              onChange={handleRegionsChange}
              options={regions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Vùng' fullWidth />}
              onFocus={handleComboboxFocusRegions}
            />{' '}
          </Grid>

          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            {formatDDNS(isOfflineSetting)} thiết bị đang ngoại tuyến
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid item xs={12}>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button type='submit' variant='contained' onClick={handleSaveClick}>
            Lưu
          </Button>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Grid>
    </div>
  )
}

export default Device
