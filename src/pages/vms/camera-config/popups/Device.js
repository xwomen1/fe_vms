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
import { MapPin } from './MapPin'

const CustomMapPin = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='40'
    height='40'
    viewBox='0 0 24 24'
    stroke='orange'
    fill='orange'
    className='icon icon-tabler icons-tabler-filled icon-tabler-map-pin'
  >
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z' />
  </svg>
)

const Device = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [channel, setChannel] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  const [regions, setRegions] = useState([])

  const [cameras, setCamera] = useState(null)
  const [selectedProtocol, setSelectedProtocol] = useState(null)

  const [protocols, setProtocols] = useState([
    { label: 'ONVIF', value: 'ONVIF', id: 'ONVIF', name: 'ONVIF' },
    { label: 'IVI', value: 'IVI', id: 'IVI', name: 'IVI' },
    { label: 'HIKVISION', value: 'HIKVISION', id: 'HIKVISION', name: 'HIKVISION' },
    { label: 'DAHUA', label: 'DAHUA', id: 'DAHUA', name: 'DAHUA' },
    { label: 'AXIS', value: 'AXIS', id: 'AXIS', name: 'AXIS' },
    { label: 'BOSCH', value: 'BOSCH', id: 'BOSCH', name: 'BOSCH' },
    { label: 'HANWHA', value: 'HANWHA', id: 'HANWHA', name: 'HANWHA' },
    { label: 'PANASONIC', value: 'PANASONIC', id: 'PANASONIC', name: 'PANASONIC' }
  ])
  const defaultValue = cameras?.type?.name || ''

  const [cameraGroupSelect, setCameraGroupSelect] = useState({
    label: cameras?.type?.name || '',
    value: cameras?.type?.name || ''
  })

  const [regionsSelect, setRegionsSelect] = useState('')
  const [isOfflineSetting, setisOfflineSetting] = useState(false)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [cameraName, setCameraName] = useState(null)
  const [userName, setUserName] = useState(null)
  const [nameChannel, setNameChannel] = useState(null)
  const [proxied, setProxied] = useState(null)
  const [channelUrl, setChannelUrl] = useState(null)
  const [streamType, setStreamType] = useState(null)

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

  const handleProtocolChange = (event, newValue) => {
    setSelectedProtocol(newValue)
  }

  const handleUserNameChange = event => {
    setUserName(event.target.value)
  }

  const handleChannelNameChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].name = event.target.value
    setRows(newRows)
  }

  const handleChannelUrlChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].url = event.target.value
    setRows(newRows)
  }

  const handleProxiedChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].isProxied = event.target.checked
    setRows(newRows)
  }

  const handleStreamTypeChange = (index, event) => {
    const newRows = [...rows]
    newRows[index].type = event.target.value
    setRows(newRows)
  }

  const handleIpAddressChange = event => {
    setIpAddress(event.target.value)
  }

  const handleCheckboxChange = () => {
    setisOfflineSetting(isOfflineSetting === true ? false : true)
  }

  const handleAddRow = () => {
    const newRow = { name: '', isProxied: false, url: '', type: '' } // Ensure isProxied is a boolean
    setRows([...rows, newRow])
  }

  console.log(camera)
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (camera != null) {
          // Kiểm tra xem popup Network đã mở chưa
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
          console.log('token', token)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, config)
          setCamera(response.data)
          setCameraName(response.data.name)
          setUserName(response.data.username)
          setPassword(response.data.password)
          setIpAddress(response.data.ipAddress)
          setHttp(response.data.httpPort)
          setRows(response.data.streams || [])
          setOnvif(response.data.onvif)
          console.log(response.data)
          setLat(response.data.lat)
          setLng(response.data.long)
          setisOfflineSetting(response.data.isOfflineSetting)
          setCameraGroupSelect({
            label: response.data.type.name || '',
            value: response.data.type.name || ''
          })
          setSelectedProtocol({
            label: response.data.protocol.name || '',
            value: response.data.protocol.name || ''
          })
          setRegionsSelect({
            label: response.data.location || '',
            value: response.data.location || ''
          })
          console.log(response.data.regions, 'regions')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])
  useEffect(() => {
    setCameraGroupSelect({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

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
        httpPort: http,
        type: cameraGroupSelect,
        onvif: onvif,
        lat: lat.toString(),
        long: lng.toString(),
        isOfflineSetting: isOfflineSetting,
        streams: rows,
        type: {
          id: cameraGroupSelect.id || cameras.type.id,
          name: cameraGroupSelect.name || cameras.type.name
        },
        protocol: {
          id: selectedProtocol.id || cameras.protocol.id,
          name: selectedProtocol.name || cameras.protocol.name
        },
        location: regionsSelect.name
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, data, config)
      setLoading(false)
      Swal.fire('Lưu thành công!', '', 'success')

      onClose()
    } catch (error) {
      // console.error(error)
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
    { label: 'ONVIF', value: 'ONVIF' },
    { label: 'IVI', value: 'IVI' },
    { label: 'HIKVISION', value: 'HIKVISION' },
    { label: 'DAHUA', label: 'DAHUA' },
    { label: 'AXIS', value: 'AXIS' },
    { label: 'BOSCH', value: 'BOSCH' },
    { label: 'HANWHA', value: 'HANWHA' },
    { label: 'PANASONIC', value: 'PANASONIC' }
  ]

  const handleDeleteRow = index => {
    const updatedRows = [...rows]
    updatedRows.splice(index, 1)
    setRows(updatedRows)
  }

  const fetchNicTypes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups', config)

      const cameraGroup = response.data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setCameraGroup(cameraGroup)
      console.log(cameraGroup)
      if (cameraGroup.length > 0) {
        setCameraGroupSelect(cameraGroup[0].value)
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComboboxFocus = () => {
    fetchNicTypes()
    console.log('Fetching NIC types...') // Add this line
  }
  console.log(regions, 'vùng')

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
            <Autocomplete
              value={cameraGroupSelect}
              onChange={handleCameraGroupChange}
              options={cameraGroup}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Nhóm Camera' fullWidth />}
              onFocus={handleComboboxFocus}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
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
          <Grid item xs={4}>
            <CustomTextField label='Cổng http' type='text' value={http} onChange={handleHttpChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Cổng onvif ' type='text' value={onvif} onChange={handleOnvifChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={selectedProtocol}
              onChange={handleProtocolChange}
              options={protocols}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Giao thức' fullWidth />}
            />
          </Grid>

          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <Autocomplete
              value={regionsSelect}
              onChange={handleRegionsChange}
              options={regions}
              getOptionLabel={option => option.label}
              renderInput={params => <CustomTextField {...params} label='Vùng' fullWidth />}
              onFocus={handleComboboxFocusRegions}
            />{' '}
          </Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Latitude' type='text' value={lat || ''} onChange={handleLatitudeChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Longtitude'
              type='text'
              value={lng || ''}
              onChange={handleLongitudeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            {formatDDNS(isOfflineSetting)} thiết bị đang ngoại tuyến
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>Kênh</Typography>
        </Grid>
        <Grid item xs={11.8} component={Paper}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên Kênh</TableCell>
                  <TableCell>Proxied</TableCell>
                  <TableCell align='right'>Channel URL </TableCell>
                  <TableCell align='right'>StreamType </TableCell>

                  <TableCell align='center'>
                    <IconButton size='small' onClick={handleAddRow}>
                      <Icon icon='tabler:plus' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows &&
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomTextField
                          type='text'
                          value={row.name}
                          onChange={event => handleChannelNameChange(index, event)}
                          fullWidth
                        />{' '}
                      </TableCell>
                      <TableCell>
                        {' '}
                        <Checkbox checked={row.isProxied} onChange={event => handleProxiedChange(index, event)} />
                      </TableCell>
                      <TableCell align='right'>
                        <CustomTextField
                          type='text'
                          value={row.url}
                          onChange={event => handleChannelUrlChange(index, event)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <CustomTextField
                          type='text'
                          value={row.type}
                          onChange={event => handleStreamTypeChange(index, event)}
                          fullWidth
                        />
                      </TableCell>

                      <TableCell align='center'>
                        <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>{' '}
        {viewport && (
          <Grid item xs={12}>
            <ReactMapGL
              {...viewport}
              width='100%'
              height='30vh'
              onViewportChange={setViewport}
              goongApiAccessToken={GOONG_MAP_KEY}
              onClick={handleMapClick}
            >
              {lat && lng && (
                <Marker latitude={parseFloat(lat)} longitude={parseFloat(lng)} offsetLeft={-20} offsetTop={-20}>
                  <div>
                    <CustomMapPin />{' '}
                  </div>
                </Marker>
              )}
            </ReactMapGL>
          </Grid>
        )}
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
