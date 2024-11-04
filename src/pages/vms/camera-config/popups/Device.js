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
import DDNS from './DDNS'
import toast from 'react-hot-toast'

const CustomMapPin = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' stroke='#002060' fill='#002060'>
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z' />
  </svg>
)

const Device = ({ onClose, camera, setReload }) => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [dns, setDns] = useState(false)
  const [cameraGroup, setCameraGroup] = useState([])
  const [regions, setRegions] = useState([])
  const [disable, setDisable] = useState(true)
  const [cameras, setCamera] = useState(null)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [selectNVR, setSelectedNVR] = useState('')
  const [nvrs, setNVR] = useState([])
  const [protocol, setProtocol] = useState()
  const defaultValue = cameras?.type?.name || ''
  const [idBox, setIdBox] = useState(null)
  const [errorNVR, setErrorNVR] = useState(false)
  const [errorProtocol, setErrorProtocol] = useState(false)
  const [errorType, setErrorType] = useState(false)

  const [cameraGroupSelect, setCameraGroupSelect] = useState({
    label: cameras?.type?.name || '',
    value: cameras?.type?.name || ''
  })

  const [regionsSelect, setRegionsSelect] = useState('')
  const [isOfflineSetting, setisOfflineSetting] = useState(false)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [cameraName, setCameraName] = useState(null)
  const [userName, setUserName] = useState(null)
  const [ipAddress, setIpAddress] = useState(null)
  const [http, setHttp] = useState(null)
  const [onvif, setOnvif] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [options, setOptions] = useState([])

  const [viewport, setViewport] = React.useState({
    longitude: 105.83416,
    latitude: 21.027763,
    zoom: 14
  })
  useEffect(() => {
    setViewport(prev => ({
      ...prev,
      longitude: parseFloat(lng) || 105.83416,
      latitude: parseFloat(lat) || 21.027763
    }))
  }, [lat, lng])

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
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/active?status=connected',
        config
      )

      const nicTypes = response.data.map(item => ({
        label: item.nameDevice,
        value: item.id
      }))
      setNVR(nicTypes)

      // Set selectedNicType here based on your business logic
      if (nicTypes.length > 0) {
        setSelectedNVR(nicTypes[0].id) // Set it to the first value in the array, or adjust as needed
      }
    } catch (error) {
      console.error('Error fetching NIC types:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleComboboxFocusDevice = () => {
    fetchNicTypesDevice()
  }

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
    setIdBox(newValue)
  }

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
    setErrorProtocol(false) // Reset the error state when a protocol is selected
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
    newRows[index].codec = event.target.value
    setRows(newRows)
  }

  const handleIpAddressChange = event => {
    if (!dns) {
      setIpAddress(event.target.value)
    }
  }

  const handleCheckboxChange = () => {
    setisOfflineSetting(isOfflineSetting === true ? false : true)
  }

  const handleAddRow = () => {
    const newRow = { name: '', isProxied: false, url: '', codec: '' } // Ensure isProxied is a boolean
    setRows([...rows, newRow])
  }

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (camera != null) {
          // Kiểm tra xem popup Network đã mở chưa
          const token = localStorage.getItem(authConfig.storageTokenKeyName)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, config)
          console.log(response.data.box, 'r')
          setCamera(response.data)
          setCameraName(response.data.name)
          setUserName(response.data.username)
          setPassword(response.data.password)
          setIpAddress(response.data.ipAddress)
          setHttp(response.data.httpPort)
          setRows(response.data.streams || [])
          setOnvif(response.data.onvif)
          setIdBox({
            value: response.data.box?.id || '',
            label: response.data.box?.name || ''
          })
          setLat(response.data.lat)
          setLng(response.data.long)
          setisOfflineSetting(response.data.isOfflineSetting)
          setCameraGroupSelect({
            label: response.data.type.name || '',
            value: response.data.type.name || ''
          })
          setSelectedProtocol({
            name: response.data.protocol || ''
          })
          setSelectedNVR({
            value: response.data.box?.id || '',
            label: response.data.box?.name || ''
          })
          setRegionsSelect({
            label: response.data.location || '',
            value: response.data.location || ''
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [camera])

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (camera != null) {
          const token = localStorage.getItem(authConfig.storageTokenKeyName)

          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

          const response = await axios.get(
            `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/${camera}`,
            config
          )

          setDns(response.data.ddns)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message)
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
    // Validate selectedNVR and selectedProtocol
    if (!selectNVR) {
      setErrorNVR(true)
    } else {
      setErrorNVR(false)
    }

    if (!selectedProtocol) {
      setErrorProtocol(true)
    } else {
      setErrorProtocol(false)
    }
    if (!cameraGroupSelect) {
      setErrorType(true)
    } else {
      setErrorType(false)
    }

    // If either field has an error, do not proceed with save
    if (!selectNVR || !selectedProtocol || !cameraGroupSelect) {
      return
    }

    // Proceed with save if validation passes
    handleSave()
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

        // type: cameraGroupSelect,
        onvif: onvif,
        lat: lat.toString(),
        long: lng.toString(),
        isOfflineSetting: isOfflineSetting,
        streams: rows,
        box: {
          id: idBox.value,
          name: idBox.label
        },
        type: {
          id: cameraGroupSelect.id || cameras.type.id,
          name: cameraGroupSelect.name || cameras.type.name
        },
        protocol: selectedProtocol.name || '',
        location: regionsSelect.name
      }

      await axios.put(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${camera}`, data, config)
      setLoading(false)
      setReload(prev => prev + 1)
      Swal.fire({
        title: 'Success!',
        text: 'Updated successfully',
        icon: 'success',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })

      onClose()
    } catch (error) {
      setLoading(false)
      onClose()
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message,
        icon: 'error',
        willOpen: () => {
          const confirmButton = Swal.getConfirmButton()
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#002060'
            confirmButton.style.color = 'white'
          }
        }
      })
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleComboboxFocusRegions = () => {
    if (regions?.length === 0) {
      fetchRegions()
    }
  }
  const formatDDNS = ddns => <Checkbox checked={ddns} onChange={handleCheckboxChange} />

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

      if (cameraGroup?.length > 0) {
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
  }

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
        name: item.name,
        label: item.name,
        value: item.value
      }))
      setRegions(nicTypes)

      if (nicTypes?.length > 0) {
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
    setErrorType(false) // Reset the error state when a protocol is selected
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
          'https://sbs.basesystem.one/ivis/vms/api/v0/cameras/options/protocol-types',
          config
        )
        setProtocol(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    ApiProtocol()
  }, [])

  const handleSearchChange = async (event, newValue) => {
    setSearchValue(newValue)

    if (newValue.trim() === '') return

    try {
      const response = await axios.get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=R2BrWbt6JsHQSpDm1Y6Dtr53hrg6PQ9rZhTJJKQJ&input=${newValue}`
      )
      setOptions(response.data.predictions)
    } catch (error) {
      console.error('Lỗi khi tìm kiếm gợi ý:', error)
    }
  }

  const handlePlaceSelect = async (event, value) => {
    if (!value) return

    const placeId = value.place_id

    try {
      const detailResponse = await axios.get(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=R2BrWbt6JsHQSpDm1Y6Dtr53hrg6PQ9rZhTJJKQJ`
      )

      const placeData = detailResponse.data.result

      const location = placeData.geometry.location

      setLatitude(location.lat)
      setLongitude(location.lng)

      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: location.lat,
        longitude: location.lng
      }))
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết địa điểm:', error)
    }
  }

  useEffect(() => {
    if (latitude && longitude) {
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude,
        longitude
      }))
    }
  }, [latitude, longitude])

  const handleReturnToMarker = () => {
    if (lat && lng) {
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        zoom: 14
      }))
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {loading && <CircularProgress />}

      <Grid container spacing={2} style={{ minWidth: 500 }}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.9}>
            <CustomTextField
              label='Device Name'
              type='text'
              value={cameraName}
              onChange={handleCameraNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Username' type='text' value={userName} onChange={handleUserNameChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <CustomTextField label='Password' type='text' value={password} onChange={handlePasswordChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={cameraGroupSelect}
              onChange={handleCameraGroupChange}
              options={cameraGroup || []}
              getOptionLabel={option => option.label || ''}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Camera Type'
                  fullWidth
                  error={errorType}
                  helperText={errorType ? 'This field is required' : ''}
                />
              )}
              onFocus={handleComboboxFocus}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
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
          <Grid item xs={4}>
            <CustomTextField label='Http port' type='text' value={http} onChange={handleHttpChange} fullWidth />
          </Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='OnVif port' type='text' value={onvif} onChange={handleOnvifChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <Autocomplete
              value={selectedProtocol}
              onChange={handleProtocolChange}
              options={protocol || []}
              getOptionLabel={option => option.name || ''}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Protocol'
                  fullWidth
                  error={errorProtocol}
                  helperText={errorProtocol ? 'This field is required' : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
            <Autocomplete
              value={selectNVR}
              onChange={handleDDNSChange}
              options={nvrs || []}
              getOptionLabel={option => option.label || ''}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Smart NVR'
                  fullWidth
                  error={errorNVR}
                  helperText={errorNVR ? 'This field is required' : ''}
                />
              )}
              onFocus={handleComboboxFocusDevice}
            />
          </Grid>

          <Grid item xs={3.9}>
            <Autocomplete
              value={regionsSelect}
              onChange={handleRegionsChange}
              options={regions || []}
              getOptionLabel={option => option.label || ''}
              renderInput={params => <CustomTextField {...params} label='Region' fullWidth />}
              onFocus={handleComboboxFocusRegions}
            />{' '}
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={3.9}>
            <CustomTextField label='Latitude' type='text' value={lat || ''} onChange={handleLatitudeChange} fullWidth />
          </Grid>
          <Grid item xs={0.1}></Grid>
          <Grid item xs={4}>
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
            {formatDDNS(isOfflineSetting)} device is offline
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>Channel</Typography>
        </Grid>
        <Grid item xs={12} component={Paper}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Channel Name</TableCell>
                  <TableCell>Proxied</TableCell>
                  <TableCell align='center'>Channel URL</TableCell>
                  <TableCell align='center'>StreamType</TableCell>
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
                      <TableCell style={{ width: '30%' }}>
                        <CustomTextField
                          type='text'
                          value={row.name}
                          onChange={event => handleChannelNameChange(index, event)}
                        />{' '}
                      </TableCell>
                      <TableCell>
                        {' '}
                        <Checkbox checked={row.isProxied} onChange={event => handleProxiedChange(index, event)} />
                      </TableCell>
                      <TableCell align='right' style={{ width: '50%' }}>
                        <CustomTextField
                          type='text'
                          value={row.url}
                          onChange={event => handleChannelUrlChange(index, event)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align='right' style={{ width: '20%' }}>
                        <CustomTextField
                          type='text'
                          value={row.codec}
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
            <div style={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={9.4}>
                  <Autocomplete
                    options={options}
                    getOptionLabel={option => option.description}
                    onInputChange={handleSearchChange}
                    onChange={handlePlaceSelect}
                    renderInput={params => <CustomTextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={2.6}>
                  <Button variant='contained' onClick={handleReturnToMarker}>
                    <Icon icon='tabler:current-location' />
                    Reset location
                  </Button>
                </Grid>
              </Grid>

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
                    <CustomMapPin />
                  </Marker>
                )}
              </ReactMapGL>
            </div>
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
            Save
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Grid>
    </div>
  )
}

export default Device
