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

const Device = ({ onClose, nvr, setReload }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [cameraGroup, setCameraGroup] = useState([])
  const [regions, setRegions] = useState([])

  const [cameras, setCamera] = useState(null)
  const [selectedProtocol, setSelectedProtocol] = useState(null)

  const [cameraGroupSelect, setCameraGroupSelect] = useState({
    label: cameras?.cameraGroup?.name || '',
    value: cameras?.cameraGroup?.name || ''
  })

  const [protocol, setProtocol] = useState()

  const [regionsSelect, setRegionsSelect] = useState([])
  const [selectNVR, setSelectedNVR] = useState('')
  const [nvrs, setNVR] = useState([])
  const [isOfflineSetting, setisOfflineSetting] = useState(false)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [cameraName, setCameraName] = useState(null)
  const [userName, setUserName] = useState(null)
  const [ipAddress, setIpAddress] = useState(null)
  const [http, setHttp] = useState(null)
  const [onvif, setOnvif] = useState(null)
  const [idBox, setIdBox] = useState(null)
  const [errorNVR, setErrorNVR] = useState(false)

  const [viewport, setViewport] = React.useState({
    longitude: 105.83416,
    latitude: 21.027763,
    zoom: 14
  })

  console.log(setReload, 'setReload')

  const handleLatitudeChange = event => {
    setLat(event.target.value)
  }

  const handleLongitudeChange = event => {
    setLng(event.target.value)
  }

  const handleProtocolChange = (event, newValue) => {
    setSelectedProtocol(newValue)
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

  const fetchNicTypesDevice = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        'https://votv.ivms.vn/votv/vms/api/v0/device/active?status=connected',
        config
      )

      const nicTypes = response.data.map(item => ({
        label: item.nameDevice,
        value: item.id
      }))
      setNVR(nicTypes)

      // // Set selectedNicType here based on your business logic
      // if (nicTypes.length > 0) {
      //   setSelectedNVR(nicTypes[0].id) // Set it to the first value in the array, or adjust as needed
      // }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleComboboxFocusDevice = () => {
    fetchNicTypesDevice()
  }

  console.log(regionsSelect, 'regionsSelect')

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

          const response = await axios.get(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}`, config)
          setCamera(response.data)
          setCameraName(response.data.name)
          setUserName(response.data.username)
          setPassword(response.data.password)
          setIpAddress(response.data.ipAddress)
          setSelectedNVR({
            value: response.data.box?.id || '',
            label: response.data.box?.name || ''
          })
          setSelectedProtocol({
            name: response.data.Protocol || ''
          })
          setIdBox({
            value: response.data.box?.id || '',
            label: response.data.box?.name || ''
          })
          setRegionsSelect({
            id: response.data.siteInfo?.id || '',
            name: response.data.siteInfo?.name || ''
          })
          setHttp(response.data.httpPort)
          setOnvif(response.data.onvifPort)
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

  console.log(selectedProtocol, 'selectprotocol')

  const handleSaveClick = async () => {
    // Kiểm tra nếu chưa chọn giá trị từ Autocomplete
    if (!selectNVR) {
      setErrorNVR(true) // Hiển thị thông báo lỗi

      return // Ngừng thực hiện nếu không có giá trị
    }

    // Nếu đã chọn giá trị, đặt lại lỗi và gọi handleSave
    setErrorNVR(false)
    await handleSave()
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
        box: {
          id: idBox.value,
          name: idBox.label
        },
        siteInfo: {
          id: regionsSelect.id,
          name: regionsSelect.name
        },
        protocol: selectedProtocol.name || '',
        isOfflineSetting: isOfflineSetting
      }

      await axios.put(`https://votv.ivms.vn/votv/vms/api/v0/nvrs/${nvr}`, data, config)
      setLoading(false)
      Swal.fire({
        title: 'Successfully!',
        text: 'Data was saved successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
      setReload()
      onClose()
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
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
        'https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions?limit=25&page=1&parentID=abbe3f3c-963b-4d23-a766-42a8261607c3',
        config
      )

      const nicTypes = response.data.map(item => ({
        id: item.id,
        name: item.name
      }))
      setRegions(nicTypes)
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
    setIdBox(newValue)
  }

  const handleRegionsChange = (event, newValue) => {
    setRegionsSelect(newValue)
  }

  useEffect(() => {
    const ApiProtocol = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: '',
            page: ''
          }
        }

        const response = await axios.get(
          'https://votv.ivms.vn/votv/vms/api/v0/cameras/options/protocol-types',
          config
        )
        setProtocol(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    ApiProtocol()
  }, [])

  return (
    <div style={{ width: '100%' }}>
      {loading && <CircularProgress />}

      <Grid container spacing={2} style={{ minWidth: 500 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Device Name'
              type='text'
              value={cameraName || ''}
              onChange={handleCameraNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Username'
              type='text'
              value={userName || ''}
              onChange={handleUserNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <CustomTextField label='Password' type='text' value={password} onChange={handlePasswordChange} fullWidth />
          </Grid>

          <Grid item xs={3.9}>
            <CustomTextField
              label='IP Address'
              type='text'
              value={ipAddress}
              onChange={handleIpAddressChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Http Port' type='text' value={http} onChange={handleHttpChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>

          <Grid item xs={4}>
            <CustomTextField label='Onvif Port ' type='text' value={onvif} onChange={handleOnvifChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={selectedProtocol || ''}
              onChange={handleProtocolChange}
              options={protocol || ''}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <CustomTextField
                  error={errorNVR}
                  helperText={errorNVR ? 'Hãy chọn Giao thức' : ''}
                  {...params}
                  label='Protocols'
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={regionsSelect || ''}
              onChange={handleRegionsChange}
              options={regions || ''}
              getOptionLabel={option => option.name}
              renderInput={params => <CustomTextField {...params} label='Region' fullWidth />}
              onFocus={handleComboboxFocusRegions}
            />{' '}
          </Grid>

          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <Autocomplete
              value={selectNVR || ''}
              onChange={handleDDNSChange}
              options={nvrs || []}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <CustomTextField
                  error={errorNVR}
                  helperText={errorNVR ? 'Hãy chọn Smart NVR' : ''}
                  {...params}
                  label='Smart NVR'
                  fullWidth
                />
              )}
              onFocus={handleComboboxFocusDevice}
            />
          </Grid>
          <Grid item xs={4}>
            {formatDDNS(isOfflineSetting)} The device is offline
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
            Save
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Grid>
    </div>
  )
}

export default Device
