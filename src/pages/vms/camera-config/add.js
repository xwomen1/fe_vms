import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Box, Autocomplete, Button, FormControl, IconButton, InputLabel, Paper, Select } from '@mui/material'
import Swal from 'sweetalert2'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import RolePopup from './popups/ChangePassword'
import Passwords from './popups/PassWord'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import toast from 'react-hot-toast'

import Network from './popups/Network'
import Video from './popups/video'
import Image from './popups/Image'
import Checkbox from '@mui/material/Checkbox'
import Cloud from './popups/Cloud'
import ConnectCamera from './popups/ConnectCamera'
import VideoConnectCamera from './popups/VideoConnectCamera'
import PopupScanOnvif from './popups/AddOnvif'
import PopupScanHik from './popups/AddHik'
import PopupScanDungIP from './popups/AddDungIP'
import PopupScan from './popups/Add'
import CircularProgress from '@mui/material/CircularProgress'
import Edit from './popups/Edit'
import CustomDialog from '../../pages/face_management/CustomDialog/CustomDialog'
import ImportPopup from './popups/ImportPopup'

const Add = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupP, setOpenPopupP] = useState(false)
  const [selectNVR, setSelectedNVR] = useState('')
  const defaultValue = ''
  const [endURL, setEndUrl] = useState('')
  const defaultCameraID = '0eb23593-a9b1-4278-9fb1-4d18f30ed6ff'

  const [openPopupNetwork, setOpenPopupNetwork] = useState(false)
  const [openPopupVideo, setOpenPopupVideo] = useState(false)
  const [openPopupImage, setOpenPopupImage] = useState(false)
  const [openPopupCloud, setOpenPopupCloud] = useState(false)
  const [openPopupConnectCamera, setOpenPopupConnectCamera] = useState(false)
  const [openPopupVideoConnectCamera, setOpenPopupVideoConnectCamera] = useState(false)
  const [assettype, setAssetType] = useState([])
  const [nvrs, setNVR] = useState([])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [status1, setStatus1] = useState(25)
  const [startURL, setStartUrl] = useState('')

  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')
  const [startHost, setStartHost] = useState('')
  const [endHost, setEndHost] = useState('')
  const [openPopupResponseDungIP, setOpenPopupResponseDungIP] = useState(false)
  const [url, setUrl] = useState('')
  const [reload, setReload] = useState(0)
  const [host, setHost] = useState('')
  const [userName, setUsername] = useState('')
  const [passWord, setPassWord] = useState('')
  const [response, setResponse] = useState('')
  const [openPopupResponse, setOpenPopupResponse] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedNvrId, setSelectedNvrId] = useState(null)
  const [idBox, setIdBox] = useState(null)
  const [idBoxs, setIdBoxs] = useState(selectNVR?.value)

  const [popupMessage, setPopupMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [openPopupResponseOnvif, setOpenPopupResponseOnvif] = useState(false)
  const [openPopupResponseHik, setOpenPopupResponseHik] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
        actions: 'swal-actions'
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton()
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#ff9f43'
        }
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  console.log(idBox, 'idbox')

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const fetchNicTypes = async () => {
    try {
      // setLoading(true)
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/device', config)

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

  const handleComboboxFocus = () => {
    fetchNicTypes()
  }

  const handleScan = async () => {
    setOpenPopupResponseDungIP(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        url,
        idBox: selectNVR?.value,
        host,
        userName,
        passWord
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/scandevicestaticip',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)
      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device_ip'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.message}`)
      }

      // // setOpenPopupResponseDungIP(false)
      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  console.log(selectNVR)

  const handleRadioChange = event => {
    setSelectedValue(event.target.value)
    console.log(selectedValue)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  // const handleCheckboxChange = id => {
  //   const isSelected = selectedIds.includes(id)
  //   if (isSelected) {
  //     setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
  //     setSelectedNvrId(null)
  //   } else {
  //     setSelectedIds([...selectedIds, id])
  //     setSelectedNvrId(id)
  //   }
  // }
  const handleOpenPopup = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const fetchFilteredOrAllUsers = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: pageSize,
          page: page,
          keyword: value
        }
      }
      const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
      setStatus1(response.data.isOfflineSetting)
      setAssetType(response.data)
      setTotal(response.data.page)
      console.log(response.data[0].id)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleDelete = idDelete => {
    showAlertConfirm({
      text: 'Bạn có chắc chắn muốn xóa?'
    }).then(({ value }) => {
      if (value) {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        if (!token) {
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        let urlDelete = `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/${idDelete}`
        axios
          .delete(urlDelete, config)
          .then(() => {
            setDialogTitle('Xóa camera thành công')
            setIsSuccess(true)
            const updatedData = assettype.filter(assettype => assettype.id !== idDelete)
            setAssetType(updatedData)
            fetchFilteredOrAllUsers()
          })
          .catch(err => {
            setDialogTitle('xóa không thành công')
            setDialogMessage(err.message || 'xóa không thành công')
            setIsSuccess(false)
          })
          .finally(() => {
            setLoading(false)
            setDialogOpen(true)
          })
      }
    })
  }

  const handleAddPClick = cameraId => {
    setOpenPopupP(true)
    setIdBox(cameraId)
    setSelectedNvrId(cameraId)
  }

  const handleClosePPopup = () => {
    setOpenPopupP(false)
  }

  const handleCloseNetWorkPopup = () => {
    setOpenPopupNetwork(false)
  }

  const handleCloseVideoPopup = () => {
    setOpenPopupVideo(false)
  }

  const handleCloseImagePopup = () => {
    setOpenPopupImage(false)
  }

  const handleCloseCloudPopup = () => {
    setOpenPopupCloud(false)
  }

  const handleAddConnectCameraClick = () => {
    setOpenPopupConnectCamera(true)
  }

  const handleCloseConnectCameraPopup = () => {
    setOpenPopupConnectCamera(false)
  }

  const handleAddVideoConnectClick = () => {
    setOpenPopupVideoConnectCamera(true)
  }

  const handleCloseVideoConnectPopup = () => {
    setOpenPopupVideoConnectCamera(false)
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleDDNSChange = (event, newValue) => {
    setSelectedNVR(newValue)
    setIdBox(newValue.value)
  }
  useEffect(() => {
    setSelectedNVR({
      label: defaultValue,
      value: defaultValue
    })
  }, [defaultValue])

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const handleScanOnvif = async () => {
    setOpenPopupResponseOnvif(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        idBox: selectNVR?.value,
        userName,
        passWord,
        protocol: '0'
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/scandevice',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)

      toast.success('Thành công')

      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const handleScanHik = async () => {
    setOpenPopupResponseHik(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        idBox: selectNVR?.value,
        userName,
        passWord,
        protocol: '1'
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/devicescanhikivision',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)

      toast.success('Thành công')

      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  const handleScanDaiIP = async () => {
    setOpenPopupResponse(true)
    setLoading(true)
    setPopupMessage('') // Reset thông điệp khi bắt đầu scan
    setIsError(false) // Reset trạng thái lỗi khi bắt đầu scan
    try {
      const payload = {
        idBox: selectNVR?.value,
        startHost: parseInt(startHost),
        endHost: parseInt(endHost),
        startURL,
        endURL,
        userName,
        passWord
      }
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.post(
        'https://sbs.basesystem.one/ivis/vms/api/v0/device/onvif/devicescanlistip',
        payload,
        config
      )

      setResponse(response.data)
      setLoading(false)

      toast.success('Thành công')

      setPopupMessage('Quét thành công')
      setIsError(false) // Không phải lỗi
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'No response from the server device, timeout: scan_device_ip'
      ) {
        setPopupMessage('Thiết bị chưa phản hồi')
      } else {
        setPopupMessage(`${error.message}`)
      }

      setIsError(true) // Đánh dấu là lỗi
      setLoading(false)
    }
  }

  console.log(selectNVR, 'selectNVR', nvrs, 'nvrs')

  const passwords = useCallback(val => {
    setValue(val)
  }, [])
  useEffect(() => {
    const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/cameraStatus/${defaultCameraID}`)

    ws.onmessage = event => {
      const { dataType, data } = JSON.parse(event.data)
      if (dataType === 'cameraStatus') {
        const cameraStatusUpdates = JSON.parse(data)
        updateCameraStatus(cameraStatusUpdates)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  const updateCameraStatus = useCallback(
    cameraStatusUpdates => {
      const cameraStatusMap = new Map(
        cameraStatusUpdates.map(status => [status.id, status.statusValue.name, status.ip])
      )

      // Lặp qua các mục trong Map sử dụng for...of
      for (const entry of cameraStatusMap.entries()) {
        const [id, status, ip] = entry

        const entry1 = {
          id: id,
          status: status,
          ip: ip
        }

        setAssetType(prevAssetType => {
          const newAssetType = prevAssetType.map(camera => {
            if (camera.id === entry1.id) {
              if (camera.status.name !== entry1.status) {
                console.log('AssetType with ID', entry1.id, 'has changed status.')
                console.log('Previous status:', camera.status.name)
                console.log('New status:', entry1.status)
              }

              return { ...camera, status: { name: entry1.status } }
            }

            return camera
          })

          // console.log('New Asset Type:', newAssetType) // Log updated asset type

          return newAssetType
        })
      }
    },
    [assettype]
  )
  console.log(total, 'totalpage')

  const statusText = status1 ? 'Đang hoạt động' : 'Không hoạt động'

  useEffect(() => {
    const fetchFilteredOrAllUsers = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: pageSize,
            page: page,
            keyword: value
          }
        }
        const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
        setStatus1(response.data.isOfflineSetting)
        setAssetType(response.data)
        setTotal(response.data.page)
        console.log(response.data[0].id)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchFilteredOrAllUsers()
  }, [page, pageSize, total, value, reload])

  const top100Films = [{ title: 'Onvif' }, { title: 'Hikvision' }]

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Grid container spacing={2} style={{ marginTop: '1%' }}>
              <Grid item xs={8}>
                <div>
                  <RadioGroup value={selectedValue} onChange={handleRadioChange} style={{ marginLeft: 50 }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <FormControlLabel value='dungIp' control={<Radio />} label='Dùng IP' />
                      </Grid>
                      <Grid item>
                        <FormControlLabel value='daiIp' control={<Radio />} label='Dải IP' />
                      </Grid>
                      <Grid item xs={3}>
                        <Autocomplete
                          fullWidth
                          options={top100Films}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.title || ''}
                          renderInput={params => <CustomTextField placeholder='Khác' {...params} />}
                          onChange={(event, value) => setSelectedValue(value ? value.title.toLowerCase() : '')}
                        />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </div>
              </Grid>
              <Grid item xs={4} style={{ display: 'flex' }}>
                <Grid item>
                  <Button variant='contained' onClick={handleOpenPopup}>
                    <Icon icon='tabler:file-import' />
                  </Button>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item>
                  <CustomTextField
                    value={value}
                    onChange={e => handleFilter(e.target.value)}
                    placeholder='Search…'
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 2, display: 'flex' }}>
                          <Icon fontSize='1.25rem' icon='tabler:search' />
                        </Box>
                      ),
                      endAdornment: (
                        <IconButton size='small' title='Clear' aria-label='Clear'>
                          <Icon fontSize='1.25rem' icon='tabler:x' />
                        </IconButton>
                      )
                    }}
                    sx={{
                      width: {
                        xs: 1,
                        sm: 'auto'
                      },
                      '& .MuiInputBase-root > svg': {
                        mr: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {selectedValue === 'dungIp' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>

                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        label='Địa chỉ IP'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField value={host} onChange={e => setHost(e.target.value)} label='Cổng' fullWidth />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.1}></Grid>
                    <Grid item xs={1.8}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={2} style={{ marginTop: '2%' }}>
                      <Button>Cancel</Button>
                      <Button onClick={handleScan} variant='contained'>
                        Quét
                      </Button>
                    </Grid>
                    {loading && <CircularProgress />}
                  </Grid>
                )}
                {openPopupResponseDungIP && (
                  <>
                    <PopupScanDungIP
                      open={openPopupResponseDungIP}
                      url={url}
                      idBoxDungIP={idBox}
                      port={host}
                      setReload={() => setReload(reload + 1)}
                      userName={userName}
                      isError={isError}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadings={loading}
                      onClose={() => setOpenPopupResponseDungIP(false)}
                    />{' '}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                {selectedValue === 'daiIp' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR/AI BOX' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={startURL}
                        onChange={e => setStartUrl(e.target.value)}
                        label='Địa chỉ IP bắt đầu'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                      ----
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={endURL}
                        onChange={e => setEndUrl(e.target.value)}
                        label='Địa chỉ IP kết thúc'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={2}>
                      <CustomTextField
                        value={startHost}
                        onChange={e => setStartHost(e.target.value)}
                        label='Cổng bắt đầu'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={0.4} style={{ marginTop: '2%' }}>
                      ----
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={endHost}
                        onChange={e => setEndHost(e.target.value)}
                        label='Cổng kết thúc'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={4} style={{ marginTop: '1%' }}>
                      <Button>Cancel</Button>
                      <Button onClick={handleScanDaiIP} variant='contained'>
                        Quét
                      </Button>
                    </Grid>
                    <Grid item xs={0.1} style={{ marginTop: '1%', marginLeft: '-20%' }}>
                      {loading && <CircularProgress style={{ top: '5px' }} />}
                    </Grid>
                  </Grid>
                )}
                {openPopupResponse && (
                  <>
                    <PopupScan
                      open={openPopupResponse}
                      userName={userName}
                      idBox={selectNVR}
                      setReload={() => setReload(reload + 1)}
                      isError={isError}
                      idBoxDaiIP={idBox}
                      popupMessage={popupMessage}
                      passWord={passWord}
                      response={response}
                      loadingDaiIP={loading}
                      onClose={() => setOpenPopupResponse(false)}
                    />{' '}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                {selectedValue === 'onvif' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>

                    <Grid item xs={2}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={4} style={{ marginTop: '2%' }}>
                      <Button>Cancel</Button>
                      <Button variant='contained' onClick={handleScanOnvif}>
                        Quét
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {openPopupResponseOnvif && (
                  <>
                    <PopupScanOnvif
                      open={openPopupResponseOnvif}
                      userName={userName}
                      setReload={() => setReload(reload + 1)}
                      passWord={passWord}
                      isError={isError}
                      popupMessage={popupMessage}
                      idBoxOnvif={idBox}
                      response={response}
                      loadingOnvif={loading}
                      onClose={() => setOpenPopupResponseOnvif(false)}
                    />{' '}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                {selectedValue === 'hikvision' && (
                  <Grid
                    container
                    item
                    component={Paper}
                    style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}
                  >
                    <Grid item xs={1.8}>
                      <Autocomplete
                        value={selectNVR}
                        onChange={handleDDNSChange}
                        options={nvrs}
                        getOptionLabel={option => option.label}
                        renderInput={params => <CustomTextField {...params} label='NVR' fullWidth />}
                        onFocus={handleComboboxFocus}

                        // loading={loading}
                      />{' '}
                    </Grid>
                    <Grid item xs={0.1}></Grid>

                    <Grid item xs={2}>
                      <CustomTextField
                        value={userName}
                        onChange={e => setUsername(e.target.value)}
                        label='Đăng nhập'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.4}></Grid>
                    <Grid item xs={2}>
                      <CustomTextField
                        value={passWord}
                        onChange={e => setPassWord(e.target.value)}
                        label='Mật khẩu'
                        type='password'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={0.2}></Grid>

                    <Grid item xs={4} style={{ marginTop: '1%' }}>
                      <Button>Cancel</Button>
                      <Button variant='contained' onClick={handleScanHik}>
                        Quét
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {openPopupResponseHik && (
                  <>
                    <PopupScanHik
                      open={openPopupResponseHik}
                      userName={userName}
                      setReload={() => setReload(reload + 1)}
                      passWord={passWord}
                      isError={isError}
                      popupMessage={popupMessage}
                      idBoxOnvif={idBox}
                      response={response}
                      loadingOnvif={loading}
                      onClose={() => setOpenPopupResponseHik(false)}
                    />{' '}
                  </>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div></div>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ padding: '16px' }}>
                        <Checkbox
                          checked={selectedIds.length === assettype.length}
                          onChange={e => {
                            if (e.target.checked) {
                              const allIds = assettype.map(assetType => assetType.id)
                              setSelectedIds(allIds)
                            } else {
                              setSelectedIds([])
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Tên thiết bị</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Loại</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Địa chỉ IP</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Địa chỉ Mac</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Vị trí</TableCell>
                      <TableCell sx={{ padding: '16px' }}>Trạng thái</TableCell>

                      <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assettype.map((assetType, index) => (
                      <TableRow key={assetType.id}>
                        <TableCell sx={{ padding: '16px' }}>
                          <Checkbox
                            checked={selectedIds.includes(assetType.id)}
                            onChange={() => handleCheckboxChange(assetType.id)}
                          />
                        </TableCell>
                        <TableCell sx={{ padding: '16px' }}>{(page - 1) * pageSize + index + 1} </TableCell>
                        <TableCell sx={{ padding: '16px' }}>{assetType.name}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{assetType.type.name}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{assetType.ipAddress}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{assetType.macAddress}</TableCell>
                        <TableCell sx={{ padding: '16px' }}>{assetType.location}</TableCell>
                        <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                          {assetType.status && assetType.status.name ? (
                            <div
                              style={{
                                backgroundColor: assetType.status.name === 'Hoạt động' ? 'lightgreen' : 'orange',
                                borderRadius: '10px',
                                padding: '5px 10px',
                                width: '70%',
                                display: 'inline-block'
                              }}
                            >
                              {assetType.status.name}
                            </div>
                          ) : (
                            assetType.status.name
                          )}
                        </TableCell>

                        <TableCell sx={{ padding: '16px' }}>
                          <IconButton size='small' onClick={() => handleAddPClick(assetType.id)}>
                            <Icon icon='tabler:edit' />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(assetType.id)}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <br></br>
                <Grid container spacing={2} style={{ padding: 10 }}>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={1.5} style={{ padding: 0 }}>
                    <IconButton onClick={handleOpenMenu}>
                      <Icon icon='tabler:selector' />
                      <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                      {pageSizeOptions.map(size => (
                        <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                          {size}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                  <Grid item xs={6}>
                    <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {openPopupP && (
          <>
            <Edit open={openPopupP} onClose={handleClosePPopup} camera={selectedNvrId} />
          </>
        )}
      </Grid>
      <ImportPopup open={openPopup} handleClose={handleClosePopup} />
      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        title={dialogTitle}
        message={dialogMessage}
        isSuccess={isSuccess}
      />
    </>
  )
}

export default Add
