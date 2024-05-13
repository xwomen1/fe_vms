import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  Grid,
  IconButton,
  Paper,
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

const Device = ({ onClose, camera }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [channel, setChannel] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  const [cameras, setCamera] = useState(null)

  const [cameraGroupSelect, setCameraGroupSelect] = useState({
    label: cameras?.cameraGroup?.name || '',
    value: cameras?.cameraGroup?.name || ''
  })
  const [isOfflineSetting, setisOfflineSetting] = useState([])
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

  const handleCheckboxChange = event => {
    setisOfflineSetting(event.target.value)
  }

  const handleAddRow = () => {
    const newRow = { groupName: '', groupCode: '', groupId: '' } // Thêm groupId vào đây
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
          setOnvif(response.data.onvif)
          console.log(response.data)
          setLat(response.data.lat)
          setLng(response.data.long)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

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
        lat: lat.toString(),
        long: lng.toString()
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, data, config)
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

  const handleComboboxFocus = () => {
    if (cameraGroup.length === 0) {
      fetchNicTypes()
    }
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} onChange={handleCheckboxChange} />

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

      const nicTypes = response.data.map(item => ({
        id: item.id,
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setCameraGroup(nicTypes)
      console.log(nicTypes)
      if (nicTypes.length > 0) {
        setCameraGroupSelect(nicTypes[0].value)
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
              renderInput={params => (
                <CustomTextField
                  {...params}
                  options={channel}
                  getOptionLabel={option => option.channel}
                  label='Giao thức'
                  fullWidth
                  onFocus={handleComboboxFocus}
                />
              )}
              loading={loading}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <Autocomplete
              renderInput={params => <CustomTextField {...params} label='Vùng' fullWidth />}
              loading={loading}
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
            {formatDDNS(true)} thiết bị đang ngoại tuyến
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
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={channel}
                        getOptionLabel={option => option.channel}
                        value={row.name}
                        onChange={(event, newValue) => {
                          const updatedRows = [...rows]
                          updatedRows[index].name = newValue.name
                          updatedRows[index].groupCode = newValue.groupCode
                          updatedRows[index].groupId = newValue.groupId
                          setRows(updatedRows)
                        }}
                        renderInput={params => <CustomTextField {...params} label='Kênh' />}
                      />
                    </TableCell>
                    <TableCell>{row.groupCode}</TableCell>
                    <TableCell align='right'></TableCell>
                    <TableCell align='right'></TableCell>

                    <TableCell align='center'>
                      {index > 0 && (
                        <IconButton size='small' onClick={() => handleDeleteRow(index)}>
                          <Icon icon='bi:trash' />
                        </IconButton>
                      )}
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
              onClick={handleMapClick} // Call handleMapClick function on map click
            >
              {lat && lng && (
                <Marker latitude={parseFloat(lat)} longitude={parseFloat(lng)} offsetLeft={-20} offsetTop={-20}>
                  <div>
                    <MapPin size={48} strokeWidth={2} color={'#bf40ba'} />
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
